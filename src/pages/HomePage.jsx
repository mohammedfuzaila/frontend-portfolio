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

  useEffect(() => {
    fetchSettings().then(({ data }) => {
      if (data) setSettings(prev => ({ ...prev, ...data }))
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {settings.show_hero && <HeroSection />}
        {settings.show_about && <AboutSection />}
        {settings.show_skills && <SkillsSection />}
        {settings.show_services && <ServicesSection />}
        {settings.show_projects && <ProjectsSection />}
        {settings.show_experience && <ExperienceSection />}
        {settings.show_certificates && <CertificatesSection />}
        {settings.show_testimonials && <TestimonialsSection />}
        {settings.show_blog && <BlogSection />}
        {settings.show_contact && <ContactSection />}
      </main>
      <Footer />
    </div>
  )
}
