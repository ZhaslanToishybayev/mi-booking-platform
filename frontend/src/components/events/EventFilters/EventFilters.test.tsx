import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EventFilters } from './EventFilters'

describe('EventFilters', () => {
  const defaultProps = {
    onFilterChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders collapsed by default', () => {
    render(<EventFilters {...defaultProps} />)
    
    expect(screen.getByTestId('event-filters')).toBeInTheDocument()
    expect(screen.getByTestId('filter-toggle')).toBeInTheDocument()
    expect(screen.queryByTestId('filter-date-from')).not.toBeInTheDocument()
  })

  it('expands when clicking toggle', () => {
    render(<EventFilters {...defaultProps} />)
    
    fireEvent.click(screen.getByTestId('filter-toggle'))
    
    expect(screen.getByTestId('filter-date-from')).toBeInTheDocument()
    expect(screen.getByTestId('filter-date-to')).toBeInTheDocument()
    expect(screen.getByTestId('filter-location')).toBeInTheDocument()
  })

  it('calls onFilterChange when applying filters', () => {
    const onFilterChange = vi.fn()
    render(<EventFilters onFilterChange={onFilterChange} />)
    
    fireEvent.click(screen.getByTestId('filter-toggle'))
    fireEvent.change(screen.getByTestId('filter-location'), { target: { value: 'Москва' } })
    fireEvent.click(screen.getByTestId('filter-apply'))
    
    expect(onFilterChange).toHaveBeenCalledWith({ location: 'Москва' })
  })

  it('resets filters when clicking reset', () => {
    const onFilterChange = vi.fn()
    render(<EventFilters onFilterChange={onFilterChange} initialFilters={{ location: 'Москва' }} />)
    
    fireEvent.click(screen.getByTestId('filter-toggle'))
    fireEvent.click(screen.getByTestId('filter-reset'))
    
    expect(onFilterChange).toHaveBeenCalledWith({})
  })

  it('shows active indicator when filters are set', () => {
    render(<EventFilters {...defaultProps} initialFilters={{ location: 'Москва' }} />)
    
    expect(screen.getByText('Активны')).toBeInTheDocument()
  })

  it('handles date filters', () => {
    const onFilterChange = vi.fn()
    render(<EventFilters onFilterChange={onFilterChange} />)
    
    fireEvent.click(screen.getByTestId('filter-toggle'))
    fireEvent.change(screen.getByTestId('filter-date-from'), { target: { value: '2024-01-01' } })
    fireEvent.change(screen.getByTestId('filter-date-to'), { target: { value: '2024-12-31' } })
    fireEvent.click(screen.getByTestId('filter-apply'))
    
    expect(onFilterChange).toHaveBeenCalledWith({
      date_from: '2024-01-01',
      date_to: '2024-12-31',
    })
  })
})
