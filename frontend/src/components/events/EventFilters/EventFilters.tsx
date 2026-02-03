import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../ui/Button/Button'
import type { EventFilters as EventFiltersType } from '../../../types/event'

interface EventFiltersProps {
  onFilterChange: (filters: EventFiltersType) => void
  initialFilters?: EventFiltersType
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<EventFiltersType>(initialFilters)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange(filters)
  }

  const handleReset = () => {
    setFilters({})
    onFilterChange({})
  }

  const hasActiveFilters = filters.date_from || filters.date_to || filters.location

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 mb-8" 
      data-testid="event-filters"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={isExpanded}
        data-testid="filter-toggle"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <span className="font-display font-medium text-white">Фильтры</span>
            {hasActiveFilters && (
              <span className="ml-3 badge-info">
                Активны
              </span>
            )}
          </div>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit} 
            className="overflow-hidden"
          >
            <div className="mt-6 pt-6 border-t border-glass-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="date_from" className="block text-sm font-medium text-white/70 mb-2 font-body">
                    Дата от
                  </label>
                  <input
                    type="date"
                    id="date_from"
                    value={filters.date_from || ''}
                    onChange={(e) => setFilters({ ...filters, date_from: e.target.value || undefined })}
                    className="input-glass"
                    data-testid="filter-date-from"
                  />
                </div>

                <div>
                  <label htmlFor="date_to" className="block text-sm font-medium text-white/70 mb-2 font-body">
                    Дата до
                  </label>
                  <input
                    type="date"
                    id="date_to"
                    value={filters.date_to || ''}
                    onChange={(e) => setFilters({ ...filters, date_to: e.target.value || undefined })}
                    className="input-glass"
                    data-testid="filter-date-to"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-white/70 mb-2 font-body">
                    Локация
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={filters.location || ''}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value || undefined })}
                    placeholder="Введите город или место"
                    className="input-glass"
                    data-testid="filter-location"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button type="submit" size="sm" data-testid="filter-apply">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Применить
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  data-testid="filter-reset"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Сбросить
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
