import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Code2, Heart, ArrowUp } from 'lucide-react'
import { FaGithub as Github, FaLinkedin as Linkedin, FaTwitter as Twitter } from 'react-icons/fa'
import { fetchSocialLinks } from '../api'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

const iconMap = { github: Github, linkedin: Linkedin, twitter: Twitter, mail: Mail, phone: Phone }

export default function Footer() {
  const [socials, setSocials] = useState([])

  useEffect(() => {
    fetchSocialLinks().then(({ data }) => setSocials(data?.results || data || [])).catch(() => {})
  }, [])
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleNav = (href) => {
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary p-2 flex items-center justify-center shadow-glow">
                <img src="/favicon.svg" alt="fuzail.script logo" className="w-full h-full" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-white flex items-center">
                fuzail<span className="text-xs font-mono font-bold text-primary-400 bg-primary-500/10 border border-primary-500/20 px-1.5 py-0.5 rounded-lg ml-1">.script</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Full Stack Developer crafting web experiences with precision, creativity, and passion for clean code.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => {
                const isPhone = s.platform?.toLowerCase() === 'phone'
                const href = isPhone && !s.url.startsWith('tel:') ? `tel:${s.url}` : s.url
                const Icon = iconMap[s.platform?.toLowerCase()] || Mail
                return (
                <motion.a
                  key={s.id || s.platform}
                  href={href}
                  target={isPhone ? undefined : "_blank"}
                  rel={isPhone ? undefined : "noopener noreferrer"}
                  aria-label={s.platform}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/50 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              )})}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.href)}
                    className="text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block transition-transform"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5">Get In Touch</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <a href="mailto:anaikarmohammedfuzail57@gmail.com" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Mail className="w-4 h-4 text-primary-500" />
                anaikarmohammedfuzail57@gmail.com
              </a>
              <a href="tel:+918870539407" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Phone className="w-4 h-4 text-primary-500" />
                +91 8870539407
              </a>
              <p className="flex items-start gap-2">
                <span className="text-primary-500 mt-0.5">📍</span>
                Pernambut, Tamil Nadu, India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            © {new Date().getFullYear()}{' '}
            <span className="font-display font-black tracking-tight text-white text-xs inline-flex items-center">
              fuzail<span className="text-[10px] font-mono font-bold text-primary-400 bg-primary-500/10 border border-primary-500/20 px-1 py-0.5 rounded ml-0.5">.script</span>
            </span>
            . Made with
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            by{' '}
            <a 
              href="https://fuzailscript.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors font-medium"
            >
              Fuzail
            </a>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-xs">React · Django · Three.js</span>
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="w-9 h-9 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 hover:bg-primary-600/40 transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
