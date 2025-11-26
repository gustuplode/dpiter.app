"use client"

import Link from "next/link"
import { MessageCircle, Mail, Download, Globe, Handshake } from "lucide-react"

function QuickContactIcons() {
  const handleInstallPWA = () => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const deferredPrompt = (window as any).deferredPrompt
      if (deferredPrompt) {
        deferredPrompt.prompt()
      } else {
        alert("Add to Home Screen: Use your browser menu to install this app")
      }
    }
  }

  const icons = [
    {
      name: "Collab",
      icon: Handshake,
      href: "mailto:deepitermark@gmail.com?subject=Collaboration%20Inquiry",
      gradient: "from-purple-500 to-indigo-600",
      shadowColor: "shadow-purple-500/30",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/919939091568",
      gradient: "from-green-500 to-emerald-600",
      shadowColor: "shadow-green-500/30",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:deepitermark@gmail.com",
      gradient: "from-rose-500 to-pink-600",
      shadowColor: "shadow-rose-500/30",
    },
    {
      name: "Install",
      icon: Download,
      onClick: handleInstallPWA,
      gradient: "from-blue-500 to-cyan-600",
      shadowColor: "shadow-blue-500/30",
    },
    {
      name: "Website",
      icon: Globe,
      href: "https://dpiter.shop",
      gradient: "from-amber-500 to-orange-600",
      shadowColor: "shadow-amber-500/30",
    },
  ]

  return (
    <div className="flex justify-center gap-4 mb-6">
      {icons.map((item) => {
        const IconComponent = item.icon
        const content = (
          <div className="flex flex-col items-center gap-1.5 group">
            <div
              className={`
              w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient}
              flex items-center justify-center
              shadow-lg ${item.shadowColor}
              transition-all duration-300
              group-hover:scale-110 group-hover:shadow-xl
            `}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {item.name}
            </span>
          </div>
        )

        if (item.onClick) {
          return (
            <button key={item.name} onClick={item.onClick} className="cursor-pointer">
              {content}
            </button>
          )
        }

        return (
          <a
            key={item.name}
            href={item.href}
            target={item.href?.startsWith("http") ? "_blank" : undefined}
            rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="cursor-pointer"
          >
            {content}
          </a>
        )
      })}
    </div>
  )
}

export function FooterLinks() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-center mb-6">
          <img
            src="/images/design-mode/1000007078-01_imgupscaler_imgupscaler.ai_V1%28Fast%29_2K%20%282%29%20%281%29.jpg"
            alt="Dpiter Logo"
            className="h-16 w-16 object-contain"
          />
        </div>

        <QuickContactIcons />

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
