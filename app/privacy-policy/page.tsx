import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Dpiter",
  description: "Read our privacy policy to understand how we collect, use, and protect your information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Introduction</h2>
            <p>
              Welcome to Dpiter. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Information We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Identity Data: name, username, or similar identifier</li>
              <li>Contact Data: email address and telephone numbers</li>
              <li>Technical Data: internet protocol (IP) address, browser type and version</li>
              <li>Usage Data: information about how you use our website and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals to facilitate our service, provide service on our behalf, or assist us in analyzing how our service is used. These third parties have access to your personal data only to perform these tasks on our behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our contact page.
            </p>
          </section>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
