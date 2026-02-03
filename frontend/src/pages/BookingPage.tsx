import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEvent } from '../hooks/useEvents'
import { useCreateBooking } from '../hooks/useBooking'
import { Loading } from '../components/ui/Loading/Loading'
import { Button } from '../components/ui/Button/Button'
import { Input } from '../components/ui/Input/Input'
import { Card, CardContent } from '../components/ui/Card/Card'
import { formatDate, formatPrice } from '../utils/formatters'
import type { TicketType } from '../types/event'

interface SelectedTicket {
  ticket_type_id: number
  quantity: number
}

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const eventId = parseInt(id || '0', 10)

  const { data: event, isLoading } = useEvent(eventId)
  const createBooking = useCreateBooking()

  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (isLoading) {
    return <Loading text="Загрузка..." />
  }

  if (!event) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="glass-card inline-block p-12">
          <h2 className="text-xl font-display font-semibold text-white mb-4">Мероприятие не найдено</h2>
          <Link to="/">
            <Button>Вернуться к списку</Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  const handleTicketChange = (ticketType: TicketType, quantity: number) => {
    setSelectedTickets(prev => {
      const existing = prev.find(t => t.ticket_type_id === ticketType.id)
      if (quantity === 0) {
        return prev.filter(t => t.ticket_type_id !== ticketType.id)
      }
      if (existing) {
        return prev.map(t => t.ticket_type_id === ticketType.id ? { ...t, quantity } : t)
      }
      return [...prev, { ticket_type_id: ticketType.id, quantity }]
    })
  }

  const getQuantity = (ticketTypeId: number) => {
    return selectedTickets.find(t => t.ticket_type_id === ticketTypeId)?.quantity || 0
  }

  const calculateTotal = () => {
    return selectedTickets.reduce((total, selected) => {
      const ticketType = event.ticket_types.find(t => t.id === selected.ticket_type_id)
      return total + (ticketType?.price || 0) * selected.quantity
    }, 0)
  }

  const totalTickets = selectedTickets.reduce((sum, t) => sum + t.quantity, 0)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!email) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Введите корректный email'
    }
    if (!name) newErrors.name = 'Имя обязательно'
    if (selectedTickets.length === 0) newErrors.tickets = 'Выберите хотя бы один билет'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const result = await createBooking.mutateAsync({
        event_id: eventId,
        email,
        name,
        phone: phone || undefined,
        tickets: selectedTickets,
      })

      const existingTokens = JSON.parse(localStorage.getItem('bookingTokens') || '[]')
      localStorage.setItem('bookingTokens', JSON.stringify([...existingTokens, result.token]))

      navigate('/booking/success', { state: { booking: result } })
    } catch (error) {
      setErrors({ submit: 'Ошибка при создании бронирования. Попробуйте снова.' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link 
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-white/60 hover:text-accent-cyan transition-colors mb-6 font-body group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к мероприятию
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Бронирование</h1>
        <p className="text-white/60 font-body text-lg">{event.title}</p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent>
                  <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                      <span className="font-bold text-accent-cyan">1</span>
                    </div>
                    Выберите билеты
                  </h2>
                  
                  <div className="space-y-4">
                    {event.ticket_types.map((type, index) => (
                      <motion.div 
                        key={type.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-dark-800/50 border border-glass-border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-display font-semibold text-white uppercase">
                              {type.name}
                            </span>
                            <span className="text-xl font-display font-bold text-accent-cyan">
                              {formatPrice(type.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {type.available > 0 ? (
                              <span className="badge-success">
                                Доступно: {type.available}
                              </span>
                            ) : (
                              <span className="badge-danger">
                                Распродано
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Quantity selector */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleTicketChange(type, Math.max(0, getQuantity(type.id) - 1))}
                            className="w-10 h-10 rounded-xl bg-dark-700 border border-glass-border flex items-center justify-center text-white/70 hover:text-white hover:border-accent-cyan/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={getQuantity(type.id) === 0}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <span className="w-12 text-center text-xl font-display font-bold text-white">
                            {getQuantity(type.id)}
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => handleTicketChange(type, Math.min(type.available, Math.min(10, getQuantity(type.id) + 1)))}
                            className="w-10 h-10 rounded-xl bg-dark-700 border border-glass-border flex items-center justify-center text-white/70 hover:text-white hover:border-accent-cyan/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={getQuantity(type.id) >= Math.min(type.available, 10)}
                            data-testid={`ticket-quantity-${type.id}`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {errors.tickets && (
                    <p className="text-red-400 text-sm mt-4 font-body">{errors.tickets}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
                      <span className="font-bold text-accent-purple">2</span>
                    </div>
                    Контактные данные
                  </h2>
                  
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                      placeholder="your@email.com"
                      required
                    />
                    <Input
                      label="Имя"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                      placeholder="Ваше имя"
                      required
                    />
                    <Input
                      label="Телефон (необязательно)"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 999 123-45-67"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right column - Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:sticky lg:top-28 self-start"
          >
            <Card variant="gradient">
              <CardContent>
                <h2 className="text-xl font-display font-semibold text-white mb-6">Ваш заказ</h2>
                
                {/* Event info */}
                <div className="mb-6 pb-6 border-b border-glass-border">
                  <h3 className="font-display font-medium text-white mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-white/50 text-sm font-body">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.start_date)}
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-sm font-body mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>

                {/* Selected tickets */}
                {selectedTickets.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {selectedTickets.map(ticket => {
                      const ticketType = event.ticket_types.find(t => t.id === ticket.ticket_type_id)
                      if (!ticketType) return null
                      return (
                        <div key={ticket.ticket_type_id} className="flex justify-between items-center text-sm">
                          <span className="text-white/70 font-body">
                            {ticketType.name} × {ticket.quantity}
                          </span>
                          <span className="text-white font-display font-medium">
                            {formatPrice(ticketType.price * ticket.quantity)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-white/40 text-sm font-body mb-6">
                    Выберите билеты для продолжения
                  </p>
                )}

                {/* Total */}
                <div className="pt-4 border-t border-glass-border mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 font-body">
                      Итого ({totalTickets} {getTicketWord(totalTickets)}):
                    </span>
                    <span className="text-2xl font-display font-bold gradient-text">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Submit error */}
                {errors.submit && (
                  <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400 text-sm font-body">{errors.submit}</p>
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={createBooking.isPending}
                  disabled={selectedTickets.length === 0}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Забронировать
                </Button>
                
                <p className="text-center text-white/40 text-xs font-body mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями бронирования
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </form>
    </div>
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
