import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Cloud, Database, Layout, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Lang = "en" | "id";
type IconName = "Layout" | "Cloud" | "Shield" | "Database" | "Zap";
type ThemeName = "primary" | "secondary" | "green" | "orange" | "accent";

interface ExpertiseLang {
  title: string;
  description: string;
}

export interface ExpertiseItem {
  slug: string;
  icon: string;
  colorTheme: string;
  fullWidth: boolean;
  tech: string[];
  en: ExpertiseLang;
  id: ExpertiseLang;
}

const iconMap = { Layout, Cloud, Shield, Database, Zap } as const;

const themeMap = {
  primary: {
    cardHover:
      "hover:border-primary-neon/40 hover:shadow-[0_15px_40px_-5px_rgba(56,189,248,0.25)]",
    gradient: "from-primary-neon/5",
    iconWrap:
      "bg-primary-neon/10 text-primary-neon border-primary-neon/20 group-hover:bg-primary-neon/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]",
    tag: "bg-primary-neon/10 text-primary-neon border-primary-neon/20",
  },
  secondary: {
    cardHover:
      "hover:border-secondary-neon/40 hover:shadow-[0_15px_40px_-5px_rgba(167,139,250,0.25)]",
    gradient: "from-secondary-neon/5",
    iconWrap:
      "bg-secondary-neon/10 text-secondary-neon border-secondary-neon/20 group-hover:bg-secondary-neon/20 shadow-[0_0_15px_rgba(167,139,250,0.1)]",
    tag: "bg-secondary-neon/10 text-secondary-neon border-secondary-neon/20",
  },
  green: {
    cardHover:
      "hover:border-green-400/40 hover:shadow-[0_15px_40px_-5px_rgba(74,222,128,0.2)]",
    gradient: "from-green-400/5",
    iconWrap:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 group-hover:bg-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]",
    tag: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  orange: {
    cardHover:
      "hover:border-orange-400/40 hover:shadow-[0_15px_40px_-5px_rgba(251,146,60,0.2)]",
    gradient: "from-orange-400/5",
    iconWrap:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 group-hover:bg-orange-500/20 shadow-[0_0_15px_rgba(251,146,60,0.1)]",
    tag: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  accent: {
    cardHover:
      "hover:border-accent-neon/40 hover:shadow-[0_15px_40px_-5px_rgba(255,255,255,0.05)]",
    gradient: "from-accent-neon/5",
    iconWrap:
      "bg-accent-neon/10 text-accent-neon border-accent-neon/20 group-hover:bg-accent-neon/20 shadow-[0_0_15px_rgba(156,163,175,0.1)]",
    tag: "bg-accent-neon/10 text-accent-neon border-accent-neon/20",
  },
} as const;

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 1, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const tagWrapVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.12,
    },
  },
};

const tagVariants = {
  hidden: { opacity: 1, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

export const ExpertiseGrid = ({ expertise }: { expertise: ExpertiseItem[] }) => {
  const [lang, setLang] = React.useState<Lang>("en");
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
    <motion.div
      variants={shouldReduceMotion ? undefined : gridVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {expertise.map((entry) => {
        const theme =
          themeMap[(entry.colorTheme as ThemeName) ?? "primary"] ??
          themeMap.primary;
        const IconComponent =
          iconMap[(entry.icon as IconName) ?? "Layout"] ?? Layout;
        const content = entry[lang];

        return (
          <motion.div
            key={entry.slug}
            variants={shouldReduceMotion ? undefined : cardVariants}
            whileHover={shouldReduceMotion ? undefined : { y: -6 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className={entry.fullWidth ? "md:col-span-2" : undefined}
          >
            <Card
              className={`group relative h-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_14px_36px_rgba(15,23,42,0.07)] backdrop-blur-xl transition-all duration-500 dark:bg-card/40 dark:shadow-none ${theme.cardHover}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <CardHeader className="relative z-10 p-5 pb-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 sm:gap-4">
                  <motion.div
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : { rotate: -5, scale: 1.1 }
                    }
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className={`rounded-xl border p-2.5 backdrop-blur-md transition-colors duration-500 sm:rounded-2xl sm:p-3 ${theme.iconWrap}`}
                  >
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                  <span className="font-bold tracking-wide text-foreground leading-snug">
                    {content.title}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 p-5 pt-0 text-muted-foreground sm:space-y-5 sm:p-6 sm:pt-0">
                {entry.fullWidth ? (
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="max-w-2xl text-sm leading-relaxed text-foreground/70">
                      {content.description}
                    </p>
                    <motion.div
                      variants={shouldReduceMotion ? undefined : tagWrapVariants}
                      className="flex shrink-0 flex-wrap gap-2"
                    >
                      {entry.tech.map((tag) => (
                        <motion.span
                          key={tag}
                          variants={shouldReduceMotion ? undefined : tagVariants}
                          whileHover={
                            shouldReduceMotion ? undefined : { y: -2, scale: 1.03 }
                          }
                          className={`rounded border px-2.5 py-1 text-xs font-medium ${theme.tag}`}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed text-foreground/70">
                      {content.description}
                    </p>
                    <motion.div
                      variants={shouldReduceMotion ? undefined : tagWrapVariants}
                      className="flex flex-wrap gap-2"
                    >
                      {entry.tech.map((tag) => (
                        <motion.span
                          key={tag}
                          variants={shouldReduceMotion ? undefined : tagVariants}
                          whileHover={
                            shouldReduceMotion ? undefined : { y: -2, scale: 1.03 }
                          }
                          className={`rounded border px-2.5 py-1 text-xs font-medium ${theme.tag}`}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
