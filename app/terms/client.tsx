"use client"

import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { MessageCircle, Mail, Smartphone, Globe, Users } from "lucide-react"

function CollaborationSection() {
  const collaborationLinks = [
    {
      icon: Users,
      label: "Collaborate",
      href: "https://wa.me/919939091568?text=Hi%20DPITER!%20I'm%20interested%20in%20collaboration.",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      hoverColor: "hover:from-purple-600 hover:to-indigo-700",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/919939091568",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:deepitermark@gmail.com",
      color: "bg-gradient-to-br from-red-500 to-rose-600",
      hoverColor: "hover:from-red-600 hover:to-rose-700",
    },
    {
      icon: Smartphone,
      label: "Install App",
      href: "#install-pwa",
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
      hoverColor: "hover:from-blue-600 hover:to-cyan-700",
      isPWA: true,
    },
    {
      icon: Globe,
      label: "Website",
      href: "https://dpiter.shop",
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      hoverColor: "hover:from-amber-600 hover:to-orange-700",
    },
  ]

  return (
    <section className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">Connect With Us</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {collaborationLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={
              link.isPWA
                ? (e) => {
                    e.preventDefault()
                    if (typeof window !== "undefined" && "deferredPrompt" in window) {
                      ;(window as any).deferredPrompt?.prompt()
                    } else {
                      alert('To install: Click the browser menu and select "Install App" or "Add to Home Screen"')
                    }
                  }
                : undefined
            }
            className={`
              flex flex-col items-center justify-center
              w-20 h-20 sm:w-24 sm:h-24
              rounded-2xl ${link.color} ${link.hoverColor}
              text-white shadow-lg
              transform transition-all duration-300
              hover:scale-110 hover:shadow-xl
              active:scale-95
            `}
          >
            <link.icon className="w-7 h-7 sm:w-8 sm:h-8 mb-1" strokeWidth={1.5} />
            <span className="text-[10px] sm:text-xs font-medium">{link.label}</span>
          </a>
        ))}
      </div>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Questions? Reach out anytime. We typically respond within 24 hours.
      </p>
    </section>
  )
}

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
              By accessing and using <strong>DPITER.shop</strong>, you agree to be bound by these Terms of Service. If
              you do not agree with any part of these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Platform Description</h2>
            <p>
              DPITER.shop is a product discovery and curation platform that showcases products from various e-commerce
              marketplaces including <strong>Amazon, Flipkart, Meesho, Myntra, and eBay</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do NOT sell products directly</li>
              <li>We do NOT process payments</li>
              <li>We do NOT handle shipping or delivery</li>
              <li>All transactions occur on third-party marketplace websites</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">User Responsibilities</h2>
            <p>When using DPITER.shop, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform only for lawful purposes</li>
              <li>Provide accurate information if creating an account</li>
              <li>Not attempt to hack, disrupt, or damage our services</li>
              <li>Respect intellectual property rights</li>
              <li>Not use automated tools to scrape content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Product Information</h2>
            <p>
              Product details, prices, and availability shown on DPITER.shop are sourced from third-party marketplaces.
              We strive for accuracy but cannot guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Current pricing (prices may change on marketplace websites)</li>
              <li>Product availability</li>
              <li>Complete accuracy of product descriptions</li>
              <li>Delivery timelines</li>
            </ul>
            <p>Always verify details on the actual marketplace before making a purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Affiliate Disclosure</h2>
            <p>
              DPITER.shop participates in affiliate programs. When you click on product links and make purchases, we may
              earn a commission at no additional cost to you. This helps us maintain and improve our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Intellectual Property</h2>
            <p>
              The DPITER.shop name, logo, and original content are protected by intellectual property laws. You may not
              use our branding without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Limitation of Liability</h2>
            <p>DPITER.shop is not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Issues with products purchased through marketplace links</li>
              <li>Payment disputes with third-party sellers</li>
              <li>Shipping or delivery problems</li>
              <li>Product defects or quality issues</li>
              <li>Any losses resulting from marketplace transactions</li>
            </ul>
            <p>For any purchase-related issues, please contact the respective marketplace directly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of DPITER.shop after changes
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be resolved in Indian courts.</p>
          </section>

          <CollaborationSection />
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
