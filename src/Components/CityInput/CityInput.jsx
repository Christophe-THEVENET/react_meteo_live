import styled from 'styled-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity } from '../../redux/citySlice';

const Container = styled.div`
    position: absolute;
    width: 70vw;
    bottom: 3%;
    left: 15vw;
    display: flex;
    justify-content: space-between;
    height: 5vh;
`;
const Input = styled.input`
    width: 70%;
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

    &::placeholder {
        color: rgba(250, 254, 254, 0.6);
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

    const changeCity = () => {
        if (inputValue.trim()) {
            dispatch(setCity(inputValue.trim()));
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            changeCity();
        }
    };

    return (
        <Container>
            <Input
                type="text"
                placeholder={lang === 'fr' ? 'Nom de la ville' : 'City name'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <Button onClick={changeCity}>
                {lang === 'fr' ? 'Rechercher' : 'Search'}
            </Button>
        </Container>
    );
}
