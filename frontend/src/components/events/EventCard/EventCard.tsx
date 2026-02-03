import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../../ui/Card/Card'
import { Button } from '../../ui/Button/Button'
import type { Event } from '../../../types/event'
import { formatDate, formatPrice } from '../../../utils/formatters'
import { getEventImage } from '../../../utils/images'

interface EventCardProps {
  event: Event
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const minPrice = Math.min(...event.ticket_types.map(t => t.price))
  const hasAvailable = event.ticket_types.some(t => t.available > 0)
  const imageUrl = event.image_url || getEventImage(event.title, event.id)

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
      className="h-full"
    >
      <Card variant="hover" className="h-full flex flex-col group" data-testid="event-card">
        {/* Image container */}
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />
          
          {/* Date badge */}
          <div className="absolute top-3 left-3">
            <div className="glass-card px-3 py-1.5 backdrop-blur-md">
              <p className="text-xs font-medium text-white/90 font-body">
                {formatDate(event.start_date)}
              </p>
            </div>
          </div>
          
          {/* Sold out overlay */}
          {!hasAvailable && (
            <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <span className="text-white font-display font-bold text-lg">Билеты проданы</span>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="flex-1 flex flex-col pt-4">
          {/* Title */}
          <h3 className="text-lg font-display font-semibold text-white mb-2 line-clamp-2 group-hover:text-accent-cyan transition-colors duration-300">
            {event.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-white/50 mb-4">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-body line-clamp-1">
              {event.location}
            </p>
          </div>
          
          {/* Price and Action */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-glass-border">
            <div>
              <p className="text-xs text-white/40 font-body mb-0.5">от</p>
              <span className="text-xl font-display font-bold gradient-text">
                {formatPrice(minPrice)}
              </span>
            </div>
            
            <Link to={`/events/${event.id}`}>
              <Button 
                variant={hasAvailable ? 'primary' : 'secondary'} 
                size="sm" 
                disabled={!hasAvailable}
              >
                {hasAvailable ? 'Подробнее' : 'Нет билетов'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
