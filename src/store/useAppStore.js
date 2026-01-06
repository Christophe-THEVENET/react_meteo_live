import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store Zustand avec persistance localStorage
 * Remplace Redux + Redux Persist
 *
 * État:
 * - city: ville sélectionnée (null par défaut)
 * - lang: langue ('fr' ou 'en')
 *
 * Utilisation:
 * const city = useAppStore((state) => state.city)
 * const setCity = useAppStore((state) => state.setCity)
 */
export const useAppStore = create(
  persist(
    (set) => ({
      // State
      city: null,
      lang: 'fr',

      // Actions
      setCity: (city) => set({ city }),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'meteo-easy', // clé localStorage (même que Redux Persist avant)
    },
  ),
)
