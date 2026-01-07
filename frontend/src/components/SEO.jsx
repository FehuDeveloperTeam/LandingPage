import { useEffect } from 'react'

function SEO({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = 'website'
}) {
  const siteName = 'Fehu Developers'
  const defaultDescription = 'Desarrollo web profesional en Chile. Aplicaciones React, Django, Flutter. Soluciones tecnológicas a medida para tu negocio.'
  const defaultImage = 'https://fehudevelopers.cl/og-image.jpg'
  const baseUrl = 'https://fehudevelopers.cl'

  const seo = {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || defaultDescription,
    image: image || defaultImage,
    url: url ? `${baseUrl}${url}` : baseUrl,
    keywords: keywords || 'desarrollo web, react, django, flutter, chile, aplicaciones, software'
  }

  useEffect(() => {
    // Title
    document.title = seo.title

    // Meta tags
    const metaTags = {
      'description': seo.description,
      'keywords': seo.keywords,
      'author': 'Fehu Developers',
      'robots': 'index, follow',
      // Open Graph
      'og:type': type,
      'og:title': seo.title,
      'og:description': seo.description,
      'og:image': seo.image,
      'og:url': seo.url,
      'og:site_name': siteName,
      'og:locale': 'es_CL',
      // Twitter
      'twitter:card': 'summary_large_image',
      'twitter:title': seo.title,
      'twitter:description': seo.description,
      'twitter:image': seo.image,
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      let element = document.querySelector(`meta[name="${name}"]`) || 
                    document.querySelector(`meta[property="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          element.setAttribute('property', name)
        } else {
          element.setAttribute('name', name)
        }
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    })

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', seo.url)

  }, [seo.title, seo.description, seo.image, seo.url, seo.keywords, type])

  return null
}

export default SEO