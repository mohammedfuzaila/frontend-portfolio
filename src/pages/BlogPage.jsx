import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Tag, Search, ArrowLeft } from 'lucide-react'
import { fetchBlogs } from '../api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const fallback = [
  { id: 1, title: 'Building Scalable React Applications with Django Backend', slug: 'react-django-scalable', excerpt: 'Learn how to architect a full-stack application with React on the frontend and Django REST Framework providing a robust API backend.', tags: ['React', 'Django'], category: 'Development', read_time: 8, created_at: '2025-01-15T10:00:00Z' },
  { id: 2, title: 'Mastering Tailwind CSS: Building Premium UI Components', slug: 'tailwind-premium-ui', excerpt: 'Explore advanced Tailwind CSS techniques to build beautiful, responsive UI components that look premium and professional.', tags: ['Tailwind', 'CSS'], category: 'Design', read_time: 6, created_at: '2025-01-10T10:00:00Z' },
  { id: 3, title: 'JWT Authentication: Best Practices for Secure APIs', slug: 'jwt-auth-best-practices', excerpt: 'A comprehensive guide to implementing JWT authentication in your APIs.', tags: ['Security', 'Django'], category: 'Security', read_time: 10, created_at: '2025-01-05T10:00:00Z' },
]

const cardColors = ['from-primary-400 to-violet-500', 'from-rose-400 to-pink-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500', 'from-indigo-400 to-blue-500']

export default function BlogPage() {
  const [blogs, setBlogs] = useState(fallback)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs({ is_published: true }).then(({ data }) => {
      const d = data?.results || data
      if (Array.isArray(d) && d.length > 0) setBlogs(d)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = blogs.filter(
    (b) => b.title.toLowerCase().includes(search.toLowerCase()) ||
           b.excerpt?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
          <h1 className="font-display text-5xl font-black text-slate-800 mb-4">
            Developer <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-slate-500 text-lg mb-8">Thoughts on code, design, and the future of tech</p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className={`h-44 bg-gradient-to-br ${cardColors[i % cardColors.length]} relative`}>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex gap-4 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.read_time} min</span>
                </div>
                <h2 className="font-display font-bold text-slate-800 text-lg mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(post.tags || []).slice(0, 3).map((t) => <span key={t} className="tech-badge text-xs">{t}</span>)}
                </div>
                <Link to={`/blog/${post.slug}`} className="text-primary-600 text-sm font-semibold hover:text-primary-700">Read Article →</Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">No posts found matching "{search}"</div>
        )}
      </main>
      <Footer />
    </div>
  )
}
