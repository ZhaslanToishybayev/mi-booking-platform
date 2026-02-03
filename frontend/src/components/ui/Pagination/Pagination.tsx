import React from 'react'
import { motion } from 'framer-motion'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null
  }

  const pages: (number | string)[] = []
  const showEllipsisStart = currentPage > 3
  const showEllipsisEnd = currentPage < totalPages - 2

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (showEllipsisStart) {
      pages.push('...')
    }
    
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }
    
    if (showEllipsisEnd) {
      pages.push('...')
    }
    
    pages.push(totalPages)
  }

  const baseButtonStyles = 'relative px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:ring-offset-2 focus:ring-offset-dark-900'
  const activeStyles = 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-glow-cyan'
  const inactiveStyles = 'bg-glass border border-glass-border text-white/70 hover:text-white hover:bg-glass-hover hover:border-white/20'
  const disabledStyles = 'bg-dark-800/50 text-white/30 cursor-not-allowed border border-glass-border'

  return (
    <nav 
      className="flex items-center justify-center gap-2" 
      aria-label="Навигация по страницам" 
      data-testid="pagination"
    >
      {/* Previous button */}
      <motion.button
        whileHover={currentPage !== 1 ? { scale: 1.05 } : undefined}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : undefined}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonStyles} ${currentPage === 1 ? disabledStyles : inactiveStyles}`}
        aria-label="Предыдущая страница"
        data-testid="pagination-prev"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-white/40 font-body">...</span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(page as number)}
                className={`${baseButtonStyles} min-w-[40px] ${currentPage === page ? activeStyles : inactiveStyles}`}
                aria-current={currentPage === page ? 'page' : undefined}
                data-testid={`pagination-page-${page}`}
              >
                {page}
              </motion.button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next button */}
      <motion.button
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : undefined}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : undefined}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonStyles} ${currentPage === totalPages ? disabledStyles : inactiveStyles}`}
        aria-label="Следующая страница"
        data-testid="pagination-next"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </nav>
  )
}
