import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api' : 'https://backend-fuzailportfolio.onrender.com/api')

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s — Render free tier can take ~30-50s on cold start
})

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh/`, { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/admin'
        }
      }
    }
    return Promise.reject(error)
  }
)

// ─── Public API ────────────────────────────────────────────────────
export const fetchHero = () => api.get('/hero/')
export const fetchAbout = () => api.get('/about/')
export const fetchSkills = (params) => api.get('/skills/', { params })
export const fetchProjects = (params) => api.get('/projects/', { params })
export const fetchProject = (id) => api.get(`/projects/${id}/`)
export const fetchExperience = (params) => api.get('/experience/', { params })
export const fetchCertificates = () => api.get('/certificates/')
export const fetchTestimonials = () => api.get('/testimonials/')
export const fetchBlogs = (params) => api.get('/blogs/', { params })
export const fetchBlog = (id) => api.get(`/blogs/${id}/`)
export const fetchSocialLinks = () => api.get('/social-links/')
export const fetchSeo = () => api.get('/seo/')
export const fetchSettings = () => api.get('/settings/')
export const fetchServices = () => api.get('/services/')
export const sendContact = (data) => api.post('/contact/', data)

// ─── Admin API ─────────────────────────────────────────────────────
export const adminLogin = (credentials) => api.post('/auth/login/', credentials)
export const fetchDashboardStats = () => api.get('/admin/stats/')
export const fetchAllMessages = () => api.get('/contact/')
export const markMessageRead = (id) => api.patch(`/admin/messages/${id}/read/`)
export const deleteMessage = (id) => api.delete(`/contact/${id}/`)

// Skills CRUD
export const createSkill = (data) => api.post('/skills/', data)
export const updateSkill = (id, data) => api.patch(`/skills/${id}/`, data)
export const deleteSkill = (id) => api.delete(`/skills/${id}/`)

// Projects CRUD
export const createProject = (data) => api.post('/projects/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateProject = (id, data) => api.patch(`/projects/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteProject = (id) => api.delete(`/projects/${id}/`)

// Experience CRUD
export const createExperience = (data) => api.post('/experience/', data)
export const updateExperience = (id, data) => api.patch(`/experience/${id}/`, data)
export const deleteExperience = (id) => api.delete(`/experience/${id}/`)

// Blogs CRUD
export const createBlog = (data) => api.post('/blogs/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateBlog = (id, data) => api.patch(`/blogs/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteBlog = (id) => api.delete(`/blogs/${id}/`)

// Testimonials CRUD
export const createTestimonial = (data) => api.post('/testimonials/', data)
export const updateTestimonial = (id, data) => api.patch(`/testimonials/${id}/`, data)
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}/`)

// Certificates CRUD
export const createCertificate = (data) => api.post('/certificates/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateCertificate = (id, data) => api.patch(`/certificates/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteCertificate = (id) => api.delete(`/certificates/${id}/`)

// Singleton updates
export const updateHero = (data) => api.patch('/hero/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateAbout = (data) => api.patch('/about/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateSeo = (data) => api.patch('/seo/', data, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateSiteSettings = (data) => api.patch('/settings/', data)

// Social Links CRUD
export const createSocialLink = (data) => api.post('/social-links/', data)
export const updateSocialLink = (id, data) => api.patch(`/social-links/${id}/`, data)
export const deleteSocialLink = (id) => api.delete(`/social-links/${id}/`)

// Services CRUD
export const createService = (data) => api.post('/services/', data)
export const updateService = (id, data) => api.patch(`/services/${id}/`, data)
export const deleteService = (id) => api.delete(`/services/${id}/`)

export default api
