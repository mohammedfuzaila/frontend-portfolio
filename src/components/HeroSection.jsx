import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Download, ArrowRight, Mail, ChevronDown } from 'lucide-react'
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa'
import { fetchHero, fetchSocialLinks } from '../api'
import HeroCanvas from './three/HeroCanvas'

const fallbackHero = {
  name: 'Anaikar Mohammed Fuzail',
  tagline: 'Full Stack Developer',
  subtitle: 'Crafting web experiences with precision and creativity. I build scalable, elegant digital solutions from concept to deployment.',
  resume_file_url: null,
  show_open_to_work: true,
}

const iconMap = { github: Github, linkedin: Linkedin, mail: Mail }

export default function HeroSection() {
  const [hero, setHero] = useState(null)
  const [socials, setSocials] = useState([])

  useEffect(() => {
    fetchHero().then(({ data }) => setHero(data || null)).catch(() => {})
    fetchSocialLinks().then(({ data }) => setSocials(data?.results || data || [])).catch(() => {})
  }, [])

  if (!hero) return null;

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const nameParts = (hero.name || '').trim().split(' ')
  const lastName = nameParts.length > 1 ? nameParts.pop() : hero.name || ''
  const firstName = nameParts.length > 1 ? nameParts.join(' ') : ''

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
        <HeroCanvas />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-16 flex flex-col items-center text-center">
        {/* Open to Work Badge */}
        {hero.show_open_to_work !== false && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
          className="mb-8"
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 20px 8px 12px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 100%)',
              border: '1.5px solid rgba(16,185,129,0.45)',
              boxShadow: '0 0 18px 2px rgba(16,185,129,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
              backdropFilter: 'blur(10px)',
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Shimmer sweep */}
            <motion.span
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.09) 50%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Animated green pulse ring */}
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14, flexShrink: 0 }}>
              <motion.span
                animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.45)',
                }}
              />
              <span style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                boxShadow: '0 0 8px 2px rgba(16,185,129,0.7)',
                display: 'block',
              }} />
            </span>

            {/* Text */}
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #6ee7b7 0%, #34d399 50%, #a7f3d0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Open to Work
            </span>
          </div>
        </motion.div>
        )}

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6"
        >
          {firstName && <>{firstName} <br className="hidden sm:block" /></>}
          <span className="gradient-text-purple">{lastName}</span>
        </motion.h1>

        {/* Typing Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-xl sm:text-2xl font-semibold text-slate-400 mb-8 h-8 flex items-center justify-center"
        >
          <TypeAnimation
            sequence={[
              'Full Stack Developer',
              2000,
              'Frontend Developer',
              2000,
              'React & Django Expert',
              2000,
              'AI Web Developer',
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-white"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
        >
          I engineer highly scalable, modern digital products from concept to deployment. 
          Specializing in elegant code architecture and high-performance interfaces.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <motion.button
            onClick={scrollToProjects}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary group"
          >
            Explore Work
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
          {hero.resume_file_url && (
            <motion.a
              href={hero.resume_file_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary group"
            >
              <Download className="w-4 h-4" />
              Download CV
            </motion.a>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center flex-wrap gap-8 sm:gap-16 pt-8 border-t border-white/5 w-full max-w-3xl"
        >
          {[
            { value: '15+', label: 'Projects Shipped' },
            { value: '10+', label: 'Happy Clients' },
            { value: '2+', label: 'Years Experience' },
            { value: '100%', label: 'Delivery Rate' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl font-black text-white">{value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  )
}
