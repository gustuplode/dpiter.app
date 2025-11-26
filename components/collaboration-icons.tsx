"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Mail, Smartphone, Globe, Users } from "lucide-react"

interface CollaborationIconsProps {
  className?: string
  title?: string
}

export function CollaborationIcons({ className = "", title = "Connect With Us" }: CollaborationIconsProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      ;(window as any).deferredPrompt = e
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
  }, [])

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
      }
    } else {
      alert('To install: Click browser menu → "Install App" or "Add to Home Screen"')
    }
  }

  const collaborationLinks = [
    {
      icon: Users,
      label: "Collab",
      href: "https://wa.me/919939091568?text=Hi%20DPITER!%20I'm%20interested%20in%20collaboration.",
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      shadow: "shadow-purple-500/30",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/919939091568",
      gradient: "from-green-400 via-green-500 to-emerald-500",
      shadow: "shadow-green-500/30",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:deepitermark@gmail.com",
      gradient: "from-red-400 via-rose-500 to-pink-500",
      shadow: "shadow-rose-500/30",
    },
    {
      icon: Smartphone,
      label: "App",
      href: "#install-pwa",
      gradient: "from-blue-400 via-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/30",
      isPWA: true,
    },
    {
      icon: Globe,
      label: "Website",
      href: "https://dpiter.shop",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      shadow: "shadow-orange-500/30",
    },
  ]

  return (
    <section className={`py-8 ${className}`}>
      {title && <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">{title}</h2>}

      <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
        {collaborationLinks.map((link) => (
          <a
            key={link.label}
            href={link.isPWA ? "#" : link.href}
            target={!link.isPWA && link.href.startsWith("http") ? "_blank" : undefined}
            rel={!link.isPWA && link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={
              link.isPWA
                ? (e) => {
                    e.preventDefault()
                    handleInstallPWA()
                  }
                : undefined
            }
            className="group flex flex-col items-center gap-2"
          >
            {/* Round Circle with gradient */}
            <div
              className={`
                relative w-14 h-14 sm:w-16 sm:h-16
                rounded-full bg-gradient-to-br ${link.gradient}
                flex items-center justify-center
                shadow-lg ${link.shadow}
                transform transition-all duration-300
                group-hover:scale-110 group-hover:shadow-xl
                group-active:scale-95
                before:absolute before:inset-0 before:rounded-full
                before:bg-white/20 before:opacity-0
                group-hover:before:opacity-100 before:transition-opacity
              `}
            >
              <link.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10" strokeWidth={1.8} />

              {/* Glow effect on hover */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-50 blur-md transition-opacity -z-10`}
              />
            </div>

            {/* Label */}
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {link.label}
            </span>
          </a>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-5">
        Reach us anytime • Response within 24 hours
      </p>
    </section>
  )
}
