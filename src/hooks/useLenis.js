import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'

export function useLenis() {
  const location = useLocation()

  useEffect(() => {
    // Disable smooth scrolling on all admin routes
    if (location.pathname.startsWith('/admin')) {
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    let rafId

    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [location.pathname])
}

