import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { EventCard } from './EventCard'
import { mockEvent } from '../../../__tests__/mocks/data'

describe('EventCard', () => {
  it('renders event title', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent()} />
      </BrowserRouter>
    )
    expect(screen.getByText('Концерт группы XYZ')).toBeInTheDocument()
  })

  it('renders event location', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent()} />
      </BrowserRouter>
    )
    expect(screen.getByText('Москва, Крокус Сити Холл')).toBeInTheDocument()
  })

  it('shows minimum price', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent()} />
      </BrowserRouter>
    )
    expect(screen.getByText(/от/)).toBeInTheDocument()
  })

  it('has link to event details', () => {
    render(
      <BrowserRouter>
        <EventCard event={mockEvent({ id: 123 })} />
      </BrowserRouter>
    )
    const link = screen.getByText('Подробнее').closest('a')
    expect(link).toHaveAttribute('href', '/events/123')
  })

  it('disables button when no tickets available', () => {
    const event = mockEvent({
      ticket_types: [
        { id: 1, name: 'standard', price: 1000, quantity: 0, available: 0 }
      ]
    })
    render(
      <BrowserRouter>
        <EventCard event={event} />
      </BrowserRouter>
    )
    expect(screen.getByText('Билеты проданы')).toBeInTheDocument()
  })
})
