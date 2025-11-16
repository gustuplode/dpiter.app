import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About DPITER.shop | Curated Fashion Discovery Platform",
  description: "Learn about DPITER.shop - Your trusted fashion discovery platform featuring curated collections from Amazon, Flipkart, Meesho, Myntra & eBay. Safe redirect, no payment processing.",
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About DPITER.shop</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">What is DPITER.shop?</h2>
            <p>
              <strong>DPITER.shop</strong> is a curated fashion platform that lists trending products from <strong>Amazon, Flipkart, Myntra, Meesho</strong> and <strong>eBay</strong>. We do not sell any product directly — clicking any item redirects you safely to the official trusted marketplace.
            </p>
            <p>
              Our team curates top trending outfits, premium boys clothing, menswear essentials, and popular styles updated daily. DPITER.shop is created to help users find the best items without searching across multiple platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">100% Safe & Secure</h2>
            <p>
              <strong>DPITER.shop does NOT collect any payments.</strong> All purchases happen on verified marketplace platforms like Amazon, Flipkart, Meesho, Myntra, and eBay. We simply help you discover the best fashion picks - your payment and order are processed securely by the trusted marketplace you choose.
            </p>
            <p>
              This means your financial information is protected by world-class security from Amazon, Flipkart, and other trusted retailers. We only provide curated fashion discovery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">How DPITER.shop Works</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Browse curated collections</strong> - We handpick trending fashion from top marketplaces</li>
              <li><strong>Click to view details</strong> - See product information and pricing</li>
              <li><strong>Redirect to trusted marketplace</strong> - You're safely redirected to Amazon, Flipkart, Meesho, Myntra or eBay</li>
              <li><strong>Complete your purchase</strong> - Buy securely from the verified marketplace</li>
            </ol>
            <p className="mt-4">
              DPITER.shop earns a small commission when you make a purchase through our links, at no extra cost to you. This helps us keep the platform running and continue curating the best fashion picks daily.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Why Choose DPITER.shop?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Curated selections</strong> - Only trending, high-quality products from Amazon, Flipkart, Meesho, Myntra & eBay</li>
              <li><strong>Compare across marketplaces</strong> - Find the best price and style without visiting multiple sites</li>
              <li><strong>Updated daily</strong> - Fresh collections added every day</li>
              <li><strong>100% secure</strong> - All purchases through verified marketplace platforms</li>
              <li><strong>No hidden charges</strong> - Prices shown are from the original marketplace</li>
              <li><strong>Wishlist & ratings</strong> - Save favorites and see community reviews</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Our Mission</h2>
            <p>
              At DPITER.shop, we believe shopping should be simple and enjoyable. Instead of browsing endless listings across Amazon, Flipkart, Meesho, and Myntra separately, we bring the best trending fashion to one place.
            </p>
            <p>
              We're passionate about helping you discover styles that match your personality and budget - whether it's premium menswear, trendy boys clothing, or the latest fashion collections.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">Trusted Marketplace Partners</h2>
            <p>All products on DPITER.shop redirect to these verified platforms:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Amazon</strong> - World's largest online marketplace</li>
              <li><strong>Flipkart</strong> - India's leading ecommerce platform</li>
              <li><strong>Meesho</strong> - Popular budget-friendly fashion destination</li>
              <li><strong>Myntra</strong> - India's #1 fashion marketplace</li>
              <li><strong>eBay</strong> - Global marketplace with unique finds</li>
            </ul>
          </section>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
