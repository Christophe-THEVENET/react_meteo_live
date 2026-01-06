import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'

export default function Header() {
  const lang = useAppStore((state) => state.lang)
  const setLang = useAppStore((state) => state.setLang)

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'en' : 'fr')
  }

  return (
    <header className="neon-border-purple relative z-10 flex h-16 w-full items-center justify-between border-b border-purple-500/30 bg-black/40 px-6 backdrop-blur-md">
      {/* Titre avec effet néon */}
      <h1 className="neon-text-cyan neon-flicker text-xl font-bold tracking-widest text-cyan-400 uppercase md:text-2xl">
        {lang === 'fr' ? 'Cyber Météo' : 'Cyber Weather'}
      </h1>

      {/* Toggle langue avec effet glitch */}
      <Button
        variant="outline"
        onClick={toggleLang}
        className="glitch-hover neon-border-purple border-2 border-purple-500/60 bg-purple-900/30 text-purple-300 transition-all duration-300 hover:bg-purple-800/50 hover:text-white"
      >
        <span
          className={`transition-all ${lang === 'fr' ? 'neon-text-cyan text-cyan-400' : 'opacity-40'}`}
        >
          FR
        </span>
        <span className="mx-2 text-purple-400">/</span>
        <span
          className={`transition-all ${lang === 'en' ? 'neon-text-pink text-pink-400' : 'opacity-40'}`}
        >
          EN
        </span>
      </Button>
    </header>
  )
}
