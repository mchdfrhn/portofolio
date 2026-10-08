import { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';

type Lang = 'en' | 'id';

const labels = {
  en: { title: 'Commit log', subtitle: 'Contributions on GitHub over the past year' },
  id: { title: 'Log commit', subtitle: 'Kontribusi di GitHub selama setahun terakhir' },
};

const readLang = (): Lang =>
  document.documentElement.classList.contains('lang-id') ? 'id' : 'en';

const readScheme = () =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

export function GithubActivity() {
  const [lang, setLang] = useState<Lang>('en');
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setLang(readLang());
    setScheme(readScheme());
    const onLang = () => setLang(readLang());
    window.addEventListener('languagechange', onLang);
    // Theme is a class on <html>; watch it so the calendar follows the toggle
    const observer = new MutationObserver(() => setScheme(readScheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('languagechange', onLang);
      observer.disconnect();
    };
  }, []);

  const t = labels[lang];

  return (
    <div className="mt-14">
      <h3 className="font-serif text-2xl">{t.title}</h3>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      <div className="overflow-x-auto border-y border-border py-5 font-mono text-xs">
        <GitHubCalendar
          username="mchdfrhn"
          colorScheme={scheme}
          blockRadius={0}
          theme={{
            light: ['#E6E1D5', '#F5C4A4', '#EE9157', '#D9631E', '#A8410C'],
            dark: ['#1F1D1A', '#5A2E15', '#934619', '#D0621F', '#FF8A47'],
          }}
          labels={{
            totalCount:
              lang === 'en'
                ? '{{count}} contributions in the last year'
                : '{{count}} kontribusi dalam setahun terakhir',
          }}
        />
      </div>
    </div>
  );
}
