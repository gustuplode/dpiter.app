"use client"

import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CollaborationIcons } from "@/components/collaboration-icons"
import { ShieldCheck, TrendingUp, Sparkles, Clock } from "lucide-react"

export default function AboutPageClient() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About DPITER.shop</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-xs opacity-90">Safe & Verified</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-xs opacity-90">Products Curated</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">5+</div>
            <div className="text-xs opacity-90">Partner Platforms</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white text-center">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">Daily</div>
            <div className="text-xs opacity-90">Updates</div>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">What is DPITER.shop?</h2>
            <p>
              <strong>DPITER.shop</strong> is India's premier curated e-commerce platform showcasing the best products
              from trusted marketplaces including <strong>Amazon, Flipkart, Myntra, Meesho</strong>, and{" "}
              <strong>eBay</strong>.
            </p>
          </section>

          <section className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">100% Safe & Secure</h2>
            <p className="mb-0">
              <strong>DPITER.shop does NOT collect any payments.</strong> All purchases happen on verified platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Browse curated collections</strong> - Handpicked trending products
              </li>
              <li>
                <strong>Click to view details</strong> - See product information and pricing
              </li>
              <li>
                <strong>Redirect to marketplace</strong> - Safely redirected to trusted platforms
              </li>
              <li>
                <strong>Complete your purchase</strong> - Buy securely from the marketplace
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Trusted Partners</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              {["Amazon", "Flipkart", "Meesho", "Myntra", "eBay"].map((platform) => (
                <div
                  key={platform}
                  className="bg-white dark:bg-slate-700 rounded-lg p-3 text-center shadow-sm border border-slate-200 dark:border-slate-600"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{platform}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
            <CollaborationIcons title="Connect With Us" />
          </div>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
