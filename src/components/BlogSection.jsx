import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchBlogs } from '../api'

const fallback = [
  { id: 1, title: 'Building Scalable React Applications with Django Backend', slug: 'react-django-scalable', excerpt: 'Learn how to architect a full-stack application with React on the frontend and Django REST Framework providing a robust API backend.', tags: ['React', 'Django', 'Full Stack'], category: 'Development', read_time: 8, created_at: '2025-01-15T10:00:00Z', is_published: true },
  { id: 2, title: 'Mastering Tailwind CSS: Building Premium UI Components', slug: 'tailwind-premium-ui', excerpt: 'Explore advanced Tailwind CSS techniques to build beautiful, responsive UI components that look premium and professional.', tags: ['Tailwind', 'CSS', 'UI/UX'], category: 'Design', read_time: 6, created_at: '2025-01-10T10:00:00Z', is_published: true },
  { id: 3, title: 'JWT Authentication: Best Practices for Secure APIs', slug: 'jwt-auth-best-practices', excerpt: 'A comprehensive guide to implementing JWT authentication in your APIs with Django REST Framework and best security practices.', tags: ['Security', 'Django', 'JWT'], category: 'Security', read_time: 10, created_at: '2025-01-05T10:00:00Z', is_published: true },
]

const cardColors = [
  'from-primary-400 to-violet-500',
  'from-rose-400 to-pink-500',
  'from-emerald-400 to-teal-500',
]

export default function BlogSection() {
  const [blogs, setBlogs] = useState(null)

  useEffect(() => {
    fetchBlogs({ is_published: true }).then(({ data }) => {
      const d = data?.results || data
      if (Array.isArray(d)) setBlogs(d.slice(0, 3))
    }).catch(() => { setBlogs([]) })
  }, [])

  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blog" className="section bg-transparent relative overflow-hidden">
      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="tech-badge mb-4 inline-block">Blog</span>
            <h2 className="section-title">
              Latest <span className="gradient-text">Insights</span>
            </h2>
            <p className="section-subtitle">
              Thoughts on development, design, and technology
            </p>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all"
          >
            All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Cover */}
              <div className={`h-44 bg-gradient-to-br ${cardColors[i % cardColors.length]} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.read_time} min read
                  </span>
                </div>

                <h3 className="font-display font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {(post.tags || []).slice(0, 3).map((tag) => (
                    <span key={tag} className="tech-badge text-xs">
                      <Tag className="w-3 h-3 mr-0.5" />{tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="flex items-center gap-1 text-primary-600 text-sm font-semibold mt-4 hover:gap-2 transition-all"
                >
                  Read More <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/blog" className="btn-secondary inline-flex">
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
