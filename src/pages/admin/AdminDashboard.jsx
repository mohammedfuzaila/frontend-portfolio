import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, FolderKanban, Code2, Briefcase, Award, MessageSquare,
  FileText, Star, Link2, Settings, LogOut, ChevronRight,
  Eye, PlusCircle, Edit3, Trash2, Menu, X, Globe
} from 'lucide-react'
import {
  fetchDashboardStats, fetchProjects, fetchSkills, fetchAllMessages,
  fetchBlogs, fetchTestimonials, fetchCertificates, fetchExperience,
  fetchSocialLinks, deleteProject, deleteSkill, deleteBlog, 
  deleteExperience, deleteCertificate, deleteTestimonial, deleteSocialLink,
  markMessageRead, deleteMessage
} from '../../api'
import toast from 'react-hot-toast'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

// Import Form components
import ProjectFormModal from './components/ProjectFormModal'
import SkillFormModal from './components/SkillFormModal'
import ExperienceFormModal from './components/ExperienceFormModal'
import CertificateFormModal from './components/CertificateFormModal'
import TestimonialFormModal from './components/TestimonialFormModal'
import BlogFormModal from './components/BlogFormModal'
import SocialFormModal from './components/SocialFormModal'
import SettingsPanel from './components/SettingsPanel'

const navSections = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: FolderKanban, label: 'Projects', key: 'projects' },
  { icon: Code2, label: 'Skills', key: 'skills' },
  { icon: Briefcase, label: 'Experience', key: 'experience' },
  { icon: Award, label: 'Certificates', key: 'certificates' },
  { icon: Star, label: 'Testimonials', key: 'testimonials' },
  { icon: FileText, label: 'Blog Posts', key: 'blogs' },
  { icon: MessageSquare, label: 'Messages', key: 'messages' },
  { icon: Link2, label: 'Social Links', key: 'socials' },
  { icon: Settings, label: 'Settings', key: 'settings' },
]

const chartData = [
  { month: 'Jan', views: 400 }, { month: 'Feb', views: 620 },
  { month: 'Mar', views: 580 }, { month: 'Apr', views: 890 },
  { month: 'May', views: 1200 }, { month: 'Jun', views: 1050 },
]

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div
      className="admin-card flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <div className="text-2xl font-bold text-white">{value ?? '—'}</div>
        <div className="text-slate-400 text-sm">{label}</div>
      </div>
      {trend && <div className="text-green-400 text-xs font-medium">↑ {trend}</div>}
    </div>
  )
}

