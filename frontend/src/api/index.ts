import { apiClient } from './client'

export const eventsApi = {
  getEvents: apiClient.getEvents.bind(apiClient),
  getEvent: apiClient.getEvent.bind(apiClient),
  getAvailability: apiClient.getEventAvailability.bind(apiClient),
}

export const bookingsApi = {
  create: apiClient.createBooking.bind(apiClient),
  get: apiClient.getBooking.bind(apiClient),
  cancel: apiClient.cancelBooking.bind(apiClient),
  getBookingPdfUrl: apiClient.getBookingPdfUrl.bind(apiClient),
  getTicketPdfUrl: apiClient.getTicketPdfUrl.bind(apiClient),
}

export { apiClient }
