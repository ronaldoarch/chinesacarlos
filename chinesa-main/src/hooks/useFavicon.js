import { useEffect } from 'react'
import api from '../services/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/logo_plataforma.png'
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '')
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  if (imagePath.startsWith('/uploads')) return `${baseUrl}${imagePath}`
  const uploadsIndex = imagePath.indexOf('/uploads/')
  if (uploadsIndex !== -1) return `${baseUrl}${imagePath.slice(uploadsIndex)}`
  return imagePath
}

const updateFavicon = (logoUrl) => {
  const faviconUrl = getImageUrl(logoUrl)
  
  // Remove favicons existentes
  const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
  existingFavicons.forEach(link => link.remove())
  
  // Cria novo link para favicon
  const link = document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/png'
  link.href = faviconUrl
  
  // Adiciona ao head
  document.head.appendChild(link)
}

export const useFavicon = () => {
  useEffect(() => {
    const loadLogoAndUpdateFavicon = async () => {
      try {
        const response = await api.getLogo()
        if (response.success && response.data.logo) {
          const logoUrl = response.data.logo.imageUrl
          updateFavicon(logoUrl)
        } else {
          // Usa logo padrão se não houver logo da API
          updateFavicon('/logo_plataforma.png')
        }
      } catch (error) {
        console.error('Error loading logo for favicon:', error)
        // Usa logo padrão em caso de erro
        updateFavicon('/logo_plataforma.png')
      }
    }
    
    loadLogoAndUpdateFavicon()
  }, [])
}

export default useFavicon
