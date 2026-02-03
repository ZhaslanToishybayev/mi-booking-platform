import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export const Layout: React.FC = () => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      {/* Glass Navbar */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <nav className="mx-4 mt-4 px-6 py-4 glass-card flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-glow-cyan group-hover:shadow-glow-purple transition-shadow duration-300">
              <span className="font-display font-bold text-lg">MI</span>
            </div>
            <span className="font-display font-semibold text-xl hidden sm:block">
              <span className="text-white">MI</span>
              <span className="text-white/60">Booking</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <NavLink to="/" active={location.pathname === '/'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="hidden sm:inline">Мероприятия</span>
            </NavLink>
            
            <NavLink to="/my-bookings" active={location.pathname === '/my-bookings'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="hidden sm:inline">Мои билеты</span>
            </NavLink>
          </div>
        </nav>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-glass-border bg-dark-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                <span className="font-display font-bold text-sm">MI</span>
              </div>
              <span className="text-white/40 font-body text-sm">
                Премиальное бронирование билетов
              </span>
            </div>
            <p className="text-white/30 text-sm font-body">
              &copy; {new Date().getFullYear()} MI Booking. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface NavLinkProps {
  to: string
  active: boolean
  children: React.ReactNode
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={`
        relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-medium
        transition-all duration-300
        ${active 
          ? 'text-white bg-glass' 
          : 'text-white/60 hover:text-white hover:bg-glass/50'
        }
      `}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  )
}
