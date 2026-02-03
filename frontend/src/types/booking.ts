export interface Ticket {
  id: number
  ticket_type: 'vip' | 'standard' | 'student'
  seat_number: string | null
  qr_code: string
  status: 'active' | 'used' | 'cancelled'
  download_url: string
}

export interface Booking {
  id: number
  token: string
  event: {
    id: number
    title: string
    location: string
    start_date: string
  }
  email: string
  name: string
  phone: string | null
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'used'
  tickets: Ticket[]
  pdf_url: string
  created_at: string
}

export interface CreateBookingRequest {
  event_id: number
  email: string
  name: string
  phone?: string
  tickets: Array<{
    ticket_type_id: number
    quantity: number
  }>
}

export interface CreateBookingResponse {
  id: number
  token: string
  email: string
  name: string
  phone: string | null
  total_amount: number
  status: string
  tickets: Ticket[]
  pdf_url: string
  created_at: string
}
