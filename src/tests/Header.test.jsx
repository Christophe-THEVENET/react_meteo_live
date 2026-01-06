import { describe, it, expect } from '@jest/globals'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from './testUtils'
import Header from '../components/Header'

describe('Header', () => {
  it('should render with French title by default', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('Cyber Météo')).toBeInTheDocument()
  })

  it('should render with English title when lang is en', () => {
    renderWithProviders(<Header />, {
      initialState: { lang: 'en' },
    })
    expect(screen.getByText('Cyber Weather')).toBeInTheDocument()
  })

  it('should display FR and EN options', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('FR')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('should toggle language when clicked', () => {
    const { store } = renderWithProviders(<Header />)

    // Initial state is 'fr'
    expect(store.getState().lang).toBe('fr')

    // Click on lang toggle button
    fireEvent.click(screen.getByRole('button'))

    // Should now be 'en'
    expect(store.getState().lang).toBe('en')
  })
})
