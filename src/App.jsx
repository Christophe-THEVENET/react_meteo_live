import './App.css'
import Header from './Components/Header/Header.jsx'
import Meteo from './Components/Meteo/Meteo.jsx'
import CityInput from './Components/CityInput/CityInput.jsx'


function App() {

  return (
    <>
          <Header />
          <main>
              <Meteo />
              <CityInput />
          </main>
    </>
  )
}

export default App
