import styled from 'styled-components';
const Container = styled.div`
    color: #fefefe;
    width: 80vw;
    height: 50vh;
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
`;
const DataBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Lora;
`;
const TimeBlock = styled(DataBlock)`
    height: 20%;
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
    top: -30%;
    
`;
export default function Meteo() {
    return (
        <Container>
            <City>Paris</City>

            <TimeBlock>
                <DataSpan>Date & Heure</DataSpan>
            </TimeBlock>
            <DataBlock>
                <TempSpan>25 degrès</TempSpan>
            </DataBlock>
            <DataBlock>
                <DataSpan>Ensoleillé</DataSpan>
            </DataBlock>
        </Container>
    );
}
