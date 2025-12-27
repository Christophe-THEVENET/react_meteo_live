import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { OpenWeather_API_KEY, TimeZoneDB_API_KEY } from '../API_KEYS'

// Hook pour récupérer les données météo
export function useWeather(city, lang) {
    return useQuery({
        queryKey: ['weather', city, lang],
        queryFn: async () => {
            const units = lang === 'fr' ? 'metric' : 'imperial'
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OpenWeather_API_KEY}&lang=${lang}&units=${units}`
            const { data } = await axios.get(url)
            return data
        },
        enabled: !!city && !!lang,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1
    })
}

// Hook pour récupérer le fuseau horaire
export function useTimeZone(lat, lon) {
    return useQuery({
        queryKey: ['timezone', lat, lon],
        queryFn: async () => {
            const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${TimeZoneDB_API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`
            const { data } = await axios.get(url)
            return data
        },
        enabled: !!lat && !!lon,
        staleTime: 30 * 60 * 1000, // 30 minutes (le fuseau horaire change rarement)
        retry: 1
    })
}

// Hook pour rechercher des villes (autocomplete) avec GeoNames
export function useCitySearch(query) {
    return useQuery({
        queryKey: ['citySearch', query],
        queryFn: async () => {
            const url = `https://secure.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(query)}&featureClass=P&maxRows=10&orderby=population&username=digitob`
            const { data } = await axios.get(url)

            // Transformer les résultats GeoNames
            const cities = data.geonames?.map(item => ({
                name: item.name,
                country: item.countryCode,
                state: item.adminName1
            })) || []

            // Dédupliquer par nom + pays
            const unique = cities.filter((city, index, self) =>
                index === self.findIndex(c => c.name === city.name && c.country === city.country)
            )

            return unique.slice(0, 5)
        },
        enabled: query.length >= 2,
        staleTime: 10 * 60 * 1000,
        retry: 1
    })
}
