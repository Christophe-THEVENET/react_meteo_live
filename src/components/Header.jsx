import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'

export default function Header() {
    const lang = useAppStore((state) => state.lang)
    const setLang = useAppStore((state) => state.setLang)

    const toggleLang = () => {
        setLang(lang === 'fr' ? 'en' : 'fr')
    }

    return (
        <header className="flex justify-between items-center w-full h-16 px-6 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-lg">
            {/* Titre */}
            <h1 className="text-xl md:text-2xl font-semibold uppercase tracking-wide text-white drop-shadow-md">
                {lang === 'fr' ? 'Application météo' : 'Weather Application'}
            </h1>

            {/* Toggle langue */}
            <Button
                variant="secondary"
                onClick={toggleLang}
                className="flex gap-2 bg-primary/90 hover:bg-primary text-white"
            >
                <span className={lang === 'fr' ? 'opacity-100' : 'opacity-40'}>
                    FR
                </span>
                <span className="opacity-60">-</span>
                <span className={lang === 'en' ? 'opacity-100' : 'opacity-40'}>
                    EN
                </span>
            </Button>
        </header>
    )
}
