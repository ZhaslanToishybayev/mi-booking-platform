import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '../api'
import type { EventFilters } from '../types/event'

const EVENTS_QUERY_KEY = 'events'
const EVENT_QUERY_KEY = 'event'

export const useEvents = (filters?: EventFilters, page: number = 1, perPage: number = 10) => {
  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, filters, page, perPage],
    queryFn: () => eventsApi.getEvents(filters, page, perPage),
  })
}

export const useEvent = (id: number) => {
  return useQuery({
    queryKey: [EVENT_QUERY_KEY, id],
    queryFn: () => eventsApi.getEvent(id),
    enabled: !!id,
  })
}

export const useEventAvailability = (id: number) => {
  return useQuery({
    queryKey: [EVENT_QUERY_KEY, id, 'availability'],
    queryFn: () => eventsApi.getAvailability(id),
    enabled: !!id,
  })
}
