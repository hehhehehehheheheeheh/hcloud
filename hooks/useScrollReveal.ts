"use client"

import { useEffect, useRef } from "react"

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  staggerDelay?: number /* ms delay between sibling elements */
}

/**
 * Applies .revealed class to elements with .reveal class when they enter viewport.
 * Stagger is applied via animation-delay on consecutive siblings.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.12, rootMargin = "0px 0px -40px 0px", staggerDelay = 90 } = options
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = containerRef.current ?? document

    const elements = Array.from(root.querySelectorAll<HTMLElement>(".reveal"))

    if (elements.length === 0) return

    // Group siblings for stagger
    const groups = new Map<Element | null, HTMLElement[]>()
    for (const el of elements) {
      const parent = el.parentElement
      if (!groups.has(parent)) groups.set(parent, [])
      groups.get(parent)!.push(el)
    }

    // Assign stagger delays within each group
    for (const siblings of groups.values()) {
      siblings.forEach((el, i) => {
        el.style.animationDelay = `${i * staggerDelay}ms`
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold, rootMargin },
    )

    for (const el of elements) observer.observe(el)

    return () => observer.disconnect()
  }, [threshold, rootMargin, staggerDelay])

  return containerRef
}
