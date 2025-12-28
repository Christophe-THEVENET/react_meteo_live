import { describe, it, expect } from '@jest/globals'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from './testUtils'
import Header from '../Components/Header/Header'

describe('Header', () => {
    it('should render with French title by default', () => {
        renderWithProviders(<Header />)
        expect(screen.getByText('Application météo')).toBeInTheDocument()
    })

    it('should render with English title when lang is en', () => {
        renderWithProviders(<Header />, {
            preloadedState: { lang: { value: 'en' }, city: { value: null } }
        })
        expect(screen.getByText('Weather Application')).toBeInTheDocument()
    })

    it('should display FR and EN options', () => {
        renderWithProviders(<Header />)
        expect(screen.getByText('FR')).toBeInTheDocument()
        expect(screen.getByText('EN')).toBeInTheDocument()
    })

    it('should toggle language when clicked', () => {
        const { store } = renderWithProviders(<Header />)

        // Initial state is 'fr'
        expect(store.getState().lang.value).toBe('fr')

        // Click on lang toggle
        fireEvent.click(screen.getByText('FR').parentElement)

        // Should now be 'en'
        expect(store.getState().lang.value).toBe('en')
    })
})
