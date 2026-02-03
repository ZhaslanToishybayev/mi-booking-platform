import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useEvents } from '../hooks/useEvents'
import { EventCard } from '../components/events/EventCard/EventCard'
import { EventFilters } from '../components/events/EventFilters/EventFilters'
import { Pagination } from '../components/ui/Pagination/Pagination'
import { EventCardSkeletonGrid } from '../components/ui/Skeleton/Skeleton'
import { Button } from '../components/ui/Button/Button'
import { SEO } from '../components/SEO/SEO'
import type { EventFilters as EventFiltersType } from '../types/event'

const EVENTS_PER_PAGE = 9

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<EventFiltersType>({})
  const [currentPage, setCurrentPage] = useState(1)
  
  const { data, isLoading, error } = useEvents(filters, currentPage, EVENTS_PER_PAGE)

  const handleFilterChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const events = data?.data || []
  const meta = data?.meta || { current_page: 1, total_pages: 1, total: 0 }

  return (
    <div>
      <SEO 
        title="Мероприятия"
        description="Найдите и забронируйте билеты на лучшие мероприятия. Концерты, театры, выставки и многое другое."
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mb-12 -mt-8 py-16 overflow-hidden"
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-cyan/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6"
          >
            <span className="text-white">Забронируй </span>
            <span className="gradient-text">лучшие события</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-8 font-body"
          >
            Концерты, театры, фестивали и эксклюзивные мероприятия. 
            Найди своё незабываемое впечатление.
          </motion.p>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-8 sm:gap-12"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-bold text-accent-cyan">
                {meta.total || '—'}
              </div>
              <div className="text-sm text-white/40 font-body">событий</div>
            </div>
            <div className="w-px h-10 bg-glass-border" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-bold text-accent-purple">
                24/7
              </div>
              <div className="text-sm text-white/40 font-body">онлайн</div>
            </div>
            <div className="w-px h-10 bg-glass-border" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-bold text-accent-pink">
                100%
              </div>
              <div className="text-sm text-white/40 font-body">безопасно</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters */}
      <EventFilters onFilterChange={handleFilterChange} initialFilters={filters} />

      {/* Loading State */}
      {isLoading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="h-5 w-40 bg-dark-700 rounded animate-pulse" />
          </div>
          <EventCardSkeletonGrid count={EVENTS_PER_PAGE} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="glass-card inline-block p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 mb-4 font-body">Ошибка загрузки мероприятий</p>
            <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
          </div>
        </motion.div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && (
        <>
          {events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="glass-card inline-block p-12">
                <div className="text-white/30 mb-6">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Нет доступных мероприятий
                </h3>
                {(filters.date_from || filters.date_to || filters.location) && (
                  <p className="text-white/50 font-body">
                    Попробуйте изменить фильтры поиска
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/50 font-body">
                  Найдено мероприятий: <span className="font-semibold text-white">{meta.total}</span>
                </p>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {events.map((event, index) => (
                  <motion.div key={event.id} variants={itemVariants} custom={index}>
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>

              {meta.total_pages > 1 && (
                <div className="mt-10">
                  <Pagination
                    currentPage={meta.current_page}
                    totalPages={meta.total_pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
