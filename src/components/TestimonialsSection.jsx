import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { fetchTestimonials } from '../api'

const fallback = [
  { id: 1, name: 'Client Review', role: 'Business Owner', company: '', message: 'Fuzail is an exceptional developer who delivered our project ahead of schedule. His attention to detail and technical expertise exceeded our expectations. Highly recommended!', rating: 5 },
  { id: 2, name: 'Aspirasys Team', role: 'Management', company: 'Aspirasys IT Foundation', message: 'During his tenure, he demonstrated excellent performance, a positive attitude, and strong learning skills. Sincere, punctual, and a great team player.', rating: 5 },
  { id: 3, name: 'Project Client', role: 'Startup Founder', company: '', message: "Fuzail's expertise in full-stack development helped us launch our platform successfully. His communication was excellent, and he provided valuable insights throughout.", rating: 5 },
  { id: 4, name: 'Happy Customer', role: 'Small Business Owner', company: '', message: 'Working with Fuzail was a pleasure. He understood our requirements perfectly and created a beautiful, functional website that our customers love. Professional and reliable!', rating: 5 },
]

export default function TestimonialsSection({ backendOnline }) {
  const [testimonials, setTestimonials] = useState(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetchTestimonials().then(({ data }) => {
      const d = data?.results || data
      if (Array.isArray(d)) setTestimonials(d)
    }).catch(() => { setTestimonials([]) })
  }, [])

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials])

  if (!backendOnline) {
    return (
      <section id="testimonials" className="section bg-transparent relative overflow-hidden">
        <div className="section-container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="tech-badge mb-4 inline-block">Testimonials</span>
            <h2 className="section-title">
              What Clients <span className="gradient-text">Say</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Feedback from people I've worked with
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  if (!testimonials || testimonials.length === 0) return null;

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section id="testimonials" className="section bg-transparent relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-primary-100/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] rounded-full bg-accent-100/30 blur-3xl pointer-events-none" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="tech-badge mb-4 inline-block">Testimonials</span>
          <h2 className="section-title">
            What Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Feedback from people I've worked with
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass-card p-8 sm:p-10 rounded-3xl shadow-glass-lg relative"
              >
                {/* Quote icon */}
                <Quote className="absolute top-6 right-8 w-12 h-12 text-primary-100" />

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonials[current]?.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Message */}
                <blockquote className="text-slate-300 text-lg leading-relaxed mb-8 italic">
                  "{testimonials[current]?.message}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-glow">
                    {testimonials[current]?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonials[current]?.name}</div>
                    <div className="text-sm text-slate-400">
                      {testimonials[current]?.role}
                      {testimonials[current]?.company && ` · ${testimonials[current].company}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === current ? 'w-8 h-2 bg-primary-500' : 'w-2 h-2 bg-slate-200 hover:bg-primary-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prev}
                  className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={next}
                  className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-slate-500 hover:text-primary-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
