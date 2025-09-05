import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import App from './App'

describe('App', () => {
  it('renders main heading', () => {
    render(<App />)
    const el = screen.getByText('Web Image Upscaler')
    expect(Boolean(el)).toBe(true)
  })

  it('should not have any accessibility violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results.violations.length).toBe(0)
  })
})
