import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import { fetchExperience } from '../api'

const fallback = [
  {
    id: 1, type: 'work', role: 'Full Stack Developer Trainee',
    company: 'Aspirasys IT Foundation', duration: '2024 – Present',
    location: 'Tamil Nadu, India',
    description: 'Leading development of scalable web applications using modern JavaScript frameworks. Mentoring junior developers and implementing best practices for code quality and performance optimization.',
    achievements: ['Delivered 7+ projects with 99% client satisfaction', 'Implemented scalable React + Django architecture', 'Mentored junior developers in best practices', 'Reduced page load times by 40%'],
  },
  {
    id: 2, type: 'education', role: 'B.Sc Computer Science',
    company: 'Islamiah College (Autonomous)', duration: '2021 – 2024',
    location: 'Vaniyambadi, Tamil Nadu',
    description: 'Graduated with strong knowledge in programming, web development, and computer science fundamentals. Developed practical skills through academic projects and teamwork.',
    achievements: ['Strong foundation in Data Structures & Algorithms', 'Web development academic projects', 'Collaborative teamwork experience'],
  },
]

export default function ExperienceSection({ backendOnline }) {
  const [items, setItems] = useState(null)

  useEffect(() => {
    fetchExperience().then(({ data }) => {
      const d = data?.results || data
      if (Array.isArray(d)) setItems(d)
    }).catch(() => { setItems([]) })
  }, [])

  if (!backendOnline) {
    return (
      <section id="experience" className="section bg-transparent relative overflow-hidden">
        <div className="section-container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="tech-badge mb-4 inline-block">Journey</span>
            <h2 className="section-title">
              Experience & <span className="gradient-text">Education</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              My professional journey and academic background
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  if (!items || items.length === 0) return null;

  return (
    <section id="experience" className="section bg-transparent relative overflow-hidden">
      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="tech-badge mb-4 inline-block">Journey</span>
          <h2 className="section-title">
            Experience &amp; <span className="gradient-text">Education</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            My professional journey and academic background
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-200 via-accent-200 to-transparent" />

          <div className="space-y-8">
            {items.map((item, i) => {
              const isWork = item.type === 'work'
              const isLeft = i % 2 === 0

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} pl-8 md:pl-0 flex-row`}
                >
                  {/* Card */}
                  <div className="flex-1">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      className="glass-card p-6 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-display font-bold text-white text-xl mb-0.5">{item.role}</h3>
                          <p className="font-semibold text-primary-500">{item.company}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isWork ? 'bg-primary-50 text-primary-500' : 'bg-accent-50 text-accent-600'
                        }`}>
                          {isWork ? <Briefcase className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {item.duration}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed mb-4">{item.description}</p>

                      {/* Achievements */}
                      {item.achievements && item.achievements.length > 0 && (
                        <ul className="space-y-1.5">
                          {item.achievements.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  </div>

                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.2 }}
                    className="absolute left-4 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-primary shadow-glow mt-6 z-10"
                  />

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
