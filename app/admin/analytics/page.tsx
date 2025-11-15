"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Globe, SearchIcon, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AnalyticsData {
  visitors: number
  countries: { name: string; count: number }[]
  keywords: { term: string; count: number }[]
  referrers: { source: string; count: number }[]
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    visitors: 0,
    countries: [],
    keywords: [],
    referrers: [],
  })

  useEffect(() => {
    // Get visitor data from localStorage
    const visitorData = localStorage.getItem("dpiter_analytics")
    if (visitorData) {
      setAnalytics(JSON.parse(visitorData))
    }

    // Track current visitor
    trackVisitor()
  }, [])

  const trackVisitor = () => {
    // Get referrer and search params
    const referrer = document.referrer
    const urlParams = new URLSearchParams(window.location.search)
    const searchQuery = urlParams.get("q") || urlParams.get("search")

    // Get geolocation (simplified - in production use IP geolocation API)
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const country = data.country_name || "Unknown"
        
        // Update analytics
        const currentAnalytics = JSON.parse(localStorage.getItem("dpiter_analytics") || '{"visitors":0,"countries":[],"keywords":[],"referrers":[]}')
        
        currentAnalytics.visitors += 1
        
        // Update countries
        const countryIndex = currentAnalytics.countries.findIndex((c: any) => c.name === country)
        if (countryIndex >= 0) {
          currentAnalytics.countries[countryIndex].count += 1
        } else {
          currentAnalytics.countries.push({ name: country, count: 1 })
        }
        
        // Update keywords
        if (searchQuery) {
          const keywordIndex = currentAnalytics.keywords.findIndex((k: any) => k.term === searchQuery)
          if (keywordIndex >= 0) {
            currentAnalytics.keywords[keywordIndex].count += 1
          } else {
            currentAnalytics.keywords.push({ term: searchQuery, count: 1 })
          }
        }
        
        // Update referrers
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

  return (
    <div className="min-h-screen bg-[#F4F4F7] dark:bg-[#1a1a1d]">
      <header className="flex items-center bg-white dark:bg-[#2a2a2e] p-4 justify-between border-b border-[#E5E7EB] dark:border-[#4a4a50]">
        <Link href="/admin">
          <Button variant="ghost" className="size-10 p-0">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Analytics</h1>
        <div className="w-10" />
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
      </main>
    </div>
  )
}
