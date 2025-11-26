"use client"

import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { MessageCircle, Mail, Smartphone, Globe, Users } from "lucide-react"

// <CHANGE> Added collaboration section component with icons
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
                    // PWA install prompt
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

export default function PrivacyPolicyClientPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Overview</h2>
            <p>
              <strong>DPITER.shop</strong> is a fashion discovery and curation platform. We help users find trending
              fashion from trusted marketplaces like <strong>Amazon, Flipkart, Meesho, Myntra, and eBay</strong>.
            </p>
            <p className="font-semibold text-lg">
              Important: DPITER.shop does NOT collect payments or process orders. All transactions happen on the
              verified marketplace platforms you're redirected to.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">No Payment Processing</h2>
            <p>
              <strong>DPITER.shop never stores or processes:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Credit card information</li>
              <li>Bank details</li>
              <li>Payment credentials</li>
              <li>Financial data of any kind</li>
            </ul>
            <p>
              When you click on a product, you are forwarded to trusted marketplaces like{" "}
              <strong>Amazon, Meesho, Flipkart, Myntra, and eBay</strong>. All payment processing happens on their
              secure platforms with industry-standard encryption.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Information We Collect</h2>
            <p>DPITER.shop may collect basic analytics for performance improvement:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Anonymous usage data</strong> - Pages visited, time spent, clicks (via Google Analytics)
              </li>
              <li>
                <strong>Browser information</strong> - Browser type, device type, operating system
              </li>
              <li>
                <strong>Wishlist preferences</strong> - Stored locally on your device, not on our servers
              </li>
              <li>
                <strong>User ratings & reviews</strong> - If you choose to rate products (stored with Firebase
                authentication)
              </li>
            </ul>
            <p>We do NOT collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal identification details (unless you sign in with Google for profile features)</li>
              <li>Shipping addresses</li>
              <li>Phone numbers for orders</li>
              <li>Any financial information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Cookies & Tracking</h2>
            <p>DPITER.shop uses cookies and similar technologies to improve user experience. These include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Essential cookies</strong> - For basic website functionality
              </li>
              <li>
                <strong>Analytics cookies</strong> - To understand how users interact with our platform
              </li>
              <li>
                <strong>Affiliate tracking</strong> - To ensure proper commission tracking when you purchase from
                marketplaces
              </li>
            </ul>
            <p>You can disable cookies in your browser settings, though this may affect website functionality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Third-Party Links & Redirects
            </h2>
            <p>
              DPITER.shop contains links to external marketplaces:{" "}
              <strong>Amazon, Flipkart, Meesho, Myntra, eBay</strong>. When you click these links:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You leave DPITER.shop and enter the marketplace's website</li>
              <li>Their privacy policies and terms apply</li>
              <li>DPITER.shop is not responsible for their data practices</li>
              <li>All affiliate links are secure and encrypted</li>
            </ul>
            <p>We only partner with verified, trusted marketplaces to ensure your safety.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">User Accounts (Optional)</h2>
            <p>If you choose to sign in with Google for profile features:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We store your email and profile picture via Firebase Authentication</li>
              <li>This data is used only for personalized features (wishlist sync, ratings)</li>
              <li>You can delete your account anytime</li>
              <li>We never share your email with third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Data Security</h2>
            <p>While DPITER.shop does not process payments, we take data security seriously:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS encryption on all pages</li>
              <li>Secure Firebase authentication</li>
              <li>Regular security audits</li>
              <li>No storage of sensitive financial data</li>
            </ul>
            <p>
              Remember: The user experience remains <strong>100% safe</strong> because actual purchases happen on
              verified marketplace platforms with their own security measures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your data (if you have a user account)</li>
              <li>Request data deletion</li>
              <li>Opt out of analytics tracking</li>
              <li>Disable cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated
              date.
            </p>
          </section>

          {/* <CHANGE> Added collaboration icons section */}
          <CollaborationSection />
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
