import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardContent, CardFooter } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('has correct data-testid', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Card content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('has border bottom', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByTestId('card-header')).toHaveClass('border-b')
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('has border top', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByTestId('card-footer')).toHaveClass('border-t')
  })
})
