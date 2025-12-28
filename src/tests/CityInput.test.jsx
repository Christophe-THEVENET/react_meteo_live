import { describe, it, expect, jest } from '@jest/globals'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from './testUtils'
import CityInput from '../Components/CityInput/CityInput'

// Mock useCitySearch hook
jest.mock('../hooks/useWeather', () => ({
    useCitySearch: () => ({ data: [] })
}))

describe('CityInput', () => {
    it('should render input with French placeholder by default', () => {
        renderWithProviders(<CityInput />)
        expect(screen.getByPlaceholderText('Nom de la ville')).toBeInTheDocument()
    })

    it('should render input with English placeholder when lang is en', () => {
        renderWithProviders(<CityInput />, {
            preloadedState: { lang: { value: 'en' }, city: { value: null } }
        })
        expect(screen.getByPlaceholderText('City name')).toBeInTheDocument()
    })

    it('should render search button in French by default', () => {
        renderWithProviders(<CityInput />)
        expect(screen.getByText('Rechercher')).toBeInTheDocument()
    })

    it('should render search button in English when lang is en', () => {
        renderWithProviders(<CityInput />, {
            preloadedState: { lang: { value: 'en' }, city: { value: null } }
        })
        expect(screen.getByText('Search')).toBeInTheDocument()
    })

    it('should update input value on change', () => {
        renderWithProviders(<CityInput />)
        const input = screen.getByPlaceholderText('Nom de la ville')

        fireEvent.change(input, { target: { value: 'Paris' } })
        expect(input.value).toBe('Paris')
    })

    it('should dispatch setCity on Enter key', () => {
        const { store } = renderWithProviders(<CityInput />)
        const input = screen.getByPlaceholderText('Nom de la ville')

        fireEvent.change(input, { target: { value: 'Lyon' } })
        fireEvent.keyDown(input, { key: 'Enter' })

        expect(store.getState().city.value).toBe('Lyon')
    })

    it('should dispatch setCity on button click', () => {
        const { store } = renderWithProviders(<CityInput />)
        const input = screen.getByPlaceholderText('Nom de la ville')
        const button = screen.getByText('Rechercher')

        fireEvent.change(input, { target: { value: 'Marseille' } })
        fireEvent.click(button)

        expect(store.getState().city.value).toBe('Marseille')
    })

    it('should clear input after submit', () => {
        renderWithProviders(<CityInput />)
        const input = screen.getByPlaceholderText('Nom de la ville')

        fireEvent.change(input, { target: { value: 'Nice' } })
        fireEvent.keyDown(input, { key: 'Enter' })

        expect(input.value).toBe('')
    })
})
