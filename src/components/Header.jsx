import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'

export default function Header() {
    const lang = useAppStore((state) => state.lang)
    const setLang = useAppStore((state) => state.setLang)

    const toggleLang = () => {
        setLang(lang === 'fr' ? 'en' : 'fr')
    }

    return (
        <header className="relative z-10 flex justify-between items-center w-full h-16 px-6 bg-black/40 backdrop-blur-md border-b border-purple-500/30 neon-border-purple">
            {/* Titre avec effet néon */}
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-cyan-400 neon-text-cyan neon-flicker">
                {lang === 'fr' ? 'Météo Cyber' : 'Cyber Weather'}
            </h1>

            {/* Toggle langue avec effet glitch */}
            <Button
                variant="outline"
                onClick={toggleLang}
                className="glitch-hover border-2 border-purple-500/60 bg-purple-900/30 hover:bg-purple-800/50 text-purple-300 hover:text-white neon-border-purple transition-all duration-300"
            >
                <span className={`transition-all ${lang === 'fr' ? 'text-cyan-400 neon-text-cyan' : 'opacity-40'}`}>
                    FR
                </span>
                <span className="mx-2 text-purple-400">/</span>
                <span className={`transition-all ${lang === 'en' ? 'text-pink-400 neon-text-pink' : 'opacity-40'}`}>
                    EN
                </span>
            </Button>
        </header>
    )
}
