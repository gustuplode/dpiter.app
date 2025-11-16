import Link from "next/link"
import Image from "next/image"

export function FooterLinks() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-center mb-6">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1000007078-01_imgupscaler.ai_V1%28Fast%29_2K.png.jpg-kN64jsYjWJBqDqEUwWk8icdF6HfwLc.png"
            alt="Dpiter Logo"
            className="h-16 w-16 object-contain"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]">
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
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]"
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
                <Link href="/faq" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]">
                  Shipping Info
                </Link>
              </li>
              <li>
                <a
                  href="https://amzn.to/49SNT2h"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]"
                >
                  Amazon Store
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.facebook.com/share/1PwVj2Bg4Z/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/deepiter_mark?igsh=MXh5djE1NzlkMTlo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#3B82F6]"
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
