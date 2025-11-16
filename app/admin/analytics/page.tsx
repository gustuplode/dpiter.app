"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Globe, SearchIcon, TrendingUp, MessageSquare, Trash2 } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface AnalyticsData {
  visitors: number
  countries: { name: string; count: number }[]
  keywords: { term: string; count: number }[]
  referrers: { source: string; count: number }[]
}

interface Rating {
  id: string
  item_id: string
  item_type: string
  rating: number
  comment: string | null
  created_at: string
  user_id: string
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    visitors: 0,
    countries: [],
    keywords: [],
    referrers: [],
  })
  const [ratings, setRatings] = useState<Rating[]>([])
  const [isLoadingRatings, setIsLoadingRatings] = useState(true)
  const [canReset, setCanReset] = useState(false)

  useEffect(() => {
    const visitorData = localStorage.getItem("dpiter_analytics")
    if (visitorData) {
      setAnalytics(JSON.parse(visitorData))
    }

    trackVisitor()
    
    loadRatings()
    
    const interval = setInterval(() => {
      loadRatings()
    }, 5000)
    
    const adminEmail = localStorage.getItem("admin_email")
    setCanReset(!!adminEmail)
    
    return () => clearInterval(interval)
  }, [])

  const loadRatings = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
      
      if (data && !error) {
        setRatings(data)
      }
    } catch (error) {
      console.error("Error loading ratings:", error)
    } finally {
      setIsLoadingRatings(false)
    }
  }

  const deleteRating = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rating?")) return
    
    try {
      const supabase = createClient()
      await supabase.from("ratings").delete().eq("id", id)
      loadRatings()
    } catch (error) {
      console.error("Error deleting rating:", error)
    }
  }

  const trackVisitor = () => {
    const referrer = document.referrer
    const urlParams = new URLSearchParams(window.location.search)
    const searchQuery = urlParams.get("q") || urlParams.get("search")

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const country = data.country_name || "Unknown"
        
        const currentAnalytics = JSON.parse(localStorage.getItem("dpiter_analytics") || '{"visitors":0,"countries":[],"keywords":[],"referrers":[]}')
        
        currentAnalytics.visitors += 1
        
        const countryIndex = currentAnalytics.countries.findIndex((c: any) => c.name === country)
        if (countryIndex >= 0) {
          currentAnalytics.countries[countryIndex].count += 1
        } else {
          currentAnalytics.countries.push({ name: country, count: 1 })
        }
        
        if (searchQuery) {
          const keywordIndex = currentAnalytics.keywords.findIndex((k: any) => k.term === searchQuery)
          if (keywordIndex >= 0) {
            currentAnalytics.keywords[keywordIndex].count += 1
          } else {
            currentAnalytics.keywords.push({ term: searchQuery, count: 1 })
          }
        }
        
        if (referrer) {
          const referrerDomain = new URL(referrer).hostname
          const referrerIndex = currentAnalytics.referrers.findIndex((r: any) => r.source === referrerDomain)
          if (referrerIndex >= 0) {
            currentAnalytics.referrers[referrerIndex].count += 1
          } else {
            currentAnalytics.referrers.push({ source: referrerDomain, count: 1 })
          }
        }
        
        localStorage.setItem("dpiter_analytics", JSON.stringify(currentAnalytics))
        setAnalytics(currentAnalytics)
      })
      .catch((err) => console.error("Error fetching geolocation:", err))
  }

  const resetAnalytics = () => {
    if (!confirm("Are you sure you want to reset all analytics data? This cannot be undone.")) return
    
    localStorage.setItem("dpiter_analytics", JSON.stringify({
      visitors: 0,
      countries: [],
      keywords: [],
      referrers: []
    }))
    
    setAnalytics({
      visitors: 0,
      countries: [],
      keywords: [],
      referrers: []
    })
  }

  return (
    <div className="min-h-screen bg-[#F4F4F7] dark:bg-[#1a1a1d] pb-20">
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 justify-between border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link href="/admin">
          <Button variant="ghost" className="size-10 p-0">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Analytics</h1>
        {canReset && (
          <Button onClick={resetAnalytics} variant="ghost" className="text-red-500 hover:text-red-700">
            Reset
          </Button>
        )}
      </header>

      <main className="container mx-auto max-w-4xl p-4 space-y-6">
        <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-[#4A90E2]" />
            <h2 className="text-lg font-semibold">Total Visitors</h2>
          </div>
          <p className="text-4xl font-bold text-[#4A90E2]">{analytics.visitors}</p>
        </div>

        <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-[#4A90E2]" />
            <h2 className="text-lg font-semibold">Visitors by Country</h2>
          </div>
          <div className="space-y-3">
            {analytics.countries.length > 0 ? (
              analytics.countries
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((country, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{country.name}</span>
                    <span className="text-sm font-semibold text-[#4A90E2]">{country.count}</span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-slate-500">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="h-6 w-6 text-[#4A90E2]" />
            <h2 className="text-lg font-semibold">Search Keywords</h2>
          </div>
          <div className="space-y-3">
            {analytics.keywords.length > 0 ? (
              analytics.keywords
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((keyword, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{keyword.term}</span>
                    <span className="text-sm font-semibold text-[#4A90E2]">{keyword.count}</span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-slate-500">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-[#4A90E2]" />
            <h2 className="text-lg font-semibold">Traffic Sources</h2>
          </div>
          <div className="space-y-3">
            {analytics.referrers.length > 0 ? (
              analytics.referrers
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((referrer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{referrer.source}</span>
                    <span className="text-sm font-semibold text-[#4A90E2]">{referrer.count}</span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-slate-500">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2a2a2e] rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-[#4A90E2]" />
            <h2 className="text-lg font-semibold">User Feedback & Ratings</h2>
          </div>
          <div className="space-y-3">
            {isLoadingRatings ? (
              <p className="text-sm text-slate-500">Loading feedback...</p>
            ) : ratings.length > 0 ? (
              ratings.map((rating) => (
                <div key={rating.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-yellow-400">
                              {star <= rating.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {rating.item_type}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {rating.comment}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(rating.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteRating(rating.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No feedback yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
