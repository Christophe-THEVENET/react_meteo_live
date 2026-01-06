import { describe, it, expect, beforeEach } from '@jest/globals'
import { useAppStore } from '../store/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset le store avant chaque test (sans écraser les actions)
    useAppStore.setState({ city: null, lang: 'fr' })
  })

  describe('city', () => {
    it('should have null as initial city', () => {
      expect(useAppStore.getState().city).toBeNull()
    })

    it('should set city', () => {
      const { setCity } = useAppStore.getState()
      setCity('Paris')
      expect(useAppStore.getState().city).toBe('Paris')
    })

    it('should update city', () => {
      const { setCity } = useAppStore.getState()
      setCity('Paris')
      setCity('Marseille')
      expect(useAppStore.getState().city).toBe('Marseille')
    })
  })

  describe('lang', () => {
    it('should have fr as initial lang', () => {
      expect(useAppStore.getState().lang).toBe('fr')
    })

    it('should set lang to en', () => {
      const { setLang } = useAppStore.getState()
      setLang('en')
      expect(useAppStore.getState().lang).toBe('en')
    })

    it('should set lang to fr', () => {
      useAppStore.setState({ lang: 'en' })
      const { setLang } = useAppStore.getState()
      setLang('fr')
      expect(useAppStore.getState().lang).toBe('fr')
    })
  })
})
