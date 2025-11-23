"use client"

import { useEffect, useRef } from "react"

interface AdDisplayProps {
  adCode: string
  formatType: string
}

export function AdDisplay({ adCode, formatType }: AdDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !adCode) return

    const container = containerRef.current
    container.innerHTML = adCode

    // Execute any script tags in the ad code
    const scripts = container.getElementsByTagName("script")
    Array.from(scripts).forEach((oldScript) => {
      const newScript = document.createElement("script")
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      newScript.appendChild(document.createTextNode(oldScript.innerHTML))
      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript)
      }
    })
  }, [adCode])

  return <div ref={containerRef} className="ad-container" data-format={formatType} />
}
