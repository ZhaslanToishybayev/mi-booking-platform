import { useMutation, useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../api'
import type { CreateBookingRequest } from '../types/booking'

const BOOKING_QUERY_KEY = 'booking'

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
  })
}

export const useBooking = (token: string) => {
  return useQuery({
    queryKey: [BOOKING_QUERY_KEY, token],
    queryFn: () => bookingsApi.get(token),
    enabled: !!token,
  })
}

export const useCancelBooking = () => {
  return useMutation({
    mutationFn: (token: string) => bookingsApi.cancel(token),
  })
}
