import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import VendorAuthPage from '../../app/vendor/auth/page'

// Mocking next/navigation with stable objects
const mockSearchParams = { get: vi.fn().mockReturnValue(null) };
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/vendor/auth',
}))

// Mocking useVendorAuth hook
vi.mock('@/lib/vendor-auth', () => ({
  useVendorAuth: () => ({
    login: vi.fn(),
    signup: vi.fn(),
    loginWithGoogle: vi.fn(),
    loginWithMicrosoft: vi.fn(),
    loginWithOTP: vi.fn(),
  }),
}))

describe('VendorAuthPage', () => {
  it('renders login form by default', () => {
    render(<VendorAuthPage />)
    expect(screen.getByText(/Welcome back/i)).toBeDefined()
    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeDefined()
  })

  it('switches to signup when "Sign up for free" is clicked', async () => {
    render(<VendorAuthPage />)
    const signUpButton = await screen.findByText(/Sign up for free/i)
    fireEvent.click(signUpButton)
    expect(await screen.findByText(/Create an account/i)).toBeDefined()
  })

  it('shows phone auth when phone tab is clicked', async () => {
    render(<VendorAuthPage />)
    const phoneTab = await screen.findByText(/Phone/i)
    fireEvent.click(phoneTab)
    expect(await screen.findByText(/Phone Number \(India Only\)/i)).toBeDefined()
  })
})