function DashboardView({ stats }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h2>
        <p className="text-slate-400 text-sm">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} label="Total Projects" value={stats?.total_projects} color="bg-primary-600" />
        <StatCard icon={Code2} label="Skills" value={stats?.total_skills} color="bg-blue-600" />
        <StatCard icon={MessageSquare} label="Messages" value={stats?.total_messages} color="bg-rose-600" />
        <StatCard icon={FileText} label="Blog Posts" value={stats?.total_blogs} color="bg-emerald-600" />
        <StatCard icon={Eye} label="Unread" value={stats?.unread_messages} color="bg-amber-600" />
        <StatCard icon={FileText} label="Published" value={stats?.published_blogs} color="bg-teal-600" />
        <StatCard icon={Star} label="Testimonials" value={stats?.total_testimonials} color="bg-violet-600" />
        <StatCard icon={Award} label="Certificates" value={stats?.total_certificates} color="bg-pink-600" />
      </div>

      {/* Chart */}
      <div className="admin-card">
        <h3 className="font-semibold text-white mb-4">Portfolio Views (Demo)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
            <Area type="monotone" dataKey="views" stroke="#6C63FF" fill="url(#viewGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ProjectsView() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    fetchProjects().then(({ data }) => setProjects(data?.results || data || [])).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try { 
      await deleteProject(id)
      setProjects((p) => p.filter((x) => x.id !== id))
      toast.success('Project deleted') 
    } catch { 
      toast.error('Failed to delete') 
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <button 
          onClick={() => { setSelectedProject(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Add Project
        </button>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-semibold">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 hidden lg:table-cell">Featured</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{p.title}</div>
                  <div className="text-slate-400 text-xs line-clamp-1">{p.description}</div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full">{p.category}</span>
                </td>
                <td className="py-3 px-4 hidden lg:table-cell text-slate-400">
                  {p.is_featured ? '⭐ Yes' : 'No'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent-400 transition-colors"><Globe className="w-4 h-4" /></a>}
                    <button 
                      onClick={() => { setSelectedProject(p); setIsModalOpen(true) }}
                      className="text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No projects found.</p>}
      </div>

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        onSuccess={loadData}
      />
    </div>
  )
}

function SkillsView() {
  const [skills, setSkills] = useState([])
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    fetchSkills().then(({ data }) => setSkills(data?.results || data || [])).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    try {
      await deleteSkill(id)
      setSkills((s) => s.filter((x) => x.id !== id))
      toast.success('Skill deleted')
    } catch {
      toast.error('Failed to delete skill')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <button
          onClick={() => { setSelectedSkill(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Add Skill
        </button>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-semibold">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Level</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {skills.map((s) => (
              <tr key={s.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color || '#6C63FF' }} />
                  {s.name}
                </td>
                <td className="py-3 px-4 hidden md:table-cell capitalize text-slate-300">{s.category}</td>
                <td className="py-3 px-4 hidden md:table-cell text-slate-400 font-semibold">{s.level}%</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => { setSelectedSkill(s); setIsModalOpen(true) }}
                      className="text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {skills.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No skills found.</p>}
      </div>

      <SkillFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skill={selectedSkill}
        onSuccess={loadData}
      />
    </div>
  )
}

function ExperienceView() {
  const [experiences, setExperiences] = useState([])
  const [selectedExp, setSelectedExp] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    fetchExperience().then(({ data }) => setExperiences(data?.results || data || [])).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return
    try {
      await deleteExperience(id)
      setExperiences((e) => e.filter((x) => x.id !== id))
      toast.success('Experience deleted')
    } catch {
      toast.error('Failed to delete experience')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Experience &amp; Education</h2>
        <button
          onClick={() => { setSelectedExp(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Add Experience
        </button>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-semibold">
              <th className="text-left py-3 px-4">Role / Title</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Company / School</th>
              <th className="text-left py-3 px-4 hidden lg:table-cell">Type</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {experiences.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-medium text-white">{exp.role}</td>
                <td className="py-3 px-4 hidden md:table-cell text-slate-300">{exp.company}</td>
                <td className="py-3 px-4 hidden lg:table-cell capitalize">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    exp.type === 'work' ? 'bg-primary-500/20 text-primary-300' : 'bg-violet-500/20 text-violet-300'
                  }`}>
                    {exp.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => { setSelectedExp(exp); setIsModalOpen(true) }}
                      className="text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(exp.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {experiences.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No experiences found.</p>}
      </div>

      <ExperienceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        experience={selectedExp}
        onSuccess={loadData}
      />
    </div>
  )
}

function CertificatesView() {
  const [certs, setCerts] = useState([])
  const [selectedCert, setSelectedCert] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    fetchCertificates().then(({ data }) => setCerts(data?.results || data || [])).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return
    try {
      await deleteCertificate(id)
      setCerts((c) => c.filter((x) => x.id !== id))
      toast.success('Certificate deleted')
    } catch {
      toast.error('Failed to delete certificate')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Certificates</h2>
        <button
          onClick={() => { setSelectedCert(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Add Certificate
        </button>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-semibold">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Issuer</th>
              <th className="text-left py-3 px-4 hidden lg:table-cell">Date</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {certs.map((c) => (
              <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-medium text-white">{c.title}</td>
                <td className="py-3 px-4 hidden md:table-cell text-slate-300">{c.issuer}</td>
                <td className="py-3 px-4 hidden lg:table-cell text-slate-400">{c.date}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    {c.verify_url && <a href={c.verify_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent-400 transition-colors"><Globe className="w-4 h-4" /></a>}
                    <button
                      onClick={() => { setSelectedCert(c); setIsModalOpen(true) }}
                      className="text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {certs.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No certificates found.</p>}
      </div>

      <CertificateFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        certificate={selectedCert}
        onSuccess={loadData}
      />
    </div>
  )
}

function TestimonialsView() {
  const [testimonials, setTestimonials] = useState([])
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    fetchTestimonials().then(({ data }) => setTestimonials(data?.results || data || [])).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      await deleteTestimonial(id)
      setTestimonials((t) => t.filter((x) => x.id !== id))
      toast.success('Testimonial deleted')
    } catch {
      toast.error('Failed to delete testimonial')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Testimonials</h2>
        <button
          onClick={() => { setSelectedTestimonial(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Add Testimonial
        </button>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-semibold">
              <th className="text-left py-3 px-4">Client</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Role &amp; Company</th>
              <th className="text-left py-3 px-4 hidden lg:table-cell">Rating</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {testimonials.map((t) => (
              <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-medium text-white">{t.name}</td>
                <td className="py-3 px-4 hidden md:table-cell text-slate-300">{t.role} {t.company && `at ${t.company}`}</td>
                <td className="py-3 px-4 hidden lg:table-cell text-slate-400">{'⭐'.repeat(t.rating)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => { setSelectedTestimonial(t); setIsModalOpen(true) }}
                      className="text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {testimonials.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No testimonials found.</p>}
      </div>

      <TestimonialFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        testimonial={selectedTestimonial}
        onSuccess={loadData}
      />
    </div>
  )
}

function BlogsView() {
  const [blogs, setBlogs] = useState([])
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    fetchBlogs().then(({ data }) => setBlogs(data?.results || data || [])).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try { 
      await deleteBlog(id)
      setBlogs((b) => b.filter((x) => x.id !== id))
      toast.success('Post deleted') 
    } catch { 
      toast.error('Failed') 
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
        <button 
          onClick={() => { setSelectedBlog(null); setIsModalOpen(true) }}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> New Post
        </button>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-semibold">
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {blogs.map((b) => (
              <tr key={b.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{b.title}</div>
                  <div className="text-slate-400 text-xs">{b.read_time} min read</div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell text-slate-400 text-xs">{b.category}</td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full ${b.is_published ? 'bg-green-500/20 text-green-300' : 'bg-slate-700 text-slate-400'}`}>
                    {b.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button 
                      onClick={() => { setSelectedBlog(b); setIsModalOpen(true) }}
                      className="text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {blogs.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No blog posts yet.</p>}
      </div>

      <BlogFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blog={selectedBlog}
        onSuccess={loadData}
      />
    </div>
  )
}

function MessagesView() {
  const [messages, setMessages] = useState([])
  useEffect(() => { fetchAllMessages().then(({ data }) => setMessages(data?.results || data || [])).catch(() => {}) }, [])

  const handleRead = async (id) => {
    try {
      await markMessageRead(id)
      setMessages((m) => m.map((msg) => msg.id === id ? { ...msg, is_read: true } : msg))
      toast.success('Message marked as read')
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message permanently?')) return
    try {
      await deleteMessage(id)
      setMessages((m) => m.filter((msg) => msg.id !== id))
      toast.success('Message deleted')
    } catch { toast.error('Failed to delete message') }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Contact Messages</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`admin-card rounded-xl border border-slate-700/60 ${!msg.is_read ? 'border-primary-500/30' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{msg.name}</span>
                  {!msg.is_read && <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />}
                </div>
                <div className="text-slate-400 text-xs mb-2">{msg.email} · {new Date(msg.created_at).toLocaleDateString()}</div>
                <div className="font-medium text-slate-300 text-sm mb-1">{msg.subject}</div>
                <p className="text-slate-400 text-sm leading-relaxed">{msg.message}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!msg.is_read && (
                  <button onClick={() => handleRead(msg.id)} className="text-xs text-primary-400 hover:text-primary-300 px-2.5 py-1 bg-primary-500/10 rounded-lg hover:bg-primary-500/20 transition-all font-medium">
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-slate-500 text-center py-8">No messages yet.</p>}
      </div>
    </div>
  )
}

const FIXED_SOCIALS = [
  { platform: 'GitHub', icon: 'github', order: 1 },
  { platform: 'LinkedIn', icon: 'linkedin', order: 2 },
  { platform: 'Twitter', icon: 'twitter', order: 3 },
  { platform: 'Email', icon: 'mail', order: 4 },
  { platform: 'Phone', icon: 'phone', order: 5 }
];

function SocialsView() {
  const [socials, setSocials] = useState([])
  const [selectedSocial, setSelectedSocial] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = () => {
    fetchSocialLinks().then(({ data }) => setSocials(data?.results || data || [])).catch(() => {})
  }

  useEffect(() => { loadData() }, [])

  const displaySocials = FIXED_SOCIALS.map(fixed => {
    const existing = socials.find(s => s.platform.toLowerCase() === fixed.platform.toLowerCase() || s.icon === fixed.icon)
    return existing ? existing : { platform: fixed.platform, icon: fixed.icon, url: 'Not configured', order: fixed.order }
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Social Links</h2>
        <div className="text-sm text-slate-400">Permanently configured links</div>
      </div>
      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-semibold">
              <th className="text-left py-3 px-4">Platform</th>
              <th className="text-left py-3 px-4 hidden md:table-cell">URL</th>
              <th className="text-left py-3 px-4 hidden lg:table-cell">Order</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {displaySocials.map((s) => (
              <tr key={s.id || s.platform} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-4 font-medium text-white">{s.platform}</td>
                <td className="py-3 px-4 hidden md:table-cell text-slate-400 font-mono truncate max-w-xs">{s.url}</td>
                <td className="py-3 px-4 hidden lg:table-cell text-slate-400">{s.order}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    {s.id && s.url !== 'Not configured' && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent-400 transition-colors"><Globe className="w-4 h-4" /></a>}
                    <button
                      onClick={() => { setSelectedSocial(s.url === 'Not configured' ? { ...s, url: '' } : s); setIsModalOpen(true) }}
                      className="text-slate-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SocialFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        social={selectedSocial}
        onSuccess={loadData}
      />
    </div>
  )
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardStats().then(({ data }) => setStats(data)).catch(() => {})

    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => { logout(); navigate('/admin') }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardView stats={stats} />
      case 'projects': return <ProjectsView />
      case 'skills': return <SkillsView />
      case 'experience': return <ExperienceView />
      case 'certificates': return <CertificatesView />
      case 'testimonials': return <TestimonialsView />
      case 'blogs': return <BlogsView />
      case 'messages': return <MessagesView />
      case 'socials': return <SocialsView />
      case 'settings': return <SettingsPanel />
      default: return (
        <div className="flex items-center justify-center h-48 text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-3">🚧</div>
            <p>"{navSections.find(n => n.key === activeSection)?.label}" manager coming soon!</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar overlay backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: isMobile ? 256 : (sidebarOpen ? 256 : 72),
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        }}
        className="fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 z-50 flex flex-col overflow-hidden transition-all duration-300"
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <img src="/favicon.svg" alt="fuzail.script logo" className="w-9 h-9 object-contain flex-shrink-0" />
          {(isMobile || sidebarOpen) && (
            <span className="font-display font-black text-lg tracking-tight text-white flex items-center whitespace-nowrap">
              fuzail<span className="text-[10px] font-mono font-bold text-primary-400 bg-primary-500/10 border border-primary-500/20 px-1 py-0.5 rounded ml-0.5">.script</span>
              <span className="text-slate-400 text-xs font-normal ml-1.5">Admin</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="p-2 space-y-0.5 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
          {navSections.map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => {
                setActiveSection(key)
                if (isMobile) setSidebarOpen(false)
              }}
              className={`admin-nav-item w-full text-left flex items-center ${activeSection === key ? 'active' : ''}`}
              title={!isMobile && !sidebarOpen ? label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(isMobile || sidebarOpen) && <span className="text-sm font-medium">{label}</span>}
              {(isMobile || sidebarOpen) && activeSection === key && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item flex items-center" title="View Site">
            <Eye className="w-5 h-5 flex-shrink-0" />
            {(isMobile || sidebarOpen) && <span className="text-sm font-medium">View Site</span>}
          </a>
          <button onClick={handleLogout} className="admin-nav-item w-full text-left flex items-center hover:text-red-400" title="Logout">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isMobile || sidebarOpen) && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className="flex-1 transition-all duration-300 min-w-0 overflow-x-hidden"
        style={{
          marginLeft: isMobile ? 0 : (sidebarOpen ? 256 : 72)
        }}
      >
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <h1 className="text-slate-300 text-sm font-medium">
              {navSections.find((n) => n.key === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-slate-400 text-xs">Live</span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 md:p-6">
          <div
            key={activeSection}
            className=""
          >
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
