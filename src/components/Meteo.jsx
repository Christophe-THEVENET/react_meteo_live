import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useWeather, useTimeZone, useGeolocation } from '@/hooks/useWeather'
import { Card, CardContent } from '@/components/ui/card'
import {
  Loader2,
  Wifi,
  WifiOff,
  MapPin,
  Thermometer,
  Clock,
} from 'lucide-react'

export default function Meteo() {
  const city = useAppStore((state) => state.city)
  const lang = useAppStore((state) => state.lang)

  // Géolocalisation automatique à la première visite
  useGeolocation()

  // React Query hooks
  const {
    data: meteoData,
    isLoading: isLoadingWeather,
    error: weatherError,
  } = useWeather(city, lang)

  const { data: timeData, isLoading: isLoadingTime } = useTimeZone(
    meteoData?.coord?.lat,
    meteoData?.coord?.lon,
  )

  // Icône météo
  const icon = useMemo(() => {
    return meteoData
      ? `https://openweathermap.org/img/wn/${meteoData.weather[0].icon}@4x.png`
      : null
  }, [meteoData])

  // Formatage date/heure
  const { date, time } = useMemo(() => {
    if (!timeData?.formatted) return { date: '', time: '' }

    const dateObj = new Date(timeData.formatted)

    const daysFr = [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ]
    const monthsFr = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ]

    const daysEn = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const monthsEn = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

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
      time: formattedTime,
    }
  }, [timeData, lang])

  // Pas de ville sélectionnée
  if (!city) {
    return (
      <Card className="bg-black/50 neon-border-purple scanlines relative w-[90%] max-w-xl overflow-hidden border-2 border-purple-500/30 backdrop-blur-md">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
          <WifiOff className="neon-pulse h-16 w-16 text-purple-500/50" />
          <p className="font-mono text-lg tracking-widest text-purple-400 uppercase">
            {lang === 'fr'
              ? '// EN ATTENTE DE SIGNAL...'
              : '// AWAITING SIGNAL...'}
          </p>
          <div className="flex gap-1">
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-purple-500"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-cyan-500"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-pink-500"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Chargement
  if (isLoadingWeather) {
    return (
      <Card className="neon-border-cyan scanlines relative w-[90%] max-w-xl overflow-hidden border-2 border-cyan-500/30 bg-black/50 backdrop-blur-md">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
          <Loader2 className="h-16 w-16 animate-spin text-cyan-400" />
          <p className="neon-text-cyan font-mono text-lg tracking-widest text-cyan-400 uppercase">
            {lang === 'fr' ? '// TÉLÉCHARGEMENT...' : '// DOWNLOADING...'}
          </p>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-black/50">
            <div
              className="h-full animate-pulse bg-linear-to-r from-purple-500 via-cyan-500 to-pink-500"
              style={{ width: '60%' }}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Erreur
  if (weatherError) {
    return (
      <Card className="neon-border-pink scanlines relative w-[90%] max-w-xl overflow-hidden border-2 border-pink-500/50 bg-black/50 backdrop-blur-md">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
          <WifiOff className="h-16 w-16 text-pink-500" />
          <p className="neon-text-pink font-mono text-lg tracking-widest text-pink-400 uppercase">
            {weatherError.response?.status === 404
              ? lang === 'fr'
                ? '// ERREUR: CIBLE NON TROUVÉE'
                : '// ERROR: TARGET NOT FOUND'
              : lang === 'fr'
                ? '// ERREUR: CONNEXION ÉCHOUÉE'
                : '// ERROR: CONNECTION FAILED'}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Affichage météo - style cyberpunk
  return (
    <Card className="neon-border-purple relative w-[90%] max-w-xl overflow-visible border-2 border-purple-500/40 bg-black/50 backdrop-blur-md">
      {/* Nom de la ville - néon principal */}
      {meteoData && (
        <h1 className="neon-flicker absolute -top-18 left-1/2 flex -translate-x-1/2 items-center gap-3 bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-black tracking-widest whitespace-nowrap text-transparent uppercase md:text-5xl">
          <MapPin className="inline h-8 w-8 text-pink-400" />
          {meteoData.name}
        </h1>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between border-b border-purple-500/30 bg-black/30 px-4 py-2">
        <div className="flex items-center gap-2 font-mono text-xs text-purple-400">
          <Wifi className="h-3 w-3 text-green-400" />
          <span>CONNECTED</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
          <Clock className="h-3 w-3" />
          <span>{isLoadingTime ? '--:--' : time}</span>
        </div>
      </div>

      <CardContent className="scanlines flex flex-col items-center gap-2 py-6">
        {/* Date */}
        <p className="font-mono text-lg tracking-widest text-purple-400 uppercase">
          {isLoadingTime ? '// SYNC...' : `// ${date}`}
        </p>

        {/* Icône météo avec glow */}
        {icon && (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl" />
            <img
              src={icon}
              alt="Weather icon"
              className="relative h-32 w-32 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] md:h-40 md:w-40"
            />
          </div>
        )}

        {meteoData && (
          <>
            {/* Température - style digital */}
            <div className="flex items-center gap-2">
              <Thermometer className="h-6 w-6 text-pink-400" />
              <p className="neon-text-cyan bg-linear-to-b from-cyan-300 to-cyan-500 bg-clip-text text-6xl font-black text-transparent tabular-nums md:text-7xl">
                {Math.round(meteoData.main.temp)}
                <span className="text-3xl text-purple-400">
                  {lang === 'fr' ? '°C' : '°F'}
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="mt-2 rounded border border-purple-500/30 bg-purple-900/30 px-4 py-2">
              <p className="neon-text-pink font-mono text-lg tracking-wider text-pink-400 uppercase md:text-xl">
                {`> ${meteoData.weather[0].description}`}
              </p>
            </div>

            {/* Stats additionnelles */}
            <div className="mt-4 flex gap-6 font-mono text-xs">
              <div className="text-cyan-400">
                <span className="text-purple-400">
                  {lang === 'fr' ? 'HUM:' : 'HUM:'}
                </span>{' '}
                {meteoData.main.humidity}%
              </div>
              <div className="text-cyan-400">
                <span className="text-purple-400">
                  {lang === 'fr' ? 'VENT:' : 'WIND:'}
                </span>{' '}
                {Math.round(meteoData.wind.speed)}{' '}
                {lang === 'fr' ? 'm/s' : 'mph'}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
