import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Dpiter",
  description: "Get in touch with the Dpiter team.",
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Contact Us</h1>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Get in Touch</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Have questions, suggestions, or feedback? We'd love to hear from you! Reach out to us through any of the following channels:
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
          </div>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
