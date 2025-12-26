import styled from 'styled-components';
import { useEffect, useState, useMemo, useCallback } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { OpenWeather_API_KEY, TimeZoneDB_API_KEY } from '../../API_KEYS'

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
export default function Meteo() {

    const [meteoData, setMeteoData] = useState(false)
    const [timeData, setTimeData] = useState(false)

    const city = useSelector((state) => state.city.value)
    const lang = useSelector((state) => state.lang.value)

    const icon = useMemo(() => {
        return meteoData ? `https://openweathermap.org/img/wn/${meteoData.weather[0].icon}@2x.png` : null
    }, [meteoData])

    const getWeather = useCallback(() => {
        if (city && lang) {
            const units = lang === 'fr' ? 'metric' : 'imperial'
            const url = 'https://api.openweathermap.org/data/2.5/weather?q='
                + city + '&appid=' + OpenWeather_API_KEY + '&lang='
                + lang + '&units=' + units
            axios.get(url).then((res) => setMeteoData(res.data))
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        alert('Erreur : Ville non trouvée')
                    } else {
                        alert('Une erreur s\'est produite: ' + error.message)
                    }
                })
        }
    }, [city, lang])


    const getTimeZone = useCallback(() => {
        if (meteoData) {
            const url = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' +
                TimeZoneDB_API_KEY + '&format=json&by=position&lat=' + meteoData.coord.lat
                + '&lng=' + meteoData.coord.lon
            axios.get(url)
                .then((res) => setTimeData(res.data))
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        alert('Erreur : Donnée temporelle non trouvée !')
                    } else {
                        alert('Une erreur s\'est produite: ' + error.message)
                    }
                })
        }
    }, [meteoData])

    useEffect(() => {
        getWeather()
    }, [getWeather])

    useEffect(() => {
        getTimeZone()
    }, [getTimeZone])

    const formatDateTime = useCallback(() => {
        if (!timeData || !timeData.formatted) return { date: '', time: '' };

        const date = new Date(timeData.formatted);

        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return {
            date: `${dayName} ${day} ${month}`,
            time: `${hours}h${minutes}`
        };
    }, [timeData]);

    const { date, time } = formatDateTime();

    return (
        <Container>
            {meteoData && <City>{meteoData.name}</City>}

            <TimeBlock>
                <DataSpan >
                    <span>{date} </span>
                    <span> - </span>
                    <span>{time}</span>
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
