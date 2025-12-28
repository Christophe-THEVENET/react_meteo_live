import { describe, it, expect } from '@jest/globals'
import cityReducer, { setCity } from '../redux/citySlice'
import langReducer, { setLang } from '../redux/langSlice'

describe('citySlice', () => {
    it('should return initial state', () => {
        expect(cityReducer(undefined, { type: 'unknown' })).toEqual({
            value: null
        })
    })

    it('should set city', () => {
        const initialState = { value: null }
        const actual = cityReducer(initialState, setCity('Paris'))
        expect(actual.value).toBe('Paris')
    })

    it('should update city', () => {
        const initialState = { value: 'Paris' }
        const actual = cityReducer(initialState, setCity('Marseille'))
        expect(actual.value).toBe('Marseille')
    })
})

describe('langSlice', () => {
    it('should return initial state with fr', () => {
        expect(langReducer(undefined, { type: 'unknown' })).toEqual({
            value: 'fr'
        })
    })

    it('should set lang to en', () => {
        const initialState = { value: 'fr' }
        const actual = langReducer(initialState, setLang('en'))
        expect(actual.value).toBe('en')
    })

    it('should set lang to fr', () => {
        const initialState = { value: 'en' }
        const actual = langReducer(initialState, setLang('fr'))
        expect(actual.value).toBe('fr')
    })
})
