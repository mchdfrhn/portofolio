import React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

type ExperienceType = "work" | "education";

interface ExperienceLang {
  title: string;
  company: string;
  description: string;
}

export interface ExperienceTimelineItem {
  type: ExperienceType;
  period: string;
  en: ExperienceLang;
  id: ExperienceLang;
}

const itemVariants = {
  hidden: { opacity: 0, x: -18, y: 18 },
  visible: { opacity: 1, x: 0, y: 0 },
};

export const ExperienceTimeline = ({
  experience,
}: {
  experience: ExperienceTimelineItem[];
}) => {
  const [lang, setLang] = React.useState<"en" | "id">("en");
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 82%", "end 55%"],
  });

  const lineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });

  React.useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "id") setLang("id");

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "en" || detail === "id") setLang(detail);
    };

    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, []);

  return (
    <div
      ref={timelineRef}
      className="relative ml-4 space-y-12 md:ml-12"
      aria-label="Experience timeline"
    >
      <div className="absolute left-0 top-0 h-full w-px bg-primary-neon/10" />
      <motion.div
        className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-primary-neon via-secondary-neon to-primary-neon shadow-[0_0_18px_rgba(56,189,248,0.45)]"
        style={{ scaleY: shouldReduceMotion ? 1 : lineScale }}
      />

      {experience.map((entry, index) => {
        const isWork = entry.type === "work";
        const content = entry[lang];
        const dotClass = isWork
          ? "bg-primary-neon shadow-[0_0_16px_rgba(56,189,248,0.55)]"
          : "bg-secondary-neon shadow-[0_0_16px_rgba(167,139,250,0.55)]";
        const periodClass = isWork
          ? "text-primary-neon bg-primary-neon/10 border-primary-neon/20"
          : "text-secondary-neon bg-secondary-neon/10 border-secondary-neon/20";
        const companyClass = isWork ? "text-primary-neon" : "text-secondary-neon";

        return (
          <motion.article
            key={`${entry.period}-${entry.en.title}`}
            variants={itemVariants}
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.55,
              delay: shouldReduceMotion ? 0 : index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative pl-8 md:pl-12"
          >
            <motion.div
              className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full ring-4 ring-background ${dotClass}`}
              initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0.35 }}
              whileInView={shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.35 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
            />

            <div className="rounded-xl border border-transparent p-0 transition-colors duration-300 group-hover:border-primary-neon/10 group-hover:bg-card/20 md:p-4 md:-m-4">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <h3 className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary-neon">
                  {content.title}
                </h3>
                <motion.span
                  className={`w-fit rounded-full border px-3 py-1 font-mono text-xs shadow-[0_0_10px_rgba(56,189,248,0.1)] ${periodClass}`}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                >
                  {entry.period}
                </motion.span>
              </div>

              <div className={`mb-4 text-lg font-bold opacity-90 ${companyClass}`}>
                {content.company}
              </div>

              <p className="max-w-3xl text-muted-foreground">
                {content.description}
              </p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};
