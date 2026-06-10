import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import SkillsSection from '../components/SkillsSection'
import ServicesSection from '../components/ServicesSection'
import ProjectsSection from '../components/ProjectsSection'
import ExperienceSection from '../components/ExperienceSection'
import CertificatesSection from '../components/CertificatesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import BlogSection from '../components/BlogSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import { fetchSettings } from '../api'

export default function HomePage() {
  const [settings, setSettings] = useState({
    show_hero: true,
    show_about: true,
    show_skills: true,
    show_services: true,
    show_projects: true,
    show_experience: true,
    show_certificates: true,
    show_testimonials: true,
    show_blog: true,
    show_contact: true,
  })
  const [backendOnline, setBackendOnline] = useState(false)

  useEffect(() => {
    fetchSettings().then(({ data }) => {
      if (data) setSettings(prev => ({ ...prev, ...data }))
      setBackendOnline(true)
    }).catch(() => {
      setBackendOnline(false)
    })
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {settings.show_hero && <HeroSection backendOnline={backendOnline} />}
        {settings.show_about && <AboutSection backendOnline={backendOnline} />}
        {settings.show_skills && <SkillsSection backendOnline={backendOnline} />}
        {settings.show_services && <ServicesSection backendOnline={backendOnline} />}
        {settings.show_projects && <ProjectsSection backendOnline={backendOnline} />}
        {settings.show_experience && <ExperienceSection backendOnline={backendOnline} />}
        {settings.show_certificates && <CertificatesSection backendOnline={backendOnline} />}
        {settings.show_testimonials && <TestimonialsSection backendOnline={backendOnline} />}
        {settings.show_blog && <BlogSection backendOnline={backendOnline} />}
        {settings.show_contact && <ContactSection backendOnline={backendOnline} />}
      </main>
      <Footer />
    </div>
  )
}
