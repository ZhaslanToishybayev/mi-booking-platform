import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByTestId('button')).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('is disabled when loading', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByTestId('button')).toBeDisabled()
  })

  it('applies different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByTestId('button')).toHaveClass('from-accent-cyan')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByTestId('button')).toHaveClass('bg-glass')
    
    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByTestId('button')).toHaveClass('from-red-500')
  })

  it('applies different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByTestId('button')).toHaveClass('text-sm')
    
    rerender(<Button size="md">Medium</Button>)
    expect(screen.getByTestId('button')).toHaveClass('text-base')
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByTestId('button')).toHaveClass('text-lg')
  })
})
