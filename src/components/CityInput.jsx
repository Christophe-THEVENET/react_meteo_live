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
    city: z.string().min(2, 'Minimum 2 caractères')
})

export default function CityInput() {
    const lang = useAppStore((state) => state.lang)
    const setCity = useAppStore((state) => state.setCity)
    const [showSuggestions, setShowSuggestions] = useState(false)

    // React Hook Form
    const { register, handleSubmit, watch, reset } = useForm({
        resolver: zodResolver(citySchema),
        defaultValues: { city: '' }
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-3"
            >
                {/* Input avec suggestions */}
                <div className="relative flex-1">
                    <Input
                        {...register('city')}
                        type="text"
                        placeholder={lang === 'fr' ? '// ENTRER LOCALISATION...' : '// ENTER LOCATION...'}
                        className="h-14 text-lg font-mono bg-black/60 backdrop-blur-md border-2 border-cyan-500/50 text-cyan-300 placeholder:text-cyan-700 uppercase tracking-wider neon-border-cyan focus:border-cyan-400 focus:ring-cyan-400/50"
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        autoComplete="off"
                    />

                    {/* Liste des suggestions - style terminal */}
                    {showSuggestions && suggestions?.length > 0 && (
                        <ul className="absolute bottom-full left-0 right-0 mb-2 bg-black/90 backdrop-blur-md rounded border-2 border-purple-500/50 overflow-hidden neon-border-purple">
                            <li className="px-4 py-2 text-xs text-purple-400 border-b border-purple-500/30 font-mono">
                                {`> ${suggestions.length} RÉSULTATS TROUVÉS`}
                            </li>
                            {suggestions.map((city, index) => (
                                <li
                                    key={`${city.name}-${city.country}-${index}`}
                                    onMouseDown={() => selectCity(city)}
                                    className="px-4 py-3 font-mono text-cyan-300 cursor-pointer hover:bg-purple-900/50 hover:text-pink-400 border-b border-purple-500/20 last:border-b-0 transition-all duration-150 flex items-center gap-2"
                                >
                                    <Zap className="w-4 h-4 text-purple-400" />
                                    <span>{city.name}</span>
                                    <span className="text-purple-400">_</span>
                                    <span className="text-pink-400">{city.country}</span>
                                    {city.state && (
                                        <span className="text-cyan-600 text-sm ml-auto">
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
                    className="h-14 px-6 font-mono uppercase tracking-wider bg-purple-900/60 hover:bg-purple-700/80 border-2 border-purple-500/60 text-purple-200 hover:text-white neon-border-purple transition-all duration-300 glitch-hover"
                >
                    <Search className="w-5 h-5 mr-2" />
                    <span className="hidden sm:inline">
                        {lang === 'fr' ? 'Scanner' : 'Scan'}
                    </span>
                </Button>
            </form>
        </div>
    )
}
