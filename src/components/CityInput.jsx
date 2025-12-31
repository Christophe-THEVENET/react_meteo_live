import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppStore } from '@/store/useAppStore'
import { useCitySearch } from '@/hooks/useWeather'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-3"
            >
                {/* Input avec suggestions */}
                <div className="relative flex-1">
                    <Input
                        {...register('city')}
                        type="text"
                        placeholder={lang === 'fr' ? 'Nom de la ville' : 'City name'}
                        className="h-12 text-lg bg-white/30 backdrop-blur-md border-white/50 text-white placeholder:text-white/60 uppercase"
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        autoComplete="off"
                    />

                    {/* Liste des suggestions */}
                    {showSuggestions && suggestions?.length > 0 && (
                        <ul className="absolute bottom-full left-0 right-0 mb-2 bg-primary/95 backdrop-blur-md rounded-lg overflow-hidden shadow-lg z-10">
                            {suggestions.map((city, index) => (
                                <li
                                    key={`${city.name}-${city.country}-${index}`}
                                    onMouseDown={() => selectCity(city)}
                                    className="px-4 py-3 text-white cursor-pointer hover:bg-white/10 border-b border-white/10 last:border-b-0"
                                >
                                    {city.name}, {city.country}
                                    {city.state && (
                                        <span className="text-white/60 ml-1">
                                            ({city.state})
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Bouton rechercher */}
                <Button
                    type="submit"
                    className="h-12 px-6 bg-primary hover:bg-primary/80"
                >
                    <Search className="w-5 h-5 mr-2" />
                    {lang === 'fr' ? 'Rechercher' : 'Search'}
                </Button>
            </form>
        </div>
    )
}
