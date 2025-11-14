import Link from "next/link"

export function FooterLinks() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#F97316]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#F97316]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#F97316]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#F97316]"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#F97316]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#F97316]">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#F97316]"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#F97316]"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p>© {new Date().getFullYear()} Dpiter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
