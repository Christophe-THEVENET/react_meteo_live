import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useWeather, useTimeZone, useGeolocation } from '@/hooks/useWeather'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Wifi, WifiOff, MapPin, Thermometer, Clock } from 'lucide-react'

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
        const monthsFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

        const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        const days = lang === 'fr' ? daysFr : daysEn
        const months = lang === 'fr' ? monthsFr : monthsEn

        const dayName = days[dateObj.getDay()]
        const day = dateObj.getDate()
        const month = months[dateObj.getMonth()]
        const hours = dateObj.getHours()
        const minutes = dateObj.getMinutes().toString().padStart(2, '0')

        let formattedTime
        if (lang === 'fr') {
            formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`
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
            <Card className="relative w-[90%] max-w-xl bg-black/50 backdrop-blur-md border-2 border-purple-500/30 neon-border-purple scanlines overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                    <WifiOff className="w-16 h-16 text-purple-500/50 neon-pulse" />
                    <p className="text-lg font-mono text-purple-400 uppercase tracking-widest">
                        {lang === 'fr' ? '// EN ATTENTE DE SIGNAL...' : '// AWAITING SIGNAL...'}
                    </p>
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Chargement
    if (isLoadingWeather) {
        return (
            <Card className="relative w-[90%] max-w-xl bg-black/50 backdrop-blur-md border-2 border-cyan-500/30 neon-border-cyan scanlines overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                    <p className="text-lg font-mono text-cyan-400 uppercase tracking-widest neon-text-cyan">
                        {lang === 'fr' ? '// TÉLÉCHARGEMENT...' : '// DOWNLOADING...'}
                    </p>
                    <div className="w-48 h-1 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 animate-pulse"
                             style={{ width: '60%' }} />
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Erreur
    if (weatherError) {
        return (
            <Card className="relative w-[90%] max-w-xl bg-black/50 backdrop-blur-md border-2 border-pink-500/50 neon-border-pink scanlines overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                    <WifiOff className="w-16 h-16 text-pink-500" />
                    <p className="text-lg font-mono text-pink-400 uppercase tracking-widest neon-text-pink">
                        {weatherError.response?.status === 404
                            ? (lang === 'fr' ? '// ERREUR: CIBLE NON TROUVÉE' : '// ERROR: TARGET NOT FOUND')
                            : (lang === 'fr' ? '// ERREUR: CONNEXION ÉCHOUÉE' : '// ERROR: CONNECTION FAILED')
                        }
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Affichage météo - style cyberpunk
    return (
        <Card className="relative w-[90%] max-w-xl bg-black/50 backdrop-blur-md border-2 border-purple-500/40 neon-border-purple overflow-visible">
            {/* Nom de la ville - néon principal */}
            {meteoData && (
                <h1 className="absolute -top-14 left-1/2 -translate-x-1/2 text-4xl md:text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 neon-flicker whitespace-nowrap flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-pink-400 inline" />
                    {meteoData.name}
                </h1>
            )}

            {/* Status bar */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-purple-500/30 bg-black/30">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                    <Wifi className="w-3 h-3 text-green-400" />
                    <span>CONNECTED</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <Clock className="w-3 h-3" />
                    <span>{isLoadingTime ? '--:--' : time}</span>
                </div>
            </div>

            <CardContent className="flex flex-col items-center py-6 gap-2 scanlines">
                {/* Date */}
                <p className="text-sm font-mono text-purple-400 uppercase tracking-widest">
                    {isLoadingTime ? '// SYNC...' : `// ${date}`}
                </p>

                {/* Icône météo avec glow */}
                {icon && (
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
                        <img
                            src={icon}
                            alt="Weather icon"
                            className="relative w-32 h-32 md:w-40 md:h-40 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                        />
                    </div>
                )}

                {meteoData && (
                    <>
                        {/* Température - style digital */}
                        <div className="flex items-center gap-2">
                            <Thermometer className="w-6 h-6 text-pink-400" />
                            <p className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-500 neon-text-cyan tabular-nums">
                                {Math.round(meteoData.main.temp)}
                                <span className="text-3xl text-purple-400">{lang === 'fr' ? '°C' : '°F'}</span>
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mt-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded">
                            <p className="text-lg md:text-xl font-mono text-pink-400 uppercase tracking-wider neon-text-pink">
                                {`> ${meteoData.weather[0].description}`}
                            </p>
                        </div>

                        {/* Stats additionnelles */}
                        <div className="flex gap-6 mt-4 text-xs font-mono">
                            <div className="text-cyan-400">
                                <span className="text-purple-400">{lang === 'fr' ? 'HUM:' : 'HUM:'}</span> {meteoData.main.humidity}%
                            </div>
                            <div className="text-cyan-400">
                                <span className="text-purple-400">{lang === 'fr' ? 'VENT:' : 'WIND:'}</span> {Math.round(meteoData.wind.speed)} {lang === 'fr' ? 'm/s' : 'mph'}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
