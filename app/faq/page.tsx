import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | DPITER.shop - Common Questions About Fashion Discovery",
  description: "Frequently asked questions about DPITER.shop. Learn how we curate fashion from Amazon, Flipkart, Meesho, Myntra. Safe redirect service with no payment processing.",
}

export default function FAQPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Is DPITER.shop safe?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Yes, 100% safe.</strong> Clicking any product redirects you to trusted marketplaces like <strong>Amazon, Flipkart, Meesho, and Myntra</strong>. DPITER.shop does NOT collect payments - all transactions happen on verified seller platforms with their own security measures.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Do you sell products?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>No.</strong> DPITER.shop only curates the best trending items from Amazon, Flipkart, Meesho, Myntra and eBay. We don't sell anything directly. When you click a product, you're redirected to the marketplace where you can purchase securely.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How are products selected?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Our team manually curates collections by comparing trending listings from <strong>Amazon, Flipkart, Meesho, Myntra and eBay</strong>. We select based on style, quality, ratings, and value for money. Collections are updated daily with new arrivals.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Is this site secure?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>100% secure</strong> because all purchases happen on verified seller platforms (Amazon, Flipkart, Meesho, Myntra, eBay). These marketplaces use industry-standard encryption and secure payment gateways. DPITER.shop never handles your payment information.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What payment methods do you accept?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              DPITER.shop does not accept payments. Payment methods depend on the marketplace you're redirected to (Amazon, Flipkart, Meesho, Myntra, or eBay). They typically accept credit/debit cards, UPI, net banking, wallets, and cash on delivery.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How does shipping work?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Shipping is handled by the marketplace you purchase from (Amazon, Flipkart, Meesho, Myntra). Each has different shipping policies and delivery times. Check the product page on the marketplace for specific delivery information.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What if I need to return a product?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Returns are handled by the marketplace you purchased from. Amazon, Flipkart, Meesho, and Myntra each have their own return policies (typically 7-30 days). Contact the marketplace's customer support for return requests.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Do I need to create an account?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              No, you can browse collections without an account. However, signing in with Google gives you access to wishlist sync, personalized recommendations, and the ability to rate products.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Why should I use DPITER.shop instead of going directly to Amazon/Flipkart?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              DPITER.shop saves you time by curating trending fashion from multiple marketplaces in one place. Instead of searching separately on Amazon, Flipkart, Meesho, and Myntra, we bring the best collections together. It's like having a personal fashion curator.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How do you make money?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              DPITER.shop earns a small commission when you purchase through our affiliate links to Amazon, Flipkart, Meesho, Myntra, or eBay. This doesn't cost you anything extra - prices remain the same as on the marketplace. This commission helps us maintain the platform and continue curating fashion.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Are prices on DPITER.shop the same as on the marketplace?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Yes.</strong> We display the current price from Amazon, Flipkart, Meesho, Myntra, or eBay. When you click through, the price you see is the actual marketplace price. No hidden charges or markup from DPITER.shop.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How often are collections updated?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Collections are updated <strong>daily</strong> with new trending products from Amazon, Flipkart, Meesho, Myntra and eBay. We continuously monitor fashion trends to bring you the latest styles.
            </p>
          </div>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
