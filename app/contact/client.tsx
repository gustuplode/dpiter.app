"use client"

import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import { CollaborationIcons } from "@/components/collaboration-icons"
import { MessageCircle, Mail, Smartphone, Globe, Users, Instagram, Facebook } from "lucide-react"

function CollaborationSection() {
  const collaborationLinks = [
    {
      icon: Users,
      label: "Collaborate",
      href: "https://wa.me/919939091568?text=Hi%20DPITER!%20I'm%20interested%20in%20collaboration.",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      hoverColor: "hover:from-purple-600 hover:to-indigo-700",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/919939091568",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:deepitermark@gmail.com",
      color: "bg-gradient-to-br from-red-500 to-rose-600",
      hoverColor: "hover:from-red-600 hover:to-rose-700",
    },
    {
      icon: Smartphone,
      label: "Install App",
      href: "#install-pwa",
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
      hoverColor: "hover:from-blue-600 hover:to-cyan-700",
      isPWA: true,
    },
    {
      icon: Globe,
      label: "Website",
      href: "https://dpiter.shop",
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      hoverColor: "hover:from-amber-600 hover:to-orange-700",
    },
  ]

  return (
    <section className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-5 text-center">Quick Connect</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {collaborationLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={
              link.isPWA
                ? (e) => {
                    e.preventDefault()
                    if (typeof window !== "undefined" && "deferredPrompt" in window) {
                      ;(window as any).deferredPrompt?.prompt()
                    } else {
                      alert('To install: Click the browser menu and select "Install App" or "Add to Home Screen"')
                    }
                  }
                : undefined
            }
            className={`
              flex flex-col items-center justify-center
              w-20 h-20 sm:w-24 sm:h-24
              rounded-2xl ${link.color} ${link.hoverColor}
              text-white shadow-lg
              transform transition-all duration-300
              hover:scale-110 hover:shadow-xl
              active:scale-95
            `}
          >
            <link.icon className="w-7 h-7 sm:w-8 sm:h-8 mb-1" strokeWidth={1.5} />
            <span className="text-[10px] sm:text-xs font-medium">{link.label}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default function ContactPageClient() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <div className="container mx-auto max-w-4xl px-4 py-8 pb-32">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Contact Us</h1>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Website Information</h2>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p>
              <strong>Website:</strong>{" "}
              <a href="https://dpiter.shop" className="text-blue-600 hover:underline">
                dpiter.shop
              </a>
            </p>
            <p>
              <strong>Owner/Publisher:</strong> DPITER.shop Team
            </p>
            <p>
              <strong>Founded:</strong> 2024
            </p>
            <p>
              <strong>Location:</strong> India (Serving Worldwide)
            </p>
            <p>
              <strong>Business Type:</strong> Fashion Discovery & Curation Platform
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Get in Touch</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Have questions or feedback about <strong>DPITER.shop</strong>? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                WhatsApp
              </h3>
              <a href="https://wa.me/919939091568" className="text-green-600 hover:underline font-medium">
                +91 99390 91568
              </a>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                Email
              </h3>
              <a href="mailto:deepitermark@gmail.com" className="text-red-600 hover:underline font-medium">
                deepitermark@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Social Media</h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/deepiter_mark"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
              <a
                href="https://www.facebook.com/share/1PwVj2Bg4Z/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <CollaborationIcons title="Quick Connect" />
          </div>
        </div>
      </div>

      <FooterLinks />
      <BottomNav />
    </div>
  )
}
