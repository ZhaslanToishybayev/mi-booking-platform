import type { Event, TicketType } from '../../types/event'
import type { Booking, Ticket } from '../../types/booking'

export const mockTicketType = (overrides?: Partial<TicketType>): TicketType => ({
  id: 1,
  name: 'standard',
  price: 2500,
  quantity: 100,
  available: 50,
  ...overrides,
})

export const mockEvent = (overrides?: Partial<Event>): Event => ({
  id: 1,
  title: 'Концерт группы XYZ',
  description: 'Описание мероприятия',
  location: 'Москва, Крокус Сити Холл',
  start_date: '2024-03-15T19:00:00',
  end_date: '2024-03-15T22:00:00',
  image_url: '/storage/events/1.jpg',
  status: 'active',
  ticket_types: [
    mockTicketType({ id: 1, name: 'vip', price: 5000, available: 20 }),
    mockTicketType({ id: 2, name: 'standard', price: 2500, available: 100 }),
    mockTicketType({ id: 3, name: 'student', price: 1500, available: 30 }),
  ],
  ...overrides,
})

export const mockTicket = (overrides?: Partial<Ticket>): Ticket => ({
  id: 1,
  ticket_type: 'standard',
  seat_number: 'A-12',
  qr_code: 'TICKET-1-UUID',
  status: 'active',
  download_url: '/api/v1/bookings/token/tickets/1/pdf',
  ...overrides,
})

export const mockBooking = (overrides?: Partial<Booking>): Booking => ({
  id: 1,
  token: 'test-token-123',
  event: {
    id: 1,
    title: 'Концерт группы XYZ',
    location: 'Москва, Крокус Сити Холл',
    start_date: '2024-03-15T19:00:00',
  },
  email: 'test@example.com',
  name: 'Иван Петров',
  phone: '+7 999 123-45-67',
  total_amount: 7500,
  status: 'confirmed',
  tickets: [mockTicket(), mockTicket({ id: 2, ticket_type: 'vip' })],
  pdf_url: '/api/v1/bookings/test-token-123/pdf',
  created_at: '2024-01-15T14:30:00',
  ...overrides,
})

export const mockEvents = (count: number): Event[] => {
  return Array.from({ length: count }, (_, i) =>
    mockEvent({
      id: i + 1,
      title: `Мероприятие ${i + 1}`,
    })
  )
}
