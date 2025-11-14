import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | Dpiter",
  description: "Frequently asked questions about Dpiter and our services.",
}

export default function FAQPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What is Dpiter?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Dpiter is a curated e-commerce platform that brings together the best fashion collections and products from various brands. We help you discover trending styles and exclusive deals all in one place.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How do I make a purchase?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              When you click on a product, you'll be redirected to the seller's website where you can complete your purchase. We partner with trusted retailers to ensure a safe shopping experience.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What is the wishlist feature?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Our wishlist feature allows you to save your favorite products for later. Simply click the heart icon on any product to add it to your wishlist. Your wishlist is stored locally on your device.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Are there any shipping fees?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Shipping fees vary depending on the retailer you purchase from. Please check the individual retailer's shipping policy for detailed information.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How can I contact support?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              You can reach out to us through our contact page. We typically respond within 24-48 hours.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Do you offer returns?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Return policies are managed by the individual retailers. Please refer to the retailer's return policy on their website for specific details.
            </p>
          </div>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
