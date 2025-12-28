import styled from 'styled-components';
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useWeather, useTimeZone, useGeolocation } from '../../hooks/useWeather'

const IconWeather = styled.img`
    width : 25%;
`
const Container = styled.div`
    color: #fefefe;
    width: 80vw;
    background: rgba(255, 255, 255, 0.32);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(13.8px);
    -webkit-backdrop-filter: blur(13.8px);
    border: 2px solid rgba(255, 255, 255, 0.74);
    border-radius: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 2rem;

`;
const DataBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Lora;
`;
const TimeBlock = styled(DataBlock)`
    height: 5%;
`;
const DataSpan = styled.span`
    font-size: 2em;
    text-transform: uppercase;
    color: #fefafa;
`;
const TempSpan = styled(DataSpan)`
    font-size: 3em;
`;
const City = styled.h1`
    font-size: 4.5em;
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    position: absolute;
    top: -23%;

`;
const LoadingSpan = styled(DataSpan)`
    font-size: 1.5em;
    opacity: 0.7;
`;
const ErrorSpan = styled(DataSpan)`
    font-size: 1.2em;
    color: #ff6b6b;
`;

export default function Meteo() {
    const city = useSelector((state) => state.city.value)
    const lang = useSelector((state) => state.lang.value)

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
    } = useTimeZone(meteoData?.coord?.lat, meteoData?.coord?.lon, lang)

    // Icône météo
    const icon = useMemo(() => {
        return meteoData ? `https://openweathermap.org/img/wn/${meteoData.weather[0].icon}@2x.png` : null
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

    // Pas de ville sélectionnée (première visite, en attente de géolocalisation)
    if (!city) {
        return (
            <Container>
                <LoadingSpan>
                    {lang === 'fr' ? 'Recherchez une ville...' : 'Search for a city...'}
                </LoadingSpan>
            </Container>
        )
    }

    // Gestion du chargement
    if (isLoadingWeather) {
        return (
            <Container>
                <LoadingSpan>
                    {lang === 'fr' ? 'Chargement...' : 'Loading...'}
                </LoadingSpan>
            </Container>
        )
    }

    // Gestion des erreurs
    if (weatherError) {
        return (
            <Container>
                <ErrorSpan>
                    {weatherError.response?.status === 404
                        ? (lang === 'fr' ? 'Ville non trouvée' : 'City not found')
                        : (lang === 'fr' ? 'Une erreur s\'est produite' : 'An error occurred')
                    }
                </ErrorSpan>
            </Container>
        )
    }

    return (
        <Container>
            {meteoData && <City>{meteoData.name}</City>}

            <TimeBlock>
                <DataSpan>
                    {isLoadingTime ? '...' : (
                        <>
                            <span>{date} </span>
                            <span> - </span>
                            <span>{time}</span>
                        </>
                    )}
                </DataSpan>
            </TimeBlock>
            {icon && <IconWeather src={icon} />}
            {meteoData &&
                <>
                <DataBlock>
                    <TempSpan>
                        {Math.round(meteoData.main.temp)}
                        {lang === 'fr' ? '°C' : '°F'}
                    </TempSpan>
                </DataBlock>
                <DataBlock>
                    <DataSpan>{meteoData.weather[0].description}</DataSpan>
                </DataBlock>
                </>
            }
        </Container>
    );
}
