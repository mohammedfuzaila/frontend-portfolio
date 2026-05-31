import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fetchAbout, fetchHero } from '../api'
import { User, Code, Globe, Lightbulb } from 'lucide-react'
import TiltCard from './ui/TiltCard'

function CounterStat({ end, label, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start = Math.min(start + step, end)
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end])

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-black gradient-text">
        {count}{suffix}
      </div>
      <div className="text-sm text-slate-300 font-medium mt-1">{label}</div>
    </div>
  )
}

const fallback = {
  bio_1: "Hello! I'm Anaikar Mohammed Fuzail, a passionate Full Stack Developer based in Pernambut, Tamil Nadu, India. My journey in web development began with curiosity, which quickly evolved into a deep passion for building innovative, user-centric applications.",
  bio_2: "I specialize in React, Python, and Django, building complete end-to-end solutions. My approach combines clean code with creative problem-solving—ensuring every project is both functional and aesthetically pleasing.",
  bio_3: "When I'm not coding, I explore new technologies, contribute to open-source, and share knowledge with the developer community. I believe in continuous learning to deliver cutting-edge solutions.",
  projects_count: 15,
  clients_count: 10,
  years_experience: 2,
  satisfaction_rate: 99,
  show_open_to_work: true,
}

const highlights = [
  { icon: Code, title: 'Clean Code', desc: 'Best practices & maintainable architecture' },
  { icon: Globe, title: 'Full Stack', desc: 'Frontend to backend, end-to-end solutions' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Creative thinking for modern challenges' },
]

export default function AboutSection() {
  const [about, setAbout] = useState(fallback)
  const [profileImg, setProfileImg] = useState('')

  useEffect(() => {
    fetchAbout().then(({ data }) => {
      if (data && data.bio_1) setAbout(data)
      if (data && data.profile_image_url) {
        setProfileImg(data.profile_image_url)
      }
    }).catch(() => {})

    fetchHero().then(({ data }) => {
      if (data && data.profile_image_url) {
        setProfileImg(prev => prev || data.profile_image_url)
      }
    }).catch(() => {})
  }, [])

  return (
    <section id="about" className="section bg-transparent relative overflow-hidden">
      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="tech-badge mb-4 inline-block">About Me</span>
          <h2 className="section-title">Passionate Developer &amp; <span className="gradient-text">Creative Thinker</span></h2>
          <p className="section-subtitle mx-auto text-center">
            Building meaningful digital experiences with code and creativity
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative flex flex-col items-center"
          >
            {/* Card and Floating card wrapper */}
            <div className="relative w-full max-w-[360px] sm:max-w-[380px]">
              <TiltCard className="w-full aspect-[4/5] sm:aspect-[3/4]">
                <div className="relative w-full h-full glass-card p-6 overflow-hidden rounded-3xl border border-white/10 flex flex-col items-center justify-center backdrop-blur-none group/card">
                  {/* Glowing background auras */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-transparent to-accent-500/5 pointer-events-none" />
                  
                  {/* Modern dynamic border overlay */}
                  <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none m-2" />

                  {/* Profile image container or avatar */}
                  <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-slate-950/40 border border-white/5 flex items-center justify-center shadow-inner animate-float">
                    {profileImg ? (
                      <img 
                        src={profileImg} 
                        alt="Anaikar Mohammed Fuzail" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />
                    ) : (
                      <div className="relative z-10 w-32 h-32 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow">
                        <User className="w-16 h-16 text-white/80" />
                      </div>
                    )}
                  </div>
                </div>
              </TiltCard>

              {/* Floating Open to Work card */}
              {about.show_open_to_work !== false && (
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -right-4 glass-card p-4 rounded-2xl shadow-card backdrop-blur-none z-20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-semibold text-slate-200">Open to Work</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile Info underneath the card */}
            <div className="mt-12 text-center">
              <h3 className="font-display text-3xl font-bold text-white mb-1.5">Anaikar Mohammed Fuzail</h3>
              <p className="text-primary-500 font-semibold mb-2">Full Stack Developer</p>
              <p className="text-slate-400 text-sm">📍 Pernambut, Tamil Nadu, India</p>

              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                {['React.js', 'Python', 'Django', 'JavaScript'].map((t) => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="space-y-4 mb-8">
              {[about.bio_1, about.bio_2, about.bio_3].filter(Boolean).map((bio, i) => (
                <p key={i} className="text-slate-300 leading-relaxed">{bio}</p>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {highlights.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-card p-4 rounded-xl text-center cursor-default backdrop-blur-none"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="text-sm font-semibold text-slate-200">{title}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="glass-card p-6 rounded-2xl backdrop-blur-none">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-2 md:gap-4 divide-x-0 md:divide-x divide-white/10">
                <CounterStat end={about.projects_count || 15} label="Projects" suffix="+" />
                <CounterStat end={about.clients_count || 10} label="Clients" suffix="+" />
                <CounterStat end={about.years_experience || 2} label="Years" suffix="+" />
                <CounterStat end={about.satisfaction_rate || 99} label="Satisfaction" suffix="%" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
