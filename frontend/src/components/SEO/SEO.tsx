import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

const SITE_NAME = 'MI Booking'
const DEFAULT_DESCRIPTION = 'Бронирование билетов на мероприятия. Концерты, театры, выставки и многое другое.'
const DEFAULT_KEYWORDS = 'билеты, бронирование, мероприятия, концерты, театр, выставки'

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image,
  url,
  type = 'website',
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Canonical URL */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}
    </Helmet>
  )
}
