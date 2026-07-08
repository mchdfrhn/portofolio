import { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

type Lang = 'en' | 'id';

const labels = {
  en: { title: 'GitHub Activity', subtitle: 'Open source contributions & project commits' },
  id: { title: 'Aktivitas GitHub', subtitle: 'Kontribusi open source & commit proyek' },
};

export function GithubActivity() {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem('lang');
    if (stored === 'id') setLang('id');
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === 'en' || detail === 'id') setLang(detail);
    };
    window.addEventListener('languagechange', handler);
    return () => window.removeEventListener('languagechange', handler);
  }, []);

  const t = labels[lang];

  return (
    <div class="mt-8 md:mt-10" data-reveal data-reveal-delay="0.15">
      <h3 class="text-lg font-bold text-foreground mb-1">{t.title}</h3>
      <p class="text-sm text-muted-foreground mb-4">{t.subtitle}</p>
      <div class="overflow-x-auto rounded-xl border border-border bg-card p-4 md:p-6">
        <GitHubCalendar
          username="mchdfrhn"
          colorScheme="dark"
          style={{ width: '100%' }}
          theme={{
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
          }}
          labels={{
           totalCount: lang === 'en'
              ? '{{count}} contributions in the last year'
              : '{{count}} kontribusi dalam setahun terakhir',
          }}
        />
      </div>
    </div>
  );
}
