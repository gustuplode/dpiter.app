import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Dpiter",
  description: "Learn more about Dpiter and our mission to bring you the best curated fashion collections.",
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About Dpiter</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Our Story</h2>
            <p>
              Dpiter was founded with a simple mission: to make fashion discovery easier and more enjoyable. We curate the best collections from top brands and bring them together in one convenient platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">What We Do</h2>
            <p>
              We partner with leading fashion brands and retailers to showcase their best products. Our team carefully selects collections that represent the latest trends, timeless classics, and exclusive deals.
            </p>
            <p>
              Whether you're looking for summer essentials, formal wear, activewear, or accessories, Dpiter helps you discover products that match your style and budget.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Why Choose Us</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Curated collections from trusted brands</li>
              <li>Easy-to-use platform with intuitive navigation</li>
              <li>Regular updates with new arrivals and limited-time offers</li>
              <li>Wishlist feature to save your favorite items</li>
              <li>Direct links to retailer websites for secure purchases</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Our Commitment</h2>
            <p>
              We're committed to providing a seamless shopping experience and helping you stay on top of the latest fashion trends. Your satisfaction and trust are our top priorities.
            </p>
          </section>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
