import { describe, it, expect, jest } from '@jest/globals'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from './testUtils'
import CityInput from '../components/CityInput'

// Mock useCitySearch hook
jest.mock('../hooks/useWeather', () => ({
  useCitySearch: () => ({ data: [] }),
}))

describe('CityInput', () => {
  it('should render input with French placeholder by default', () => {
    renderWithProviders(<CityInput />)
    expect(
      screen.getByPlaceholderText('// ENTRER LOCALISATION...'),
    ).toBeInTheDocument()
  })

  it('should render input with English placeholder when lang is en', () => {
    renderWithProviders(<CityInput />, {
      initialState: { lang: 'en' },
    })
    expect(
      screen.getByPlaceholderText('// ENTER LOCATION...'),
    ).toBeInTheDocument()
  })

  it('should render search button in French by default', () => {
    renderWithProviders(<CityInput />)
    expect(screen.getByText('Scanner')).toBeInTheDocument()
  })

  it('should render search button in English when lang is en', () => {
    renderWithProviders(<CityInput />, {
      initialState: { lang: 'en' },
    })
    expect(screen.getByText('Scan')).toBeInTheDocument()
  })

  it('should update input value on change', () => {
    renderWithProviders(<CityInput />)
    const input = screen.getByPlaceholderText('// ENTRER LOCALISATION...')

    fireEvent.change(input, { target: { value: 'Paris' } })
    expect(input.value).toBe('Paris')
  })

  it('should set city in store on form submit', async () => {
    const { store } = renderWithProviders(<CityInput />)
    const input = screen.getByPlaceholderText('// ENTRER LOCALISATION...')
    const button = screen.getByRole('button', { name: /scanner/i })

    fireEvent.change(input, { target: { value: 'Lyon' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(store.getState().city).toBe('Lyon')
    })
  })

  it('should clear input after submit', async () => {
    renderWithProviders(<CityInput />)
    const input = screen.getByPlaceholderText('// ENTRER LOCALISATION...')
    const button = screen.getByRole('button', { name: /scanner/i })

    fireEvent.change(input, { target: { value: 'Nice' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })
})
