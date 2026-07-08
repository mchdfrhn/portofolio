import React from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Code2,
  Globe,
  LineChart,
  MapPin,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Lang = "en" | "id";
type InterestIcon = "Globe" | "LineChart" | "Trophy";
type InterestTheme = "primary" | "secondary" | "green";

interface AboutCopy {
  currentLabel: string;
  currentTitle: string;
  currentCompany: string;
  currentDescription: string;
  techTitle: string;
  yearsLabel: string;
}

interface InterestItem {
  icon: string;
  colorTheme: string;
  en: { label: string };
  id: { label: string };
}

interface ProfileData {
  name: string;
  profileImage: string | null;
  titleEn: string;
  titleId: string;
  location: string;
  yearsExp: string;
  availability: boolean;
  softwareHouseName: string;
  softwareHouseShortName: string;
  softwareHouseUrl: string;
}

interface Props {
  about: Record<Lang, AboutCopy>;
  profile: ProfileData;
  techStack: string[];
  interests: InterestItem[];
}

function parseCount(val: string): { num: number; suffix: string } {
  const m = val.match(/^(\d+(?:\.\d+)?)(.*)/);
  if (!m) return { num: 0, suffix: val };
  return { num: parseFloat(m[1]), suffix: m[2] };
}

const iconMap = { Globe, LineChart, Trophy } as const;

const interestThemeMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-accent/10 text-accent",
  green: "bg-green-500/10 text-green-600 dark:text-green-400",
} as const;

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const MotionCard = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : cardVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AboutBentoGrid = ({
  about,
  profile,
  techStack,
  interests,
}: Props) => {
  const [lang, setLang] = React.useState<Lang>("en");
  const shouldReduceMotion = useReducedMotion();
  const copy = about[lang];

  const yearsRef = React.useRef<HTMLDivElement>(null);
  const isYearsInView = useInView(yearsRef, { once: true, amount: 0.8 });
  const [yearsDisplay, setYearsDisplay] = React.useState(0);
  const { num: yearsTarget, suffix: yearsSuffix } = parseCount(profile.yearsExp);

  React.useEffect(() => {
    if (!isYearsInView) return;
    if (shouldReduceMotion) { setYearsDisplay(yearsTarget); return; }
    const controls = animate(0, yearsTarget, {
      duration: 1.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setYearsDisplay(Math.floor(v)),
      onComplete: () => setYearsDisplay(yearsTarget),
    });
    return () => controls.stop();
  }, [isYearsInView, yearsTarget, shouldReduceMotion]);

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
    <>
      <style>{`
        .about-bento-grid {
          grid-template-columns: minmax(0, 1fr);
          grid-template-areas:
            "profile"
            "current"
            "tech"
            "interests"
            "studio"
            "years";
          grid-auto-rows: minmax(180px, auto);
        }

        @media (min-width: 768px) {
          .about-bento-grid {
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
            grid-template-areas:
              "profile current"
              "tech tech"
              "studio interests"
              "years interests";
            grid-auto-rows: minmax(150px, auto);
          }
        }

        @media (min-width: 1024px) {
          .about-bento-grid {
            grid-template-columns: minmax(250px, 0.95fr) minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(220px, 0.85fr);
            grid-template-areas:
              "profile current current years"
              "studio tech tech interests";
            grid-auto-rows: minmax(220px, auto);
          }
        }

        .about-bento-profile { grid-area: profile; }
        .about-bento-current { grid-area: current; }
        .about-bento-tech { grid-area: tech; }
        .about-bento-interests { grid-area: interests; }
        .about-bento-studio { grid-area: studio; }
        .about-bento-years { grid-area: years; }
      `}</style>

      <motion.div
        variants={shouldReduceMotion ? undefined : gridVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        className="about-bento-grid grid gap-5 md:gap-6"
      >
      <MotionCard className="about-bento-profile min-h-[220px] md:min-h-0">
        <Card className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="relative z-10 flex h-full flex-col p-0">
            <div className="relative h-24 w-full shrink-0 overflow-hidden bg-muted/30 lg:h-24">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
            </div>
            <div className="relative flex flex-1 flex-col px-6 pb-5 pt-0">
              <div className="relative z-20 -mt-8 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted shadow-sm dark:shadow-none grayscale transition-all duration-500 hover:grayscale-0">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-extrabold text-foreground/50">
                    FA
                  </span>
                )}
              </div>
              <div className="mt-3">
                <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-foreground">
                  <span>{profile.name}</span>
                  {profile.availability && (
                    <span className="flex h-2 w-2 rounded-full bg-green-500" />
                  )}
                </h3>
                <p className="mb-3 text-sm font-medium text-primary">
                  {lang === "id" ? profile.titleId : profile.titleEn}
                </p>
                <div className="flex w-fit items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      <MotionCard className="about-bento-current min-h-[210px] md:min-h-0">
        <Card className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="relative z-10 flex h-full flex-col justify-center p-5 sm:p-6 lg:p-7">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground/80">
                {copy.currentLabel}
              </span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
              {copy.currentTitle}
            </h3>
            <p className="mb-3 font-semibold tracking-wide text-primary">
              {copy.currentCompany}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {copy.currentDescription}
            </p>
          </CardContent>
        </Card>
      </MotionCard>

      <MotionCard className="about-bento-tech min-h-[290px] md:min-h-0">
        <Card className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="relative z-10 px-5 pb-3 pt-5 sm:px-6 sm:pt-6 lg:px-7 lg:pt-6">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Code2 className="h-6 w-6 text-primary" />
              <span>{copy.techTitle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 grid grid-cols-2 gap-2.5 p-5 pt-0 sm:grid-cols-4 sm:p-6 sm:pt-0 lg:p-7 lg:pt-0">
            {techStack.map((tech) => (
              <motion.div
                key={tech}
                variants={shouldReduceMotion ? undefined : chipVariants}
                className="flex min-h-10 flex-col items-center justify-center rounded-lg border border-border bg-secondary/50 px-3 py-2 text-center text-muted-foreground transition-colors duration-300 hover:border-primary/30 hover:bg-secondary hover:text-primary"
              >
                <span className="text-xs font-semibold sm:text-sm">{tech}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </MotionCard>

      <MotionCard className="about-bento-interests min-h-[200px] md:min-h-0">
        <Card className="group h-full rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="flex h-full flex-col justify-center gap-4 p-5 sm:p-6 lg:gap-6 lg:p-7">
            {interests.map((interest) => {
              const IconComponent =
                iconMap[(interest.icon as InterestIcon) ?? "Globe"] ?? Globe;
              const iconTheme =
                interestThemeMap[
                  (interest.colorTheme as InterestTheme) ?? "primary"
                ] ?? interestThemeMap.primary;

              return (
                <motion.div
                  key={`${interest.icon}-${interest.en.label}`}
                  variants={shouldReduceMotion ? undefined : chipVariants}
                  className="flex items-center gap-3"
                >
                  <div className={`rounded-xl p-2.5 ${iconTheme}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-foreground/90">
                    {interest[lang].label}
                  </span>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </MotionCard>

      <MotionCard className="about-bento-studio min-h-[220px] md:min-h-0">
        <Card className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="relative z-10 flex h-full flex-col justify-between gap-5 p-5 sm:p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground/80">
                {profile.softwareHouseShortName}
              </span>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                <a
                  href={profile.softwareHouseUrl}
                  target={profile.softwareHouseUrl === "#" ? undefined : "_blank"}
                  rel={
                    profile.softwareHouseUrl === "#"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="transition-colors hover:text-primary"
                >
                  {profile.softwareHouseName}
                </a>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {lang === "id"
                  ? "Software house independen saya untuk membangun sistem bisnis, platform internal, workflow automation, dan aplikasi web yang siap berjalan di cloud."
                  : "My independent software studio for building reliable business systems, internal platforms, automation workflows, and cloud-ready web applications."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Web Apps", "Internal Systems", "Automation"].map((item) => (
                <motion.span
                  key={item}
                  variants={shouldReduceMotion ? undefined : chipVariants}
                  className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </CardContent>
        </Card>
      </MotionCard>

      <MotionCard className="about-bento-years min-h-[150px] md:min-h-0">
        <Card className="group relative h-full overflow-hidden rounded-2xl border border-primary/20 bg-card transition-all duration-300 hover:-translate-y-0.5 dark:bg-primary/5">
          <CardContent className="relative z-10 flex h-full flex-col justify-center p-5 text-center sm:p-6">
            <div
              ref={yearsRef}
              className="mb-3 text-5xl font-extrabold tracking-tighter text-primary"
            >
              {yearsDisplay}{yearsSuffix}
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              {copy.yearsLabel}
            </p>
          </CardContent>
        </Card>
      </MotionCard>
      </motion.div>
    </>
  );
};
