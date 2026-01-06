import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppStore } from '@/store/useAppStore'
import { useCitySearch } from '@/hooks/useWeather'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Zap } from 'lucide-react'

// Schéma Zod pour la validation
const citySchema = z.object({
  city: z.string().min(2, 'Minimum 2 caractères'),
})

export default function CityInput() {
  const lang = useAppStore((state) => state.lang)
  const setCity = useAppStore((state) => state.setCity)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // React Hook Form
  const { register, handleSubmit, watch, reset } = useForm({
    resolver: zodResolver(citySchema),
    defaultValues: { city: '' },
  })

  // Valeur actuelle de l'input (pour l'autocomplete)
  const inputValue = watch('city')

  // Hook de recherche de villes
  const { data: suggestions } = useCitySearch(inputValue || '')

  // Afficher les suggestions quand on tape (>= 2 caractères)
  useEffect(() => {
    if (inputValue?.length >= 2) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [inputValue])

  // Soumission du formulaire
  const onSubmit = (data) => {
    setCity(data.city.trim())
    reset()
    setShowSuggestions(false)
  }

  // Sélection d'une suggestion
  const selectCity = (city) => {
    setCity(city.name)
    reset()
    setShowSuggestions(false)
  }

  return (
    <div className="absolute bottom-6 left-1/2 z-10 w-[90%] max-w-2xl -translate-x-1/2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
        {/* Input avec suggestions */}
        <div className="relative flex-1">
          <Input
            {...register('city')}
            type="text"
            placeholder={
              lang === 'fr'
                ? '// ENTRER LOCALISATION...'
                : '// ENTER LOCATION...'
            }
            className="neon-border-cyan h-14 border-2 border-cyan-500/50 bg-black/60 font-mono text-lg tracking-wider text-cyan-300 uppercase backdrop-blur-md placeholder:text-cyan-700 focus:border-cyan-400 focus:ring-cyan-400/50"
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            autoComplete="off"
          />

          {/* Liste des suggestions - style terminal */}
          {showSuggestions && suggestions?.length > 0 && (
            <ul className="neon-border-purple absolute right-0 bottom-full left-0 mb-2 overflow-hidden rounded border-2 border-purple-500/50 bg-black/90 backdrop-blur-md">
              <li className="border-b border-purple-500/30 px-4 py-2 font-mono text-xs text-purple-400">
                {`> ${suggestions.length} RÉSULTATS TROUVÉS`}
              </li>
              {suggestions.map((city, index) => (
                <li
                  key={`${city.name}-${city.country}-${index}`}
                  onMouseDown={() => selectCity(city)}
                  className="flex cursor-pointer items-center gap-2 border-b border-purple-500/20 px-4 py-3 font-mono text-cyan-300 transition-all duration-150 last:border-b-0 hover:bg-purple-900/50 hover:text-pink-400"
                >
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span>{city.name}</span>
                  <span className="text-purple-400">_</span>
                  <span className="text-pink-400">{city.country}</span>
                  {city.state && (
                    <span className="ml-auto text-sm text-cyan-600">
                      [{city.state}]
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bouton rechercher - style néon */}
        <Button
          type="submit"
          className="neon-border-purple glitch-hover h-14 border-2 border-purple-500/60 bg-purple-900/60 px-6 font-mono tracking-wider text-purple-200 uppercase transition-all duration-300 hover:bg-purple-700/80 hover:text-white"
        >
          <Search className="mr-2 h-5 w-5" />
          <span className="hidden sm:inline">
            {lang === 'fr' ? 'Scanner' : 'Scan'}
          </span>
        </Button>
      </form>
    </div>
  )
}
