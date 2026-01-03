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
