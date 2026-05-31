import React from 'react'
import { motion } from 'framer-motion'

export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#001D55]">
      
      {/* Animated Scrolling Tech Grid */}
      <motion.div 
        animate={{ y: [0, 40] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 163, 245, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 163, 245, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          height: '200vh',
          top: '-50vh',
        }} 
      />
      
      {/* Static Crosshairs */}
      <div 
        className="absolute inset-0 opacity-40" 
        style={{
          backgroundImage: `radial-gradient(rgba(128, 203, 244, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '-1px -1px'
        }} 
      />

      {/* Animated Scanning Laser Line */}
      <motion.div
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#80cbf4] to-transparent opacity-60 shadow-[0_0_15px_#80cbf4]"
      />

      {/* Vertical Data Stream Lines */}
      <div className="absolute top-0 left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-primary-500/20 to-transparent" />
      <div className="absolute top-0 right-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-accent-500/20 to-transparent" />
      <div className="absolute top-0 left-[60%] w-[1px] h-full bg-gradient-to-b from-transparent via-primary-500/10 to-transparent" />

      {/* Animated Floating Data Nodes */}
      <motion.div
        animate={{ y: ['100vh', '-10vh'], opacity: [0, 1, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 2 }}
        className="absolute left-[30%] w-2 h-2 bg-primary-400 rounded-full shadow-glow"
      />
      <motion.div
        animate={{ y: ['100vh', '-10vh'], opacity: [0, 1, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 5 }}
        className="absolute right-[40%] w-1.5 h-1.5 bg-accent-400 rounded-full shadow-glow-accent"
      />

      {/* Deep Space Vignette for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000B22_100%)]" />
    </div>
  )
}
