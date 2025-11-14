import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Dpiter",
  description: "Terms of service for using Dpiter platform.",
}

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Agreement to Terms</h2>
            <p>
              By accessing and using Dpiter, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on Dpiter for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Disclaimer</h2>
            <p>
              The materials on Dpiter are provided on an 'as is' basis. Dpiter makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Affiliate Disclosure</h2>
            <p>
              Dpiter participates in various affiliate programs. When you click on product links and make purchases, we may earn a commission at no additional cost to you. This helps support our platform and allows us to continue providing curated collections.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Limitations</h2>
            <p>
              In no event shall Dpiter or its suppliers be liable for any damages arising out of the use or inability to use the materials on Dpiter, even if Dpiter or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Revisions</h2>
            <p>
              Dpiter may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the current version of these Terms of Service.
            </p>
          </section>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
