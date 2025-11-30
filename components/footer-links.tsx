"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageCircle, Mail, Download, Globe, Handshake } from "lucide-react"
import { SEOFooterBlock } from "./seo-footer-block"

function QuickContactIcons() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === "accepted") {
        console.log("PWA Installed")
      }
      setDeferredPrompt(null)
    }
  }

  const icons = [
    {
      name: "Collab",
      icon: Handshake,
      href: "mailto:deepitermark@gmail.com?subject=Collaboration%20Inquiry",
      bgColor: "from-purple-600 to-violet-700",
      shadowColor: "shadow-purple-500/30",
      show: true,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/919939091568",
      bgColor: "from-green-500 to-green-600",
      shadowColor: "shadow-green-500/30",
      show: true,
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:deepitermark@gmail.com",
      bgColor: "from-red-500 to-rose-600",
      shadowColor: "shadow-red-500/30",
      show: true,
    },
    {
      name: "Install",
      icon: Download,
      onClick: handleInstallPWA,
      bgColor: "from-blue-500 to-blue-600",
      shadowColor: "shadow-blue-500/30",
      show: deferredPrompt !== null && !isInstalled,
    },
    {
      name: "Website",
      icon: Globe,
      href: "https://dpiter.shop",
      bgColor: "from-orange-500 to-amber-600",
      shadowColor: "shadow-orange-500/30",
      show: true,
    },
  ]

  return (
    <div className="flex justify-center items-center gap-6 mb-6">
      {icons
        .filter((item) => item.show)
        .map((item) => {
          const IconComponent = item.icon
          const content = (
            <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div
                className={`
                  w-12 h-12 rounded-full bg-gradient-to-br ${item.bgColor}
                  flex items-center justify-center
                  shadow-lg ${item.shadowColor}
                  transition-all duration-300 ease-out
                  group-hover:scale-110 group-hover:shadow-xl
                  group-active:scale-95
                  ring-2 ring-white/20
                `}
              >
                <IconComponent className="w-5 h-5 text-white drop-shadow-sm" strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
                {item.name}
              </span>
            </div>
          )

          if (item.onClick) {
            return (
              <button key={item.name} onClick={item.onClick}>
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
            >
              {content}
            </a>
          )
        })}
    </div>
  )
}

export function FooterLinks() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === "accepted") {
        console.log("PWA Installed")
      }
      setDeferredPrompt(null)
    }
  }

  return (
    <>
      <SEOFooterBlock />

      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-4">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Quick Contact
            </h3>
          </div>

          <QuickContactIcons />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center md:text-left">
            <div>
              <h3 className="font-semibold text-xs text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                Company
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href="/about"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xs text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                Legal
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xs text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                Support
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href="/faq"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <a
                    href="https://amzn.to/49SNT2h"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    Amazon Store
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-xs text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                Follow
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="https://www.facebook.com/share/1PwVj2Bg4Z/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/deepiter_mark?igsh=MXh5djE1NzlkMTlo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {deferredPrompt && !isInstalled && (
            <div className="flex justify-center mb-5">
              <button
                onClick={handleInstallPWA}
                className="flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Install Dpiter App
              </button>
            </div>
          )}

          <div className="text-center text-[10px] text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p>© {new Date().getFullYear()} Dpiter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
