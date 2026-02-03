import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEvent, useEventAvailability } from '../hooks/useEvents'
import { Loading } from '../components/ui/Loading/Loading'
import { Button } from '../components/ui/Button/Button'
import { Card, CardContent } from '../components/ui/Card/Card'
import { SEO } from '../components/SEO/SEO'
import { formatDate, formatPrice } from '../utils/formatters'
import { getEventImage } from '../utils/images'

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const eventId = parseInt(id || '0', 10)

  const { data: event, isLoading: isLoadingEvent, error: eventError } = useEvent(eventId)
  const { data: availability, isLoading: isLoadingAvailability } = useEventAvailability(eventId)

  if (isLoadingEvent || isLoadingAvailability) {
    return <Loading text="Загрузка..." />
  }

  if (eventError || !event) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="glass-card inline-block p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-white mb-2">Мероприятие не найдено</h2>
          <p className="text-white/50 mb-6 font-body">Возможно, оно было удалено или ссылка устарела</p>
          <Link to="/">
            <Button>Вернуться к списку</Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  const imageUrl = event.image_url || getEventImage(event.title, event.id)

  return (
    <div className="max-w-6xl mx-auto">
      <SEO 
        title={event.title}
        description={event.description || `Купить билеты на ${event.title}. ${event.location}, ${formatDate(event.start_date)}`}
        image={event.image_url || undefined}
      />

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-accent-cyan transition-colors mb-6 font-body group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к мероприятиям
        </Link>
      </motion.div>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-2xl overflow-hidden mb-8"
      >
        <div className="aspect-[21/9] md:aspect-[3/1]">
          <img 
            src={imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent" />
        
        {/* Event info on image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4"
          >
            {event.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 md:gap-6"
          >
            {/* Date */}
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-body">{formatDate(event.start_date)}</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-body">{event.location}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left column - Description */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent>
              <h2 className="text-xl font-display font-semibold text-white mb-4">О мероприятии</h2>
              {event.description ? (
                <p className="text-white/70 font-body leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              ) : (
                <p className="text-white/40 font-body italic">
                  Описание мероприятия не указано
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column - Tickets */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:sticky lg:top-28 self-start"
        >
          <Card variant="gradient">
            <CardContent>
              <h2 className="text-xl font-display font-semibold text-white mb-6">Билеты</h2>
              
              <div className="space-y-3 mb-6">
                {event.ticket_types.map((type, index) => (
                  <motion.div 
                    key={type.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex justify-between items-center py-3 px-4 rounded-xl bg-dark-800/50 border border-glass-border hover:border-accent-cyan/30 transition-colors"
                  >
                    <div>
                      <span className="font-display font-medium text-white uppercase text-sm">
                        {type.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {type.available > 0 ? (
                          <span className="badge-success text-xs">
                            {type.available} доступно
                          </span>
                        ) : (
                          <span className="badge-danger text-xs">
                            Распродано
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-display font-bold text-accent-cyan text-lg">
                      {formatPrice(type.price)}
                    </span>
                  </motion.div>
                ))}
              </div>

              {availability?.available ? (
                <Link to={`/events/${event.id}/book`}>
                  <Button className="w-full" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Забронировать
                  </Button>
                </Link>
              ) : (
                <Button className="w-full" size="lg" disabled variant="secondary">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Билеты проданы
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
