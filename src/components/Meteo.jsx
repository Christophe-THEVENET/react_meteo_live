import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useWeather, useTimeZone, useGeolocation } from '@/hooks/useWeather'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Meteo() {
    const city = useAppStore((state) => state.city)
    const lang = useAppStore((state) => state.lang)

    // Géolocalisation automatique à la première visite
    useGeolocation()

    // React Query hooks
    const {
        data: meteoData,
        isLoading: isLoadingWeather,
        error: weatherError
    } = useWeather(city, lang)

    const {
        data: timeData,
        isLoading: isLoadingTime
    } = useTimeZone(meteoData?.coord?.lat, meteoData?.coord?.lon)

    // Icône météo
    const icon = useMemo(() => {
        return meteoData ? `https://openweathermap.org/img/wn/${meteoData.weather[0].icon}@4x.png` : null
    }, [meteoData])

    // Formatage date/heure
    const { date, time } = useMemo(() => {
        if (!timeData?.formatted) return { date: '', time: '' }

        const dateObj = new Date(timeData.formatted)

        const daysFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
        const monthsFr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

        const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']

        const days = lang === 'fr' ? daysFr : daysEn
        const months = lang === 'fr' ? monthsFr : monthsEn

        const dayName = days[dateObj.getDay()]
        const day = dateObj.getDate()
        const month = months[dateObj.getMonth()]
        const hours = dateObj.getHours()
        const minutes = dateObj.getMinutes().toString().padStart(2, '0')

        let formattedTime
        if (lang === 'fr') {
            formattedTime = `${hours}h${minutes}`
        } else {
            const ampm = hours >= 12 ? 'PM' : 'AM'
            const hours12 = hours % 12 || 12
            formattedTime = `${hours12}:${minutes} ${ampm}`
        }

        return {
            date: `${dayName} ${day} ${month}`,
            time: formattedTime
        }
    }, [timeData, lang])

    // Pas de ville sélectionnée
    if (!city) {
        return (
            <Card className="w-[90%] max-w-xl bg-white/30 backdrop-blur-md border-white/50">
                <CardContent className="flex items-center justify-center py-16">
                    <p className="text-xl text-white/70 uppercase tracking-wide">
                        {lang === 'fr' ? 'Recherchez une ville...' : 'Search for a city...'}
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Chargement
    if (isLoadingWeather) {
        return (
            <Card className="w-[90%] max-w-xl bg-white/30 backdrop-blur-md border-white/50">
                <CardContent className="flex items-center justify-center py-16 gap-3">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                    <p className="text-xl text-white/70 uppercase tracking-wide">
                        {lang === 'fr' ? 'Chargement...' : 'Loading...'}
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Erreur
    if (weatherError) {
        return (
            <Card className="w-[90%] max-w-xl bg-white/30 backdrop-blur-md border-white/50">
                <CardContent className="flex items-center justify-center py-16">
                    <p className="text-xl text-red-400 uppercase tracking-wide">
                        {weatherError.response?.status === 404
                            ? (lang === 'fr' ? 'Ville non trouvée' : 'City not found')
                            : (lang === 'fr' ? 'Une erreur s\'est produite' : 'An error occurred')
                        }
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Affichage météo
    return (
        <Card className="relative w-[90%] max-w-xl bg-white/30 backdrop-blur-md border-white/50 overflow-visible">
            {/* Nom de la ville */}
            {meteoData && (
                <h1 className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl md:text-5xl font-bold text-white uppercase tracking-wider drop-shadow-lg whitespace-nowrap">
                    {meteoData.name}
                </h1>
            )}

            <CardContent className="flex flex-col items-center py-8 gap-4">
                {/* Date et heure */}
                <p className="text-lg md:text-xl text-white uppercase tracking-wide">
                    {isLoadingTime ? '...' : (
                        <>
                            <span>{date}</span>
                            <span className="mx-2">-</span>
                            <span>{time}</span>
                        </>
                    )}
                </p>

                {/* Icône météo */}
                {icon && (
                    <img
                        src={icon}
                        alt="Weather icon"
                        className="w-32 h-32 md:w-40 md:h-40 drop-shadow-lg"
                    />
                )}

                {meteoData && (
                    <>
                        {/* Température */}
                        <p className="text-5xl md:text-6xl font-light text-white">
                            {Math.round(meteoData.main.temp)}
                            <span className="text-3xl">{lang === 'fr' ? '°C' : '°F'}</span>
                        </p>

                        {/* Description */}
                        <p className="text-xl md:text-2xl text-white/90 uppercase tracking-wide">
                            {meteoData.weather[0].description}
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
