import styled from 'styled-components';
import { setLang } from '../../redux/langSlice'
import { useSelector, useDispatch } from 'react-redux'

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100vw;
    height: 10vh;
    background: rgba(255, 255, 255, 0.27);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    align-items: center;
    color: #fefafa;
`;
const Title = styled.h1`
    text-transform: uppercase;
    font-size: 1.5em;
    position: relative;
    left: 5vw;
    font-family: Cormorant Garamond;
`;
const Lang = styled.div`
    font-family: Lora;
    position: relative;
    right: 5vw;
    font-size: 1.2em;
    background-color: #233333;
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 10px;
    width: 13%;
    cursor: pointer;
`;
const LangOption = styled.span`
    opacity: ${props => props.$active ? 1 : 0.4};
    transition: opacity 0.2s ease;
`;

export default function Header() {
    const dispatch = useDispatch()
    const lang = useSelector((state) => state.lang.value)

    const toggleLang = () => {
        dispatch(setLang(lang === 'fr' ? 'en' : 'fr'))
    }

    return (
        <Container>
            <Title>
                {lang === 'fr' ? 'Application météo' : 'Weather Application'}
            </Title>
            <Lang onClick={toggleLang}>
                <LangOption $active={lang === 'fr'}>FR</LangOption>
                <span>-</span>
                <LangOption $active={lang === 'en'}>EN</LangOption>
            </Lang>
        </Container>
    );
}
