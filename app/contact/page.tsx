import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | DPITER.shop - Get in Touch",
  description:
    "Contact DPITER.shop for questions about our curated fashion collections from Amazon, Flipkart, Meesho, Myntra. We're here to help with your shopping experience.",
  keywords:
    "contact dpiter, dpiter support, dpiter customer service, fashion help, shopping assistance, dpiter email, dpiter social media, dpiter contact form",
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Contact Us</h1>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Website Information</h2>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p>
              <strong>Website:</strong>{" "}
              <a href="https://dpiter.shop" className="text-[#3B82F6] hover:underline">
                dpiter.shop
              </a>
            </p>
            <p>
              <strong>Owner/Publisher:</strong> DPITER.shop Team
            </p>
            <p>
              <strong>Founded:</strong> 2024
            </p>
            <p>
              <strong>Location:</strong> India (Serving India, USA, UK & Worldwide)
            </p>
            <p>
              <strong>Business Type:</strong> Fashion Discovery & Curation Platform
            </p>
            <p className="text-sm mt-3">
              DPITER.shop is independently owned and operated. We curate fashion from trusted marketplaces like Amazon,
              Flipkart, Meesho, Myntra & eBay. We do not process payments - all purchases happen on verified marketplace
              platforms.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Get in Touch</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Have questions, suggestions, or feedback about{" "}
              <a href="https://dpiter.shop" className="text-primary hover:underline">
                <strong>DPITER.shop</strong>
              </a>
              ? We'd love to hear from you! Reach out to us through any of the following channels. Whether you need help
              with our{" "}
              <a href="https://dpiter.shop/search" className="text-primary hover:underline">
                collections
              </a>
              , have questions about products from{" "}
              <a
                href="https://www.amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Amazon
              </a>
              ,{" "}
              <a
                href="https://www.flipkart.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Flipkart
              </a>
              , or{" "}
              <a
                href="https://www.meesho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Meesho
              </a>
              , or want to learn more about our platform, we're here to help.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Email</h3>
            <a href="mailto:deepitermark@gmail.com" className="text-[#F97316] hover:underline text-lg font-medium">
              deepitermark@gmail.com
            </a>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              For business inquiries, support requests, and general questions
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Social Media</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.instagram.com/deepiter_mark?igsh=MXh5djE1NzlkMTlo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F97316] hover:underline"
                  >
                    Instagram: @deepiter_mark
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/share/1PwVj2Bg4Z/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#F97316] hover:underline"
                  >
                    Facebook: Dpiter
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Business Hours</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday - Sunday: 10:00 AM - 4:00 PM
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Response Time</h3>
              <p className="text-slate-700 dark:text-slate-300">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="https://dpiter.shop" className="text-[#F97316] hover:underline">
                    Home - DPITER.shop
                  </a>
                </li>
                <li>
                  <a href="https://dpiter.shop/search" className="text-[#F97316] hover:underline">
                    Browse Collections
                  </a>
                </li>
                <li>
                  <a href="https://dpiter.shop/faq" className="text-[#F97316] hover:underline">
                    FAQ - Common Questions
                  </a>
                </li>
                <li>
                  <a href="https://dpiter.shop/about" className="text-[#F97316] hover:underline">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="https://dpiter.shop/sitemap.xml" className="text-[#F97316] hover:underline">
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
