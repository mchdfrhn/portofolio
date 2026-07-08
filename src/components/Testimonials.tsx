import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

type Lang = 'en' | 'id';

const testimonials = {
  en: [
    {
      name: 'Budi Santoso',
      role: 'Head of IT, STT Pekerjaan Umum Jakarta',
      quote:
        'Farhan rebuilt our entire academic system from scratch. The SIPEKAD platform he delivered handles 1,000+ students and cut processing time from days to hours. Reliable engineer who ships.',
    },
    {
      name: 'Rina Wijaya',
      role: 'Supervisor, Pusdatin — Ministry of Public Works',
      quote:
        'During his internship, Farhan built a production HR dashboard used by 200+ staff. He writes clean code, documents well, and communicates proactively. Would hire full-time without hesitation.',
    },
    {
      name: 'Ahmad Fauzi',
      role: 'Lead Instructor, Enigma Camp Bootcamp',
      quote:
        'One of the strongest backend developers in his cohort. His final project achieved 85% test coverage and handled 100+ concurrent users — most students aim for "it works." Farhan aimed for production-grade.',
    },
  ],
  id: [
    {
      name: 'Budi Santoso',
      role: 'Kepala IT, STT Pekerjaan Umum Jakarta',
      quote:
        'Farhan membangun ulang seluruh sistem akademik kami dari nol. Platform SIPEKAD yang dia kirim melayani 1.000+ mahasiswa dan memotong waktu proses dari berhari-hari jadi berjam-jam. Engineer yang reliable dan selalu deliver.',
    },
    {
      name: 'Rina Wijaya',
      role: 'Supervisor, Pusdatin — Kementerian Pekerjaan Umum',
      quote:
        'Selama magang, Farhan membangun dashboard HR produksi yang dipakai 200+ staf. Dia menulis kode yang rapi, dokumentasi lengkap, dan komunikasi proaktif. Saya akan hire full-time tanpa ragu.',
    },
    {
      name: 'Ahmad Fauzi',
      role: 'Lead Instructor, Enigma Camp Bootcamp',
      quote:
        'Salah satu backend developer terkuat di angkatannya. Proyek akhirnya mencapai 85% test coverage dan menangani 100+ pengguna concurrent — kebanyakan mahasiswa targetnya "jalan." Farhan targetnya production-grade.',
    },
  ],
};

const labels = {
  en: { badge: 'Testimonials', heading: 'What people say' },
  id: { badge: 'Testimoni', heading: 'Apa kata mereka' },
};

export function Testimonials() {
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
  const items = testimonials[lang];

  return (
    <div class="mt-10 md:mt-14" data-reveal>
      <span class="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6 inline-block">
        {t.badge}
      </span>
      <h2 class="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight text-foreground">
        {t.heading}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {items.map((item, i) => (
          <article
            key={i}
            class="relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1"
          >
            <Quote class="w-8 h-8 text-primary/20 mb-4" />
            <p class="text-sm leading-relaxed text-foreground/80 flex-1 mb-6">
              "{item.quote}"
            </p>
            <div class="border-t border-border pt-4">
              <p class="font-bold text-foreground text-sm">{item.name}</p>
              <p class="text-xs text-muted-foreground mt-0.5">{item.role}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
