import React from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Database,
  Terminal,
  LayoutTemplate,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { SpotlightCard } from "./ui/spotlight-card";
import { Button } from "./ui/button";
const projects = [
  {
    title: "Sistem Kepegawaian Pusdatin",
    tagline: "Employee Management Dashboard",
    taglineKey: "projects.pegawai.tagline",
    problem: "Manual processing of massive bureaucratic employee records and hierarchy changes.",
    solution: "Engineered an automated HR dashboard handling streamlined XLSX data ingestion with granular RBAC.",
    impact: "Centralized tracking for thousands of active civil servants, cutting admin work by hours.",
    tech: ["Next.js", "PostgreSQL", "Supabase", "Tailwind"],
    icon: Database,
    image: "/images/projects/sistem-pegawai.png",
    github: import.meta.env.PUBLIC_PEGAWAI_GITHUB || "",
    demo: import.meta.env.PUBLIC_PEGAWAI_DEMO || "",
  },
  {
    title: "Sistem Jabatan Fungsional",
    tagline: "Functional Position System",
    taglineKey: "projects.jafung.tagline",
    problem: "Complex functional credit tracking causing severe assessment and promotion delays.",
    solution: "Developed an SSR Next.js application that seamlessly calculates performance credit points.",
    impact: "Boosted assessment efficiency and drastically reduced manual calculation errors.",
    tech: ["Next.js", "PostgreSQL", "Supabase"],
    icon: LayoutTemplate,
    image: "/images/projects/sistem-jafung.png",
    github: import.meta.env.PUBLIC_JAFUNG_GITHUB || "",
    demo: import.meta.env.PUBLIC_JAFUNG_DEMO || "",
  },
  {
    title: "SIPEKAD",
    tagline: "Administrative System & WA Notification",
    taglineKey: "projects.sipekad.tagline",
    problem: "Inefficient manual administrative handling and lack of instant feedback for users.",
    solution: "Built a robust information system connected to a WhatsApp gateway (Baileys) via Redis.",
    impact: "Automated 10k+ notifications and deployed high-availability microservices.",
    tech: ["React", "Express.js", "Redis", "Railway"],
    icon: Database,
    image: "/images/projects/sistem-sipekad.png",
    github: import.meta.env.PUBLIC_SIPEKAD_GITHUB || "",
    demo: import.meta.env.PUBLIC_SIPEKAD_DEMO || "",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-32 relative">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary-neon/5 blur-[150px] rounded-full -z-10 pointer-events-none"></div>

      <div className="mb-16 max-w-3xl">
        <h2
          className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground tracking-tight"
          data-i18n-key="projects.title"
        >
          Selected Works
        </h2>
        <div className="h-1.5 w-24 bg-primary-neon rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] mb-8"></div>
        <p
          className="text-muted-foreground text-lg md:text-xl leading-relaxed"
          data-i18n-key="projects.description"
        >
          Real-world problems, solved with robust architectures. A collection of projects demonstrating expertise in full-stack
          development, system design, and algorithmic solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <SpotlightCard className="h-full flex flex-col justify-between group bg-card/50 backdrop-blur-xl border border-border hover:border-primary-neon/40 hover:-translate-y-2 transition-all duration-300 rounded-xl p-8 shadow-lg hover:shadow-[0_10px_40px_-10px_rgba(56,189,248,0.2)]">
              <div>
                {/* Image Preview Block */}
                {project.image && (
                  <div className="w-full h-48 mb-8 overflow-hidden rounded-xl border border-border relative bg-muted/20">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                  </div>
                )}

                <div className="mb-8 flex items-center justify-between mt-2">
                  <div className="p-3.5 bg-primary-neon/10 rounded-xl text-primary-neon shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:scale-110 transition-transform duration-300">
                    {<project.icon size={26} strokeWidth={2} />}
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

                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary-neon transition-colors">
                  {project.title}
                </h3>
                <p
                  className="text-sm text-secondary-neon mb-6 font-medium tracking-wide"
                  data-i18n-key={project.taglineKey}
                >
                  {project.tagline}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="relative pl-6">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 absolute left-0 top-1" />
                    <span className="text-sm font-semibold text-foreground/90 block mb-1">Problem</span>
                    <p className="text-muted-foreground text-sm leading-relaxed">{project.problem}</p>
                  </div>
                  <div className="relative pl-6">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 absolute left-0 top-1" />
                    <span className="text-sm font-semibold text-foreground/90 block mb-1">Solution</span>
                    <p className="text-muted-foreground text-sm leading-relaxed">{project.solution}</p>
                  </div>
                  <div className="relative pl-6 bg-primary-neon/5 p-3 rounded-lg border border-primary-neon/10 mt-6 group-hover:bg-primary-neon/10 transition-colors">
                    <span className="text-sm font-bold text-primary-neon block mb-1">Impact</span>
                    <p className="text-foreground/80 text-sm leading-relaxed font-medium">{project.impact}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary-neon/10 text-secondary-neon border border-secondary-neon/20 hover:bg-secondary-neon/20 transition-colors cursor-default"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
