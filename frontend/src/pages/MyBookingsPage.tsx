import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useBooking, useCancelBooking } from '../hooks/useBooking'
import { BookingCardSkeleton } from '../components/ui/Skeleton/Skeleton'
import { Button } from '../components/ui/Button/Button'
import { Card, CardContent } from '../components/ui/Card/Card'
import { SEO } from '../components/SEO/SEO'
import { formatDate, formatPrice } from '../utils/formatters'
import type { Ticket } from '../types/booking'

const TICKET_TYPE_LABELS: Record<string, string> = {
  vip: 'VIP',
  standard: 'Стандарт',
  student: 'Студенческий',
}

const STATUS_CONFIG = {
  confirmed: { label: 'Подтверждено', class: 'badge-success' },
  cancelled: { label: 'Отменено', class: 'badge-danger' },
  used: { label: 'Использовано', class: 'badge-warning' },
}

export const MyBookingsPage: React.FC = () => {
  const [tokens, setTokens] = useState<string[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookingTokens') || '[]')
    setTokens(stored)
  }, [])

  if (tokens.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <SEO 
          title="Мои бронирования"
          description="Просмотр и управление вашими бронированиями билетов на мероприятия."
        />
        <div className="glass-card inline-block p-12 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-purple/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-3">Мои бронирования</h1>
          <p className="text-white/50 font-body mb-8">
            У вас пока нет бронирований. Найдите интересное мероприятие и забронируйте билеты!
          </p>
          <Link to="/">
            <Button size="lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Найти мероприятия
            </Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <SEO 
        title="Мои бронирования"
        description="Просмотр и управление вашими бронированиями билетов на мероприятия."
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          Мои бронирования
        </h1>
        <p className="text-white/50 font-body">
          {tokens.length} {getBookingWord(tokens.length)}
        </p>
      </motion.div>
      
      <div className="space-y-6">
        {tokens.map((token, index) => (
          <motion.div
            key={token}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <BookingCard token={token} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const BookingCard: React.FC<{ token: string }> = ({ token }) => {
  const { data: booking, isLoading, refetch } = useBooking(token)
  const cancelBooking = useCancelBooking()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showTickets, setShowTickets] = useState(false)

  const handleCancel = async () => {
    try {
      await cancelBooking.mutateAsync(token)
      setShowCancelConfirm(false)
      refetch()
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  if (isLoading) {
    return <BookingCardSkeleton />
  }

  if (!booking) {
    return null
  }

  const statusConfig = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG] || {
    label: booking.status,
    class: 'badge-info',
  }

  return (
    <Card variant="hover">
      <CardContent>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Event Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Event thumbnail placeholder */}
              <div className="hidden sm:block w-20 h-20 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex-shrink-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-display font-semibold text-white mb-2 truncate">
                  {booking.event.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 font-body mb-3">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(booking.event.start_date)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {booking.event.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className={statusConfig.class}>{statusConfig.label}</span>
                  <span className="text-lg font-display font-bold text-accent-cyan">
                    {formatPrice(booking.total_amount)}
                  </span>
                  <span className="text-white/40 text-sm font-body">
                    ({booking.tickets.length} {getTicketWord(booking.tickets.length)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a href={booking.pdf_url} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </Button>
            </a>
            
            {booking.status === 'confirmed' && (
              <AnimatePresence mode="wait">
                {showCancelConfirm ? (
                  <motion.div 
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={handleCancel}
                      isLoading={cancelBooking.isPending}
                    >
                      Да, отменить
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => setShowCancelConfirm(false)}
                    >
                      Нет
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="cancel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Отменить
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Tickets toggle */}
        {booking.tickets.length > 0 && (
          <div className="mt-6 pt-6 border-t border-glass-border">
            <button
              onClick={() => setShowTickets(!showTickets)}
              className="flex items-center gap-2 text-sm text-accent-cyan hover:text-accent-cyan/80 font-medium font-body transition-colors"
              data-testid="toggle-tickets"
            >
              <motion.svg 
                animate={{ rotate: showTickets ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
              {showTickets ? 'Скрыть билеты' : 'Показать билеты'}
            </button>

            <AnimatePresence>
              {showTickets && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {booking.tickets.map((ticket, index) => (
                    <TicketCard key={ticket.id} ticket={ticket} index={index + 1} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const TicketCard: React.FC<{ ticket: Ticket; index: number }> = ({ ticket, index }) => {
  const statusColors = {
    active: 'border-emerald-500/30 bg-emerald-500/5',
    used: 'border-gray-500/30 bg-gray-500/5',
    cancelled: 'border-red-500/30 bg-red-500/5',
  }

  const statusLabels = {
    active: { text: 'Активен', class: 'badge-success' },
    used: { text: 'Использован', class: 'badge-warning' },
    cancelled: { text: 'Отменён', class: 'badge-danger' },
  }

  const status = statusLabels[ticket.status] || { text: ticket.status, class: 'badge-info' }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`rounded-xl border-2 p-4 ${statusColors[ticket.status]}`}
      data-testid="ticket-card"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs text-white/40 font-body">Билет #{index}</span>
          <p className="font-display font-medium text-white">
            {TICKET_TYPE_LABELS[ticket.ticket_type] || ticket.ticket_type}
          </p>
          {ticket.seat_number && (
            <p className="text-sm text-white/50 font-body">Место: {ticket.seat_number}</p>
          )}
        </div>
        <span className={status.class}>{status.text}</span>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-xl bg-white">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(ticket.qr_code)}`}
            alt={`QR код билета ${index}`}
            className="w-24 h-24"
            loading="lazy"
          />
        </div>
      </div>

      {/* Download button */}
      <a 
        href={ticket.download_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <Button variant="ghost" size="sm" className="w-full">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Скачать PDF
        </Button>
      </a>
    </motion.div>
  )
}

function getTicketWord(count: number): string {
  const lastTwo = count % 100
  const lastOne = count % 10
  
  if (lastTwo >= 11 && lastTwo <= 19) return 'билетов'
  if (lastOne === 1) return 'билет'
  if (lastOne >= 2 && lastOne <= 4) return 'билета'
  return 'билетов'
}

function getBookingWord(count: number): string {
  const lastTwo = count % 100
  const lastOne = count % 10
  
  if (lastTwo >= 11 && lastTwo <= 19) return 'бронирований'
  if (lastOne === 1) return 'бронирование'
  if (lastOne >= 2 && lastOne <= 4) return 'бронирования'
  return 'бронирований'
}
