import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Info | Dpiter",
  description: "Learn about shipping policies for products on Dpiter.",
}

export default function ShippingPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Shipping Information</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">How Shipping Works</h2>
            <p>
              When you purchase products through Dpiter, you'll be redirected to the retailer's website to complete your order. Shipping is handled directly by the retailer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Shipping Policies</h2>
            <p>
              Each retailer has their own shipping policies, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Shipping costs and delivery times</li>
              <li>International shipping availability</li>
              <li>Tracking information</li>
              <li>Packaging and handling</li>
            </ul>
            <p>
              Please review the specific retailer's shipping policy on their website before completing your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Delivery Times</h2>
            <p>
              Delivery times vary by retailer and destination. Most retailers offer:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Standard shipping (5-7 business days)</li>
              <li>Express shipping (2-3 business days)</li>
              <li>Next-day delivery (where available)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Order Tracking</h2>
            <p>
              Once your order ships, you'll receive tracking information from the retailer via email. You can use this to monitor your package's delivery status.
            </p>
          </section>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
