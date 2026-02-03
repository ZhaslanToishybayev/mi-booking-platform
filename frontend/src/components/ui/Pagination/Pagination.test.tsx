import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders pagination with correct pages', () => {
    render(<Pagination {...defaultProps} />)
    
    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-page-1')).toBeInTheDocument()
    expect(screen.getByTestId('pagination-page-5')).toBeInTheDocument()
  })

  it('disables prev button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    
    const prevButton = screen.getByTestId('pagination-prev')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)
    
    const nextButton = screen.getByTestId('pagination-next')
    expect(nextButton).toBeDisabled()
  })

  it('calls onPageChange when clicking a page', () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />)
    
    fireEvent.click(screen.getByTestId('pagination-page-3'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange when clicking prev button', () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />)
    
    fireEvent.click(screen.getByTestId('pagination-prev'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when clicking next button', () => {
    const onPageChange = vi.fn()
    render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />)
    
    fireEvent.click(screen.getByTestId('pagination-next'))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('shows ellipsis for many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />)
    
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    
    const currentButton = screen.getByTestId('pagination-page-3')
    expect(currentButton).toHaveAttribute('aria-current', 'page')
  })
})
