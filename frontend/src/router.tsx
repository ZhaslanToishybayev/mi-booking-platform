import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { EventDetailPage } from './pages/EventDetailPage'
import { BookingPage } from './pages/BookingPage'
import { BookingSuccessPage } from './pages/BookingSuccessPage'
import { MyBookingsPage } from './pages/MyBookingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'events/:id',
        element: <EventDetailPage />,
      },
      {
        path: 'events/:id/book',
        element: <BookingPage />,
      },
      {
        path: 'booking/success',
        element: <BookingSuccessPage />,
      },
      {
        path: 'my-bookings',
        element: <MyBookingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
