import { useState } from 'react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CvDownloadButton() {
  const [lang, setLang] = useState<'en' | 'id'>('en')

  return (
    <div className="flex items-center gap-2">
      <a
        href={`/api/cv?lang=${lang}`}
        download
        className={cn(
          'inline-flex items-center justify-center gap-2 h-[52px] px-6',
          'rounded-md border border-border text-foreground text-[15px] font-medium',
          'bg-card/50 backdrop-blur-sm shadow-sm',
          'hover:bg-secondary hover:border-primary-neon/50 hover:-translate-y-1',
          'transition-all duration-300 whitespace-nowrap'
        )}
      >
        <Download className="w-[17px] h-[17px]" />
        <span>Download CV</span>
      </a>

      <div className="flex rounded-md border border-border overflow-hidden text-xs font-semibold">
        <button
          onClick={() => setLang('en')}
          className={cn(
            'px-3 py-1.5 transition-colors',
            lang === 'en'
              ? 'bg-primary-neon/20 text-primary-neon border-r border-border'
              : 'text-muted-foreground hover:text-foreground border-r border-border'
          )}
        >
          EN
        </button>
        <button
          onClick={() => setLang('id')}
          className={cn(
            'px-3 py-1.5 transition-colors',
            lang === 'id'
              ? 'bg-primary-neon/20 text-primary-neon'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          ID
        </button>
      </div>
    </div>
  )
}
