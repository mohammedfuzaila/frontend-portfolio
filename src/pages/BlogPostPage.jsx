import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { fetchBlogs } from '../api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const fallback = {
  title: 'Building Scalable React Applications with Django Backend',
  excerpt: 'Learn how to architect a full-stack application.',
  content: `## Introduction\n\nThis guide walks you through building a full-stack portfolio with React and Django.\n\n## Setting Up the Backend\n\nFirst, install Django and REST framework:\n\n\`\`\`bash\npip install django djangorestframework\n\`\`\`\n\n## Frontend Architecture\n\nReact with Vite provides excellent developer experience and blazing fast builds.\n\n## Conclusion\n\nWith this setup, you'll have a production-ready full-stack application.`,
  tags: ['React', 'Django', 'Full Stack'],
  category: 'Development',
  read_time: 8,
  created_at: '2025-01-15T10:00:00Z',
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs({ is_published: true }).then(({ data }) => {
      const d = data?.results || data
      const found = Array.isArray(d) ? d.find((b) => b.slug === slug) : null
      setPost(found || fallback)
    }).catch(() => setPost(fallback)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Posts
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="tech-badge mb-4 inline-block">{post?.category}</span>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-slate-800 mb-4 leading-tight">
              {post?.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(post?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post?.read_time} min read</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(post?.tags || []).map((t) => <span key={t} className="tech-badge"><Tag className="w-3 h-3 mr-0.5" />{t}</span>)}
            </div>
          </div>

          {/* Content */}
          <div className="glass-card p-8 sm:p-12 rounded-3xl shadow-glass">
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-code:bg-primary-50 prose-code:text-primary-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:rounded-xl">
              <ReactMarkdown>{post?.content || ''}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
