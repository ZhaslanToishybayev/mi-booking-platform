export interface TicketType {
  id: number
  name: 'vip' | 'standard' | 'student'
  price: number
  quantity: number
  available: number
}

export interface Event {
  id: number
  title: string
  description: string | null
  location: string
  start_date: string
  end_date: string
  image_url: string | null
  status: 'active' | 'cancelled' | 'completed'
  ticket_types: TicketType[]
}

export interface EventFilters {
  date_from?: string
  date_to?: string
  location?: string
}

export interface EventListResponse {
  data: Event[]
  meta: {
    current_page: number
    total_pages: number
    total: number
  }
}

export interface EventAvailability {
  event_id: number
  available: boolean
  ticket_types: Array<{
    type_id: number
    name: string
    available: number
    price: number
  }>
}
