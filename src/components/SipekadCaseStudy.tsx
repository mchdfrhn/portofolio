import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, Gauge, Zap, Shield } from 'lucide-react';

type Lang = 'en' | 'id';

const copy = {
  en: {
    badge: 'Deep Dive',
    title: 'SIPEKAD Architecture',
    subtitle: 'Interactive case study: How a Next.js + PostgreSQL system handles real campus-scale traffic.',
    beforeLabel: 'Before Optimization',
    afterLabel: 'After Optimization',
    loadLabel: 'Requests / minute',
    responseLabel: 'Avg Response',
    uptimeLabel: 'Uptime',
    bottleneckLabel: 'Bottleneck',
    before: {
      response: '~2,400ms',
      uptime: '87%',
      bottleneck: 'N+1 queries, no connection pooling, raw SQL without indexes',
    },
    after: {
      response: '~120ms',
      uptime: '99.7%',
      bottleneck: 'None — optimized with query batching, indexes, connection pool',
    },
    metrics: [
      { label: 'Database Queries', before: '47 per page', after: '3 per page' },
      { label: 'Avg Response Time', before: '2,400ms', after: '120ms' },
      { label: 'Concurrent Users', before: '~50', after: '500+' },
      { label: 'Connection Pool', before: 'None', after: 'PgBouncer' },
    ],
  },
  id: {
    badge: 'Analisis Mendalam',
    title: 'Arsitektur SIPEKAD',
    subtitle: 'Studi kasus interaktif: Bagaimana sistem Next.js + PostgreSQL menangani trafik kampus nyata.',
    beforeLabel: 'Sebelum Optimasi',
    afterLabel: 'Sesudah Optimasi',
    loadLabel: 'Request / menit',
    responseLabel: 'Rata-rata Respon',
    uptimeLabel: 'Uptime',
    bottleneckLabel: 'Bottleneck',
    before: {
      response: '~2.400ms',
      uptime: '87%',
      bottleneck: 'N+1 query, tanpa connection pooling, raw SQL tanpa index',
    },
    after: {
      response: '~120ms',
      uptime: '99,7%',
      bottleneck: 'Tidak ada — dioptimasi dengan query batching, index, connection pool',
    },
    metrics: [
      { label: 'Database Query', before: '47 per halaman', after: '3 per halaman' },
      { label: 'Rata-rata Waktu Respon', before: '2.400ms', after: '120ms' },
      { label: 'User Concurrent', before: '~50', after: '500+' },
      { label: 'Connection Pool', before: 'Tidak ada', after: 'PgBouncer' },
    ],
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SipekadCaseStudy() {
  const [lang, setLang] = useState<Lang>('en');
  const [load, setLoad] = useState(500);
  const shouldReduceMotion = useReducedMotion();
  const t = copy[lang];

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

  // Simulated response time based on load slider
  const getResponseTime = (rpm: number) => {
    // Before: exponential degradation after 500 rpm
    const before = rpm <= 50 ? 800 : rpm <= 200 ? 1200 + (rpm - 50) * 8 : 2400 + (rpm - 200) * 15;
    // After: stays flat until 400, slight increase after
    const after = rpm <= 400 ? 100 + rpm * 0.05 : 120 + (rpm - 400) * 0.2;
    return { before: Math.min(before, 15000), after: Math.min(after, 3000) };
  };

  const getUptime = (rpm: number) => {
    const before = rpm <= 100 ? 95 : rpm <= 300 ? 90 - (rpm - 100) * 0.05 : 87 - (rpm - 300) * 0.03;
    const after = rpm <= 400 ? 99.9 : 99.7 - (rpm - 400) * 0.005;
    return { before: Math.max(before, 60), after: Math.max(after, 95) };
  };

  const resp = getResponseTime(load);
  const up = getUptime(load);
  const loadPercent = (load / 10000) * 100;

  return (
    <section id="sipekad-deep-dive" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary-neon/5 blur-[150px] pointer-events-none" />

      <div className="mb-12 md:mb-16">
        <div className="inline-block mb-4">
          <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            {t.badge}
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground">{t.title}</h2>
        <div className="h-1.5 w-24 bg-primary-neon rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] mb-6" />
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">{t.subtitle}</p>
      </div>

      {/* Load Simulator */}
      <motion.div
        variants={shouldReduceMotion ? undefined : cardVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-card/40 mb-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <Gauge className="w-5 h-5 text-primary-neon" />
          <span className="text-sm font-bold text-foreground">{t.loadLabel}</span>
          <span className="ml-auto text-2xl font-extrabold text-primary-neon font-mono tabular-nums">{load.toLocaleString()}</span>
        </div>

        <input
          type="range"
          min={10}
          max={10000}
          step={10}
          value={load}
          onChange={(e) => setLoad(Number(e.target.value))}
          className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary-neon mb-8"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-bold text-red-600 dark:text-red-400">{t.beforeLabel}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4" />{t.responseLabel}</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400 font-mono">{Math.round(resp.before).toLocaleString()}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Shield className="w-4 h-4" />{t.uptimeLabel}</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400 font-mono">{up.before.toFixed(1)}%</span>
              </div>
              <div className="text-xs text-red-600/70 dark:text-red-400/70 mt-2">
                <span className="font-semibold">{t.bottleneckLabel}:</span> {t.before.bottleneck}
              </div>
            </div>
          </div>

          {/* After */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-bold text-green-600 dark:text-green-400">{t.afterLabel}</span>
              <Zap className="w-4 h-4 text-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4" />{t.responseLabel}</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">{Math.round(resp.after).toLocaleString()}ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Shield className="w-4 h-4" />{t.uptimeLabel}</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">{up.after.toFixed(1)}%</span>
              </div>
              <div className="text-xs text-green-600/70 dark:text-green-400/70 mt-2">
                <span className="font-semibold">{t.bottleneckLabel}:</span> {t.after.bottleneck}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Before/After Metrics Table */}
      <motion.div
        variants={shouldReduceMotion ? undefined : cardVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-card/40"
      >
        <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-muted-foreground mb-4 pb-3 border-b border-border">
          <span></span>
          <span className="text-red-600 dark:text-red-400">{t.beforeLabel}</span>
          <span className="text-green-600 dark:text-green-400">{t.afterLabel}</span>
        </div>
        {t.metrics.map((metric, i) => (
          <div key={i} className="grid grid-cols-3 gap-4 py-3 border-b border-border/50 last:border-0">
            <span className="text-sm font-medium text-foreground">{metric.label}</span>
            <span className="text-sm text-red-600/80 dark:text-red-400/80 font-mono">{metric.before}</span>
            <span className="text-sm text-green-600 dark:text-green-400 font-mono font-semibold">{metric.after}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
