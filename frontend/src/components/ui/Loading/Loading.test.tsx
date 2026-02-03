import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Loading } from './Loading'

describe('Loading', () => {
  it('renders loading spinner', () => {
    render(<Loading />)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('shows default text', () => {
    render(<Loading />)
    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('shows custom text when provided', () => {
    render(<Loading text="Loading events..." />)
    expect(screen.getByText('Loading events...')).toBeInTheDocument()
  })

  it('applies different sizes', () => {
    const { rerender } = render(<Loading size="sm" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-6')
    
    rerender(<Loading size="md" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-10')
    
    rerender(<Loading size="lg" />)
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-14')
  })
})
