"use client"

import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CollaborationIcons } from "@/components/collaboration-icons"

export default function TermsPageClient() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms of Service</h1>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Agreement to Terms</h2>
            <p>
              By accessing and using <strong>DPITER.shop</strong>, you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Platform Description</h2>
            <p>
              DPITER.shop is a product discovery platform showcasing products from{" "}
              <strong>Amazon, Flipkart, Meesho, Myntra, and eBay</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do NOT sell products directly</li>
              <li>We do NOT process payments</li>
              <li>We do NOT handle shipping or delivery</li>
              <li>All transactions occur on third-party marketplaces</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform only for lawful purposes</li>
              <li>Provide accurate information if creating an account</li>
              <li>Not attempt to hack or disrupt our services</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Affiliate Disclosure</h2>
            <p>We may earn commissions when you make purchases through our links at no additional cost to you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Limitation of Liability</h2>
            <p>DPITER.shop is not liable for issues with products purchased through marketplace links.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Governing Law</h2>
            <p>These terms are governed by the laws of India.</p>
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
