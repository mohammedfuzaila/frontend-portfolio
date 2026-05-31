import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { FaGithub as Github } from 'react-icons/fa'
import { fetchProject } from '../api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ProjectPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject(id).then(({ data }) => setProject(data)).catch(() => {}).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!project) return <div className="min-h-screen flex items-center justify-center text-slate-500">Project not found</div>

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/#projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>

          <div className="h-64 rounded-3xl bg-gradient-to-br from-primary-400 to-accent-400 mb-8 flex items-center justify-center">
            <span className="font-display text-8xl font-black text-white/30">{project.title.slice(0, 2).toUpperCase()}</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="font-display text-4xl font-black text-slate-800 mb-4">{project.title}</h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">{project.long_description || project.description}</p>
              <div className="flex flex-wrap gap-2">
                {(project.tech_tags || []).map((t) => <span key={t} className="tech-badge">{t}</span>)}
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl space-y-4 h-fit">
              <h3 className="font-semibold text-slate-700">Project Links</h3>
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center text-sm py-3">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-center text-sm py-3">
                  <Github className="w-4 h-4" /> Source Code
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
