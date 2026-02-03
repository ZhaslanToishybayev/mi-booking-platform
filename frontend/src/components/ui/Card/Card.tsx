import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'hover' | 'gradient'
  animate?: boolean
  'data-testid'?: string
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  animate = false,
  'data-testid': testId,
  ...props 
}) => {
  const variants = {
    default: 'glass-card',
    hover: 'glass-card-hover',
    gradient: 'glass-card gradient-border',
  }

  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
  } : {}

  return (
    <motion.div 
      className={`${variants[variant]} overflow-hidden ${className}`}
      data-testid={testId || 'card'}
      {...animationProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-glass-border ${className}`} data-testid="card-header">
      {children}
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`} data-testid="card-content">
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-glass-border ${className}`} data-testid="card-footer">
      {children}
    </div>
  )
}
