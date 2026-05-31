import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchSkills } from '../api'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'devops', label: 'DevOps' },
  { key: 'tools', label: 'Tools' },
  { key: 'uiux', label: 'UI/UX' },
]

const categoryColors = {
  frontend: 'from-blue-400 to-primary-500',
  backend: 'from-green-400 to-emerald-600',
  database: 'from-orange-400 to-amber-600',
  devops: 'from-red-400 to-rose-600',
  tools: 'from-purple-400 to-violet-600',
  uiux: 'from-pink-400 to-fuchsia-600',
}

const fallbackSkills = [
  { id: 1, name: 'React.js', category: 'frontend', level: 90, color: '#61DAFB' },
  { id: 2, name: 'JavaScript', category: 'frontend', level: 88, color: '#F7DF1E' },
  { id: 3, name: 'Python', category: 'backend', level: 88, color: '#3776AB' },
  { id: 4, name: 'Django', category: 'backend', level: 85, color: '#092E20' },
  { id: 5, name: 'HTML5', category: 'frontend', level: 95, color: '#E34F26' },
  { id: 6, name: 'CSS3', category: 'frontend', level: 92, color: '#1572B6' },
  { id: 7, name: 'Tailwind CSS', category: 'frontend', level: 88, color: '#06B6D4' },
  { id: 8, name: 'PostgreSQL', category: 'database', level: 78, color: '#336791' },
  { id: 9, name: 'Git', category: 'devops', level: 88, color: '#F05032' },
  { id: 10, name: 'Figma', category: 'uiux', level: 78, color: '#F24E1E' },
  { id: 11, name: 'Next.js', category: 'frontend', level: 78, color: '#000000' },
  { id: 12, name: 'Bootstrap', category: 'frontend', level: 85, color: '#7952B3' },
]

function SkillCard({ skill, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-card p-5 rounded-2xl cursor-default group"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-white text-sm group-hover:text-primary-400 transition-colors">
            {skill.name}
          </h3>
          <span className="text-xs text-slate-400 capitalize">{skill.category}</span>
        </div>
        <span className="text-sm font-bold gradient-text">{skill.level}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${categoryColors[skill.category] || 'from-primary-400 to-accent-400'}`}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsSection() {
  const [skills, setSkills] = useState(fallbackSkills)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    fetchSkills().then(({ data }) => {
      const items = data?.results || data
      if (Array.isArray(items) && items.length > 0) setSkills(items)
    }).catch(() => {})
  }, [])

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter((s) => s.category === activeCategory)

  return (
    <section id="skills" className="section bg-transparent relative overflow-hidden">
      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="tech-badge mb-4 inline-block">Skills</span>
          <h2 className="section-title">
            Tech Stack &amp; <span className="gradient-text">Expertise</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Technologies and tools I work with to build amazing products
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.key
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'glass-card text-slate-300 hover:text-primary-400'
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filtered.map((skill, i) => (
            <SkillCard key={skill.id || skill.name} skill={skill} index={i} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-300 text-sm">
            Always learning and expanding my tech repertoire.{' '}
            <span className="gradient-text font-semibold">Currently exploring TypeScript & Next.js</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
