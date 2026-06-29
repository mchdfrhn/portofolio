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
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
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
      className="relative ml-3 space-y-10 text-foreground md:ml-12 md:space-y-12"
      aria-label="Experience timeline"
    >
      {/* Background line */}
      <div className="absolute left-0 top-0 h-full w-px bg-border" />
      {/* Animated progress line */}
      <motion.div
        className="absolute left-0 top-0 h-full w-px origin-top bg-primary"
        style={{ scaleY: shouldReduceMotion ? 1 : lineScale }}
      />

      {experience.map((entry, index) => {
        const isWork = entry.type === "work";
        const content = entry[lang];
        const dotClass = isWork
          ? "bg-primary"
          : "bg-accent";
        const periodClass = isWork
          ? "text-primary bg-primary/10 border-primary/20"
          : "text-accent bg-accent/10 border-accent/20";
        const companyClass = isWork ? "text-primary" : "text-accent";

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
            className="group relative pl-6 md:pl-12"
          >
            {/* Timeline dot */}
            <div
              className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full ring-4 ring-background ${dotClass}`}
            />

            {/* Card */}
            <div className="rounded-xl border border-transparent p-0 transition-colors duration-300 group-hover:border-border group-hover:bg-card/60 md:-m-4 md:p-4">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <h3 className="text-xl font-bold text-foreground transition-colors duration-300 sm:text-2xl">
                  {content.title}
                </h3>
                <span
                  className={`w-fit rounded-full border px-3 py-1 font-mono text-xs ${periodClass}`}
                >
                  {entry.period}
                </span>
              </div>

              <div className={`mb-3 text-base font-bold opacity-90 sm:mb-4 sm:text-lg ${companyClass}`}>
                {content.company}
              </div>

              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {content.description}
              </p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};
