import styled from 'styled-components';


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
`;
const Button = styled.button`
    background-color: #233333;
    color: #fafefe;
    border-radius: 10px;
    width: 25%;
`;
export default function CityInput() {
    return (
        <Container>
            <Input type="text" placeholder="Nom de la ville" />
            <Button onClick={changeCity}>Changer de ville</Button> 
        </Container>
    );

    function changeCity() {
        // Logic to change the city will go here
    }
}
