import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Database,
  Terminal,
  LayoutTemplate,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const iconMap = {
  Database,
  LayoutTemplate,
  Terminal,
} as const;

type IconName = keyof typeof iconMap;

interface ProjectLang {
  tagline: string;
  problem: string;
  solution: string;
  impact: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  icon: string;
  image: string | null;
  github: string;
  demo: string;
  tech: string[];
  en: ProjectLang;
  id: ProjectLang;
}

export const Projects = ({ projects }: { projects: ProjectData[] }) => {
  const [lang, setLang] = React.useState<"en" | "id">("en");
  const shouldReduceMotion = useReducedMotion();

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
    <section id="projects" className="relative pb-20 md:pb-32">
      <div className="mb-10 max-w-3xl md:mb-16">
        <div className="inline-block mb-4">
          <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {lang === "en" ? "My Work" : "Karya Saya"}
          </span>
        </div>
        <h2
          className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground tracking-tight"
          data-i18n-key="projects.title"
        >
          Selected Works
        </h2>
        <div className="mb-6 h-1.5 w-24 rounded-full bg-primary md:mb-8"></div>
        <p
          className="text-muted-foreground text-lg md:text-xl leading-relaxed"
          data-i18n-key="projects.description"
        >
          Real-world problems, solved with robust architectures. A collection of
          projects demonstrating expertise in full-stack development, system
          design, and algorithmic solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:gap-8 lg:grid-cols-3">
        {projects.map((project, index) => {
          const content = project[lang];
          const IconComponent =
            iconMap[project.icon as IconName] ?? Database;

          return (
            <motion.div
              key={project.slug}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div data-cursor="view" data-cursor-label="VIEW" className="group flex h-full flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6 lg:p-8">
                <div>
                  {project.image && (
                    <div className="relative mb-6 h-40 w-full overflow-hidden rounded-xl border border-border bg-muted/20 md:h-48 lg:mb-8">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                    </div>
                  )}

                  <div className="mb-6 mt-2 flex items-center justify-between lg:mb-8">
                    <div className="p-3.5 bg-primary/10 rounded-xl text-primary">
                      <IconComponent size={26} strokeWidth={2} />
                    </div>
                    <div className="flex gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-full border border-transparent hover:border-border"
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-full border border-transparent hover:border-border"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mb-5 text-sm font-medium tracking-wide text-accent lg:mb-6">
                    {content.tagline}
                  </p>

                  <div className="mb-6 space-y-4 lg:mb-8">
                    <div className="relative pl-6">
                      <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 absolute left-0 top-1" />
                      <span className="text-sm font-semibold text-foreground/90 block mb-1">
                        Problem
                      </span>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {content.problem}
                      </p>
                    </div>
                    <div className="relative pl-6">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 absolute left-0 top-1" />
                      <span className="text-sm font-semibold text-foreground/90 block mb-1">
                        Solution
                      </span>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {content.solution}
                      </p>
                    </div>
                    <div className="relative pl-6 bg-primary/5 p-3 rounded-lg border border-primary/10 mt-6 group-hover:bg-primary/10 transition-colors">
                      <span className="text-sm font-bold text-primary block mb-1">
                        Impact
                      </span>
                      <p className="text-foreground/80 text-sm leading-relaxed font-medium">
                        {content.impact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-5 lg:pt-6">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border cursor-default"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
