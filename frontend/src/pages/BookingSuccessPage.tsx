import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button/Button'
import { Card, CardContent } from '../components/ui/Card/Card'
import { formatDate, formatPrice } from '../utils/formatters'
import type { Booking } from '../types/booking'

interface LocationState {
  booking: Booking
}

export const BookingSuccessPage: React.FC = () => {
  const location = useLocation()
  const { booking } = (location.state as LocationState) || {}

  if (!booking) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="glass-card inline-block p-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-semibold text-white mb-3">
            Информация о бронировании не найдена
          </h2>
          <p className="text-white/50 font-body mb-6">
            Возможно, страница была обновлена
          </p>
          <Link to="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        {/* Animated checkmark */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 relative"
        >
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-glow-cyan">
            <motion.svg 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-12 h-12 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-display font-bold text-white mb-3"
        >
          Бронирование подтверждено!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 font-body text-lg"
        >
          Спасибо за ваш заказ. Билеты отправлены на вашу почту.
        </motion.p>
      </motion.div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card variant="gradient" className="mb-8">
          <CardContent>
            <h2 className="text-lg font-display font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Детали бронирования
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-glass-border">
                <span className="text-white/50 font-body">Мероприятие</span>
                <span className="font-display font-medium text-white text-right max-w-[60%]">
                  {booking.event.title}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-glass-border">
                <span className="text-white/50 font-body">Дата</span>
                <span className="font-body text-white">{formatDate(booking.event.start_date)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-glass-border">
                <span className="text-white/50 font-body">Имя</span>
                <span className="font-body text-white">{booking.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-glass-border">
                <span className="text-white/50 font-body">Email</span>
                <span className="font-body text-white">{booking.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-glass-border">
                <span className="text-white/50 font-body">Количество билетов</span>
                <span className="font-body text-white">{booking.tickets.length}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="font-display font-semibold text-white">Итого</span>
                <span className="text-2xl font-display font-bold gradient-text">
                  {formatPrice(booking.total_amount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <a
          href={booking.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className="w-full" size="lg">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Скачать билеты (PDF)
          </Button>
        </a>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/my-bookings">
            <Button variant="secondary" className="w-full">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Мои билеты
            </Button>
          </Link>

          <Link to="/">
            <Button variant="ghost" className="w-full">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              На главную
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
