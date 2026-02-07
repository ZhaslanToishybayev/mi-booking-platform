import axios, { AxiosError, AxiosInstance } from 'axios'
import type { Event, EventListResponse, EventAvailability, EventFilters } from '../types/event'
import type { Booking, CreateBookingRequest, CreateBookingResponse } from '../types/booking'

class ApiClient {
  private client: AxiosInstance
  private baseUrl: string

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
    this.client = axios.create({
      baseURL: this.baseUrl ? `${this.baseUrl}/api/v1` : '/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 404) {
          return Promise.reject(new Error('Не найдено'))
        }
        if (error.response?.status === 422) {
          const message = (error.response.data as { message?: string })?.message || 'Ошибка валидации'
          return Promise.reject(new Error(message))
        }
        if (error.response?.status && error.response.status >= 500) {
          return Promise.reject(new Error('Ошибка сервера. Попробуйте позже.'))
        }
        if (!error.response) {
          return Promise.reject(new Error('Ошибка сети. Проверьте подключение к интернету.'))
        }
        return Promise.reject(error)
      }
    )
  }

  // Events
  async getEvents(filters?: EventFilters, page: number = 1, perPage: number = 10): Promise<EventListResponse> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', perPage.toString())
    
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)
    if (filters?.location) params.append('location', filters.location)

    const response = await this.client.get<EventListResponse>(`/events?${params.toString()}`)
    return response.data
  }

  async getEvent(id: number): Promise<Event> {
    const response = await this.client.get<Event>(`/events/${id}`)
    return response.data
  }

  async getEventAvailability(id: number): Promise<EventAvailability> {
    const response = await this.client.get<EventAvailability>(`/events/${id}/availability`)
    return response.data
  }

  // Bookings
  async createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> {
    const response = await this.client.post<CreateBookingResponse>('/bookings', data)
    return response.data
  }

  async getBooking(token: string): Promise<Booking> {
    const response = await this.client.get<Booking>(`/bookings/${token}`)
    return response.data
  }

  async cancelBooking(token: string): Promise<{ message: string; booking: Booking }> {
    const response = await this.client.post<{ message: string; booking: Booking }>(`/bookings/${token}/cancel`)
    return response.data
  }

  // PDF
  getBookingPdfUrl(token: string): string {
    const path = `/api/v1/bookings/${token}/pdf`
    return this.baseUrl ? `${this.baseUrl}${path}` : path
  }

  getTicketPdfUrl(token: string, ticketId: number): string {
    const path = `/api/v1/bookings/${token}/tickets/${ticketId}/pdf`
    return this.baseUrl ? `${this.baseUrl}${path}` : path
  }
}

export const apiClient = new ApiClient()
