import styled from 'styled-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity } from '../../redux/citySlice';
import { useCitySearch } from '../../hooks/useWeather';

const Container = styled.div`
    position: absolute;
    width: 70vw;
    bottom: 3%;
    left: 15vw;
    display: flex;
    justify-content: space-between;
    height: 5vh;
`;
const InputWrapper = styled.div`
    position: relative;
    width: 70%;
`;
const Input = styled.input`
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.32);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(13.8px);
    -webkit-backdrop-filter: blur(13.8px);
    border: 1px solid rgba(255, 255, 255, 0.74);
    font-size: 1.5em;
    text-transform: uppercase;
    color: #fafefe;
    padding: 0 1rem;
    box-sizing: border-box;

    &::placeholder {
        color: rgba(250, 254, 254, 0.6);
    }
`;
const Suggestions = styled.ul`
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    background: rgba(35, 51, 51, 0.95);
    border-radius: 10px;
    list-style: none;
    padding: 0;
    margin: 0 0 5px 0;
    max-height: 200px;
    overflow-y: auto;
`;
const SuggestionItem = styled.li`
    padding: 0.8rem 1rem;
    cursor: pointer;
    color: #fafefe;
    font-size: 1.1em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;
const Button = styled.button`
    background-color: #233333;
    color: #fafefe;
    border-radius: 10px;
    width: 25%;
    font-size: 1.2em;
    cursor: pointer;
    border: none;

    &:hover {
        background-color: #344444;
    }
`;

export default function CityInput() {
    const dispatch = useDispatch();
    const lang = useSelector((state) => state.lang.value);
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const { data: suggestions } = useCitySearch(inputValue);

    const selectCity = (city) => {
        dispatch(setCity(city.name));
        setInputValue('');
        setShowSuggestions(false);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setShowSuggestions(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            dispatch(setCity(inputValue.trim()));
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    return (
        <Container>
            <InputWrapper>
                <Input
                    type="text"
                    placeholder={lang === 'fr' ? 'Nom de la ville' : 'City name'}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
                />
                {showSuggestions && suggestions?.length > 0 && (
                    <Suggestions>
                        {suggestions.map((city, index) => (
                            <SuggestionItem
                                key={`${city.name}-${city.lat}-${index}`}
                                onClick={() => selectCity(city)}
                            >
                                {city.name}, {city.country}
                                {city.state && ` (${city.state})`}
                            </SuggestionItem>
                        ))}
                    </Suggestions>
                )}
            </InputWrapper>
            <Button onClick={() => {
                if (inputValue.trim()) {
                    dispatch(setCity(inputValue.trim()));
                    setInputValue('');
                    setShowSuggestions(false);
                }
            }}>
                {lang === 'fr' ? 'Rechercher' : 'Search'}
            </Button>
        </Container>
    );
}
