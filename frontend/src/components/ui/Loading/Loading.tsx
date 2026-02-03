import React from 'react'
import { motion } from 'framer-motion'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Загрузка...' 
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8" 
      data-testid="loading"
    >
      {/* Animated gradient spinner */}
      <div className="relative">
        <motion.div
          data-testid="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${sizes[size]} rounded-full border-2 border-transparent`}
          style={{
            background: 'conic-gradient(from 0deg, transparent, #00D4FF, #8B5CF6, #EC4899, transparent)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 2px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 2px))',
          }}
        />
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full bg-accent-cyan/20 blur-xl" />
      </div>
      
      {text && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm text-white/60 font-body"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  )
}
