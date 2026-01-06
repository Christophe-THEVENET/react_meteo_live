import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import Header from '@/components/Header'
import Meteo from '@/components/Meteo'
import CityInput from '@/components/CityInput'

function App() {
  const lang = useAppStore((state) => state.lang)

  useEffect(() => {
    document.title = lang === 'fr' ? 'Cyber Météo' : 'Cyber Weather'
  }, [lang])

  return (
    <div className="weather-gradient min-h-screen">
      <Header />
      <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center pt-16 pb-24">
        <Meteo />
        <CityInput />
      </main>
    </div>
  )
}

export default App
