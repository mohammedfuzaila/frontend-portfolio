import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import { FaGithub as Github, FaLinkedin as Linkedin, FaTwitter as Twitter } from 'react-icons/fa'
import { sendContact } from '../api'
import toast from 'react-hot-toast'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'anaikarmohammedfuzail57@gmail.com', href: 'mailto:anaikarmohammedfuzail57@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+91 8870539407', href: 'tel:+918870539407' },
  { icon: MapPin, label: 'Location', value: 'Pernambut, Tamil Nadu, India', href: null },
]

const socials = [
  { icon: Github, href: 'https://github.com/mohammedfuzaila', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/fuzail', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
]

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      await sendContact(form)
      setSent(true)
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section bg-transparent relative overflow-hidden">
      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="tech-badge mb-4 inline-block">Contact</span>
          <h2 className="section-title">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Let's discuss your next project and build something amazing together
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-2">Let's Work Together</h3>
              <p className="text-slate-500 leading-relaxed">
                I'm currently available for freelance projects and full-time opportunities. 
                Feel free to reach out for collaborations or just a friendly hello!
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <motion.div
                  key={label}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all duration-200 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{label}</div>
                    {href ? (
                      <a href={href} className="text-slate-200 font-medium text-sm hover:text-primary-400 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <div className="text-slate-200 font-medium text-sm">{value}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Socials */}
            <div>
              <p className="text-sm text-slate-400 font-medium mb-3">Follow Me</p>
              <div className="flex gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 glass-card flex items-center justify-center rounded-xl text-slate-500 hover:text-primary-600 hover:shadow-glow transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Status card */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="glass-card p-5 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="font-semibold text-slate-200 text-sm">Available for Work</span>
              </div>
              <p className="text-xs text-slate-400">Response time: Usually within 24 hours</p>
            </motion.div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 rounded-2xl text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-300">Thank you for reaching out. I'll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-primary mt-6">Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-5 shadow-glass-lg">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Anaikar Mohammed"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="input-field resize-none"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full btn-primary justify-center py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
