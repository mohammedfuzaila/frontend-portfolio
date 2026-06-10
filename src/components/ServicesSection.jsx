import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, Monitor, Server, Globe, PenTool, TrendingUp, CheckCircle2 } from 'lucide-react'
import { fetchServices } from '../api'
import TiltCard from './ui/TiltCard'

const iconMap = {
  code: Code2, monitor: Monitor, server: Server,
  globe: Globe, 'pen-tool': PenTool, 'trending-up': TrendingUp,
}

const gradients = [
  'from-primary-400 to-violet-500',
  'from-blue-400 to-primary-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-accent-500',
]

const fallbackServices = [
  { id: 1, title: 'Full Stack Development', description: 'End-to-end web applications with React + Django. Scalable, performant, production-ready.', icon: 'code', features: ['React / Next.js', 'Django REST API', 'Database Design', 'Deployment'] },
  { id: 2, title: 'Frontend Development', description: 'Pixel-perfect UIs with smooth animations and responsive design for all devices.', icon: 'monitor', features: ['React.js', 'Tailwind CSS', 'Framer Motion', 'Responsive'] },
  { id: 3, title: 'Backend Development', description: 'Robust APIs with JWT auth, secure architecture, and scalable database design.', icon: 'server', features: ['Django REST', 'JWT Auth', 'PostgreSQL', 'Security'] },
  { id: 4, title: 'WordPress Development', description: 'Custom WordPress sites with unique themes and powerful CMS functionality.', icon: 'globe', features: ['Custom Themes', 'WooCommerce', 'SEO Ready', 'Performance'] },
  { id: 5, title: 'UI/UX Design', description: 'Modern user-centric interfaces with Figma prototypes and design systems.', icon: 'pen-tool', features: ['Figma Design', 'Design Systems', 'Wireframing', 'User Flows'] },
  { id: 6, title: 'SEO & Performance', description: 'Maximize digital visibility with comprehensive SEO and Core Web Vitals optimization.', icon: 'trending-up', features: ['On-Page SEO', 'Core Web Vitals', 'Analytics', 'Schema'] },
]

function ServiceCard({ service, index }) {
  const Icon = iconMap[service.icon] || Code2
  const gradient = gradients[index % gradients.length]

  return (
    <TiltCard>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="glass-card p-6 rounded-2xl cursor-default group shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col"
      >
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        <h3 className="font-display font-bold text-white text-xl mb-3 group-hover:text-primary-600 transition-colors">
          {service.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-grow">{service.description}</p>

        {/* Features */}
        <ul className="space-y-1.5">
          {(service.features || []).map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Bottom accent */}
        <div className={`h-1 mt-5 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </motion.div>
    </TiltCard>
  )
}

export default function ServicesSection({ backendOnline }) {
  const [services, setServices] = useState(null)

  useEffect(() => {
    fetchServices().then(({ data }) => {
      const d = data?.results || data
      if (Array.isArray(d)) setServices(d)
    }).catch(() => { setServices([]) })
  }, [])

  if (!backendOnline) {
    return (
      <section id="services" className="section bg-transparent relative overflow-hidden">
        <div className="section-container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="tech-badge mb-4 inline-block">Services</span>
            <h2 className="section-title">
              What I <span className="gradient-text">Offer</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Comprehensive development services to bring your digital vision to life
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="section bg-transparent relative overflow-hidden">
      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="tech-badge mb-4 inline-block">Services</span>
          <h2 className="section-title">
            What I <span className="gradient-text">Offer</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Comprehensive development services to bring your digital vision to life
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-500 mb-5">Have a project in mind? Let's build something amazing together.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Start a Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
