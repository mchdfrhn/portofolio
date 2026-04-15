import React from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Database,
  Terminal,
  LayoutTemplate,
} from "lucide-react";
import { SpotlightCard } from "./ui/spotlight-card";
import { Button } from "./ui/button";

const projects = [
  {
    title: "CampusFix",
    tagline: "University Entrepreneurship Platform",
    taglineKey: "projects.campusfix.tagline",
    description:
      "A full-stack solution for managing campus facility repairs. Streamlines ticket submission, tracking, and resolution workflows for university maintenance teams.",
    descriptionKey: "projects.campusfix.description",
    tech: ["Next.js", "PostgreSQL", "Tailwind"],
    icon: LayoutTemplate,
  },
  {
    title: "Sipekad",
    tagline: "Administrative Management System",
    taglineKey: "projects.sipekad.tagline",
    description:
      "Robust information system with complex database migrations and role-based access control. Deployed on Railway for high availability.",
    descriptionKey: "projects.sipekad.description",
    tech: ["React", "Express.js", "Railway"],
    icon: Database,
  },
  {
    title: "Algorithmic Trading Bot",
    tagline: "Financial Automation",
    taglineKey: "projects.trading.tagline",
    description:
      "Automated trading strategies handling real-time market data using Freqtrade. Implements machine learning models for trend prediction.",
    descriptionKey: "projects.trading.description",
    tech: ["Python", "Freqtrade", "ML"],
    icon: Terminal,
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none"></div>

      <div className="mb-12">
        <h2
          className="text-3xl md:text-5xl font-bold mb-6"
          data-i18n-key="projects.title"
        >
          Selected Works
        </h2>
        <div className="h-1 w-20 bg-primary-neon shadow-neon mb-6"></div>
        <p
          className="text-muted-foreground text-lg max-w-2xl"
          data-i18n-key="projects.description"
        >
          A collection of projects demonstrating expertise in full-stack
          development, system architecture, and algorithmic solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <SpotlightCard className="h-full flex flex-col justify-between group neon-card !border-white/5 hover:!border-primary-neon/50">
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="p-3 bg-primary-neon/10 rounded-lg text-primary-neon shadow-[0_0_10px_rgba(0,136,255,0.2)]">
                    {<project.icon size={24} />}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-white transition-colors"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-white transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-neon group-hover:neon-glow-blue transition-all">
                  {project.title}
                </h3>
                <p
                  className="text-sm text-primary/80 mb-4 font-mono"
                  data-i18n-key={project.taglineKey}
                >
                  {project.tagline}
                </p>
                <p
                  className="text-muted-foreground mb-6 leading-relaxed"
                  data-i18n-key={project.descriptionKey}
                >
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary/50 text-secondary-foreground border border-white/5"
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
