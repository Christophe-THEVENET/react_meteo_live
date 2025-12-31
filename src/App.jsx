import Header from '@/components/Header'
import Meteo from '@/components/Meteo'
import CityInput from '@/components/CityInput'

function App() {
  return (
    <div className="min-h-screen weather-gradient">
      <Header />
      <main className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16 pb-24">
        <Meteo />
        <CityInput />
      </main>
    </div>
  )
}

export default App
