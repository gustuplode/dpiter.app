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
              <strong>Yes, 100% safe.</strong> Clicking any product redirects you to trusted marketplaces like <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Amazon</strong></a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Flipkart</strong></a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Meesho</strong></a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Myntra</strong></a>. DPITER.shop does NOT collect payments - all transactions happen on verified seller platforms with their own security measures.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Do you sell products?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>No.</strong> DPITER.shop only curates the best trending items from <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a> and <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a>. We don't sell anything directly. When you click a product, you're redirected to the marketplace where you can purchase securely.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How are products selected?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Our team manually curates collections by comparing trending listings from <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Amazon</strong></a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Flipkart</strong></a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Meesho</strong></a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Myntra</strong></a> and <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>eBay</strong></a>. We select based on style, quality, ratings, and value for money. Collections are updated daily with new arrivals.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Is this site secure?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>100% secure</strong> because all purchases happen on verified seller platforms (<a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>, <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a>). These marketplaces use industry-standard encryption and secure payment gateways. DPITER.shop never handles your payment information.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What payment methods do you accept?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              DPITER.shop does not accept payments. Payment methods depend on the marketplace you're redirected to (<a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>, or <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a>). They typically accept credit/debit cards, UPI, net banking, wallets, and cash on delivery.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How does shipping work?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Shipping is handled by the marketplace you purchase from (<a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>). Each has different shipping policies and delivery times. Check the product page on the marketplace for specific delivery information.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What if I need to return a product?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Returns are handled by the marketplace you purchased from. <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a> each have their own return policies (typically 7-30 days). Contact the marketplace's customer support for return requests.
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
              DPITER.shop saves you time by curating trending fashion from multiple marketplaces in one place. Instead of searching separately on <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>, we bring the best collections together. It's like having a personal fashion curator.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How do you make money?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              DPITER.shop earns a small commission when you purchase through our affiliate links to <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>, or <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a>. This doesn't cost you anything extra - prices remain the same as on the marketplace. This commission helps us maintain the platform and continue curating fashion.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Are prices on DPITER.shop the same as on the marketplace?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Yes.</strong> We display the current price from <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>, or <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a>. When you click through, the price you see is the actual marketplace price. No hidden charges or markup from DPITER.shop.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How often are collections updated?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Collections are updated <strong>daily</strong> with new trending products from <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a> and <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a>. We continuously monitor fashion trends to bring you the latest styles.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Can I find international brands on DPITER.shop?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Yes! Our curated collections include both Indian and international brands available on <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon India</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>. We feature popular global brands alongside trending local designers, giving you the best of both worlds.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What sizes are available?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Sizes depend on the product and marketplace. Most items on <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a> are available in XS to 3XL sizes. Check the product page on the marketplace for specific size charts and availability.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Does DPITER.shop offer discounts?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              DPITER.shop displays current prices from marketplaces. Discounts depend on ongoing sales on <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>. We curate the best deals and trending items at competitive prices.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Can I track my order on DPITER.shop?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Order tracking is handled by the marketplace where you made your purchase. Log in to your <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, or <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a> account to track your shipment in real-time.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What payment methods are accepted?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              DPITER.shop does not accept payments. Payment methods depend on the marketplace you're redirected to (<a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>, or <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a>). They typically accept credit/debit cards, UPI, net banking, wallets, and cash on delivery.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Is customer support available?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              For order-related queries, contact the marketplace's customer support directly: <a href="https://www.amazon.in/gp/help/customer/display.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon Support</a>, <a href="https://www.flipkart.com/helpcentre" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart Help</a>, <a href="https://www.meesho.com/help" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho Help</a>, or <a href="https://www.myntra.com/contactus" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra Contact</a>. For DPITER.shop platform queries, reach us via our contact page.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Can I cancel my order?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Order cancellation policies vary by marketplace. <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a> and <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a> typically allow cancellations before shipment. Check the specific marketplace's cancellation policy in your order details.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Are gift wrapping options available?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Gift wrapping availability depends on the marketplace. <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a> and <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a> offer gift wrapping for select products. Check product pages for gift options.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Does DPITER.shop have a mobile app?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              DPITER.shop is fully mobile-optimized and works perfectly on any device. You can add it to your home screen for an app-like experience. Native apps are coming soon for iOS and Android.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How is DPITER.shop different from other fashion websites?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Unlike traditional e-commerce sites, DPITER.shop curates the best fashion from multiple trusted marketplaces (<a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>). We save you time by bringing trending collections to one place without the need to search multiple sites.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Can I request specific products or brands?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Yes! We value user feedback. Contact us with product requests and we'll try to feature them in upcoming collections. Our curation team constantly searches for trending items on <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>.
            </p>
          </div>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
