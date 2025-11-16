import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { createClient } from "@/lib/supabase/server"
import { getCollectionUrl } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | DPITER.shop - Common Questions About Fashion Discovery",
  description: "Frequently asked questions about DPITER.shop. Learn how we curate fashion from Amazon, Flipkart, Meesho, Myntra. Safe redirect service with no payment processing.",
  keywords: "dpiter faq, dpiter shop help, online shopping faq, amazon fashion help, flipkart shopping guide, meesho faq, myntra help, boys fashion faq, mens clothing faq, curated fashion faq, affiliate shopping faq, dpiter sitemap, dpiter collections, dpiter products",
}

export default async function FAQPage() {
  const supabase = await createClient()
  
  // Fetch collections and products for backlinks
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title")
    .eq("status", "published")
    .limit(10)

  const { data: products } = await supabase
    .from("products")
    .select("id, title, collection_id")
    .limit(10)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dpiter.shop"

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a href="https://dpiter.shop" className="text-[#3B82F6] hover:underline font-medium">🏠 Home</a>
            <a href="https://dpiter.shop/search" className="text-[#3B82F6] hover:underline font-medium">🔍 Search Collections</a>
            <a href="https://dpiter.shop/wishlist" className="text-[#3B82F6] hover:underline font-medium">❤️ My Wishlist</a>
            <a href="https://dpiter.shop/about" className="text-[#3B82F6] hover:underline font-medium">📖 About Us</a>
            <a href="https://dpiter.shop/contact" className="text-[#3B82F6] hover:underline font-medium">📧 Contact</a>
            <a href="https://dpiter.shop/sitemap.xml" className="text-[#3B82F6] hover:underline font-medium">🗺️ Full Sitemap</a>
          </div>
        </div>

        {collections && collections.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Popular Collections on DPITER.shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {collections.map((collection: any) => (
                <a
                  key={collection.id}
                  href={`${baseUrl}${getCollectionUrl(collection.id, collection.title)}`}
                  className="text-[#3B82F6] hover:underline text-sm"
                >
                  ✨ {collection.title}
                </a>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              View all collections at <a href="https://dpiter.shop" className="text-[#3B82F6] hover:underline font-semibold">dpiter.shop</a> | Complete sitemap: <a href="https://dpiter.shop/sitemap.xml" className="text-[#3B82F6] hover:underline font-semibold">sitemap.xml</a>
            </p>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Is DPITER.shop safe?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Yes, 100% safe.</strong> Clicking any product on <a href="https://dpiter.shop" className="text-primary hover:underline"><strong>DPITER.shop</strong></a> redirects you to trusted marketplaces like <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Amazon</strong></a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Flipkart</strong></a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Meesho</strong></a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Myntra</strong></a>. DPITER.shop does NOT collect payments - all transactions happen on verified seller platforms with their own security measures. Browse our <a href="https://dpiter.shop/search" className="text-primary hover:underline">collections</a> safely.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Do you sell products?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>No.</strong> <a href="https://dpiter.shop" className="text-primary hover:underline">DPITER.shop</a> only curates the best trending items from <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a> and <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a>. We don't sell anything directly. When you click a product from our <a href="https://dpiter.shop/search" className="text-primary hover:underline">fashion collections</a>, you're redirected to the marketplace where you can purchase securely.
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
              <a href="https://dpiter.shop" className="text-primary hover:underline"><strong>DPITER.shop</strong></a> saves you time by curating trending fashion from multiple trusted marketplaces (<a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>). We save you time by bringing trending collections to one place without the need to search multiple sites.
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
              Yes! We value user feedback. <a href="https://dpiter.shop/contact" className="text-primary hover:underline">Contact us</a> with product requests and we'll try to feature them in upcoming collections on <a href="https://dpiter.shop" className="text-primary hover:underline">DPITER.shop</a>. Our curation team constantly searches for trending items on <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, and <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Where can I find specific product categories on DPITER.shop?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <a href="https://dpiter.shop" className="text-primary hover:underline"><strong>DPITER.shop</strong></a> organizes products into curated collections. Visit our <a href="https://dpiter.shop/search" className="text-primary hover:underline">search page</a> to browse all collections, or check our <a href="https://dpiter.shop/sitemap.xml" className="text-primary hover:underline">sitemap</a> for a complete list of product URLs. Each collection includes products from <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, and <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How do I save products to my wishlist?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Simply click the heart icon on any product or collection on <a href="https://dpiter.shop" className="text-primary hover:underline">DPITER.shop</a>. Your wishlist is accessible at <a href="https://dpiter.shop/wishlist" className="text-primary hover:underline">dpiter.shop/wishlist</a>. Sign in with Google on our <a href="https://dpiter.shop/profile" className="text-primary hover:underline">profile page</a> to sync your wishlist across devices.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What is DPITER.shop's complete site structure?</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              <strong>Main Pages:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-700 dark:text-slate-300">
              <li><a href="https://dpiter.shop" className="text-primary hover:underline">Homepage - DPITER.shop</a></li>
              <li><a href="https://dpiter.shop/search" className="text-primary hover:underline">Search Collections</a></li>
              <li><a href="https://dpiter.shop/wishlist" className="text-primary hover:underline">Wishlist</a></li>
              <li><a href="https://dpiter.shop/profile" className="text-primary hover:underline">User Profile</a></li>
              <li><a href="https://dpiter.shop/about" className="text-primary hover:underline">About DPITER.shop</a></li>
              <li><a href="https://dpiter.shop/faq" className="text-primary hover:underline">FAQ</a></li>
              <li><a href="https://dpiter.shop/contact" className="text-primary hover:underline">Contact Us</a></li>
              <li><a href="https://dpiter.shop/privacy-policy" className="text-primary hover:underline">Privacy Policy</a></li>
              <li><a href="https://dpiter.shop/terms-of-service" className="text-primary hover:underline">Terms of Service</a></li>
              <li><a href="https://dpiter.shop/shipping" className="text-primary hover:underline">Shipping Info</a></li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300 mt-3">
              For a complete list of all product and collection URLs, visit our <a href="https://dpiter.shop/sitemap.xml" className="text-primary hover:underline font-semibold">XML Sitemap</a>.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">What makes DPITER.shop better than other fashion websites?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              <a href="https://dpiter.shop" className="text-primary hover:underline"><strong>DPITER.shop</strong></a> is unique because we aggregate the best fashion from <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon India</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>, <a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Myntra</a>, and <a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">eBay</a> in one place. Instead of browsing multiple sites, find everything at <a href="https://dpiter.shop/search" className="text-primary hover:underline">dpiter.shop/search</a>. We're constantly updating our <a href="https://dpiter.shop/sitemap.xml" className="text-primary hover:underline">product catalog</a> with trending items.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">How often is the DPITER.shop sitemap updated?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Our <a href="https://dpiter.shop/sitemap.xml" className="text-primary hover:underline">sitemap</a> is automatically updated every hour with new collections and products. All product URLs from <a href="https://dpiter.shop" className="text-primary hover:underline">DPITER.shop</a> are included, ensuring search engines like Google can discover our latest fashion collections from <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, and <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Can I share specific products from DPITER.shop?</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Yes! Every product and collection on <a href="https://dpiter.shop" className="text-primary hover:underline">DPITER.shop</a> has a unique URL that you can share. Find the product you love in our <a href="https://dpiter.shop/search" className="text-primary hover:underline">collections</a>, copy the URL, and share it on social media. Each URL redirects to the trusted marketplace (<a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Amazon</a>, <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Flipkart</a>, <a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Meesho</a>).
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Explore DPITER.shop</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Shop by Marketplace</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">Amazon Fashion India</a></li>
                <li><a href="https://www.flipkart.com/clothing" target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">Flipkart Clothing</a></li>
                <li><a href="https://www.meesho.com" target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">Meesho Shopping</a></li>
                <li><a href="https://www.myntra.com" target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">Myntra Fashion</a></li>
                <li><a href="https://www.ebay.in" target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline">eBay India</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">DPITER.shop Resources</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="https://dpiter.shop" className="text-[#3B82F6] hover:underline">Home - Latest Collections</a></li>
                <li><a href="https://dpiter.shop/search" className="text-[#3B82F6] hover:underline">Search All Products</a></li>
                <li><a href="https://dpiter.shop/wishlist" className="text-[#3B82F6] hover:underline">My Wishlist</a></li>
                <li><a href="https://dpiter.shop/profile" className="text-[#3B82F6] hover:underline">User Profile & Account</a></li>
                <li><a href="https://dpiter.shop/sitemap.xml" className="text-[#3B82F6] hover:underline">Complete Sitemap</a></li>
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
