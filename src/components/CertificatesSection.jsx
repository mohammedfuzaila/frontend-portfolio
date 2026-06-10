import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, ExternalLink, X, ZoomIn } from 'lucide-react'
import { fetchCertificates } from '../api'

/* ── Lightbox Modal ──────────────────────────────────────── */
function CertLightbox({ cert, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Certificate image */}
          <div className="w-full bg-slate-800 flex items-center justify-center" style={{ minHeight: '220px' }}>
            {cert.image_url ? (
              <img
                src={cert.image_url}
                alt={cert.title}
                className="w-full object-contain max-h-72"
              />
            ) : (
              <Award className="w-20 h-20 text-primary-400 opacity-50" />
            )}
          </div>

          {/* Info */}
          <div className="p-6 space-y-3">
            <h3 className="font-bold text-white text-lg leading-snug">{cert.title}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{cert.issuer}</span>
              {cert.date && <span className="text-slate-500">{cert.date}</span>}
            </div>

            {cert.verify_url && (
              <a
                href={cert.verify_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Verify Certificate
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Certificate Card ────────────────────────────────────── */
function CertCard({ cert, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onClick(cert)}
      className="glass-card p-6 rounded-2xl group relative overflow-hidden flex flex-col gap-4 cursor-pointer"
    >
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Image / Icon */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center flex-shrink-0">
        {cert.image_url ? (
          <img
            src={cert.image_url}
            alt={cert.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Award className="w-14 h-14 text-primary-400 opacity-60" />
        )}
        {/* Zoom overlay hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-primary-400 transition-colors line-clamp-2">
          {cert.title}
        </h3>
        <p className="text-xs text-slate-400">{cert.issuer}</p>
        {cert.date && (
          <span className="text-xs text-slate-500">{cert.date}</span>
        )}
      </div>

      {/* Verify link */}
      {cert.verify_url && (
        <span className="flex items-center gap-1.5 text-xs text-primary-400 font-medium mt-auto">
          <ExternalLink className="w-3.5 h-3.5" />
          Verify Certificate
        </span>
      )}
    </motion.div>
  )
}

/* ── Main Section ────────────────────────────────────────── */
export default function CertificatesSection({ backendOnline }) {
  const [certs, setCerts] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchCertificates().then(({ data }) => {
      const items = data?.results || data
      if (Array.isArray(items)) setCerts(items)
    }).catch(() => { setCerts([]) })
  }, [])

  const handleClose = useCallback(() => setSelected(null), [])

  if (!backendOnline) {
    return (
      <section id="certificates" className="section bg-transparent relative overflow-hidden">
        <div className="section-container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="tech-badge mb-4 inline-block">Certificates</span>
            <h2 className="section-title">
              My <span className="gradient-text">Certifications</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Click any certificate to view it in full — verified credentials and achievements
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  if (!certs || certs.length === 0) return null

  return (
    <>
      <section id="certificates" className="section bg-transparent relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/3 left-0 w-[350px] h-[350px] rounded-full bg-primary-100/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-accent-100/20 blur-3xl pointer-events-none" />

        <div className="section-container relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="tech-badge mb-4 inline-block">Certificates</span>
            <h2 className="section-title">
              My <span className="gradient-text">Certifications</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Click any certificate to view it in full — verified credentials and achievements
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {certs.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                index={i}
                onClick={setSelected}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selected && <CertLightbox cert={selected} onClose={handleClose} />}
    </>
  )
}
