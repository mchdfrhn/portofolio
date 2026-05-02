import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

const navLinks = [
  { key: "nav.about", name: "About", href: "#about" },
  { key: "nav.expertise", name: "Expertise", href: "#about-description" },
  { key: "nav.projects", name: "Projects", href: "#projects" },
  { key: "nav.experience", name: "Experience", href: "#experience" },
  { key: "nav.contact", name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredMobileNav, setHoveredMobileNav] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "id">("en");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "id") setLang("id");

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "en" || detail === "id") setLang(detail);
    };
    window.addEventListener("languagechange", handler);
    return () => window.removeEventListener("languagechange", handler);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(href, { offset: -80 });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/35 backdrop-blur-xl border-b border-primary-neon/20 py-3 shadow-lg md:bg-background/60 md:py-4"
          : "bg-background/45 backdrop-blur-md border-b border-border/40 py-3.5 md:bg-transparent md:backdrop-blur-none md:border-transparent md:py-6",
      )}
    >
      <div className="w-full max-w-none md:max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 flex items-center justify-between">
        <motion.a
          href="#"
          onClick={(e) => handleNavClick(e, "#")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all duration-300 hover:bg-primary-neon/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] sm:gap-2 sm:px-3"
        >
          <span className="font-mono text-lg font-bold text-primary-neon tracking-tight drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] sm:text-xl">
            &gt;_
          </span>
          <div className="flex items-baseline">
            <span className="font-mono text-lg font-bold tracking-wide text-foreground group-hover:text-primary-neon transition-colors duration-300 sm:text-xl">
              frhn
            </span>
            <span className="font-mono text-lg font-bold tracking-wide text-primary-neon/60 group-hover:text-primary-neon transition-colors duration-300 sm:text-xl">
              .dev
            </span>
          </div>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <motion.a
              key={link.key}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              onHoverStart={() => setHoveredNav(link.key)}
              onHoverEnd={() => setHoveredNav(null)}
              onFocus={() => setHoveredNav(link.key)}
              onBlur={() => setHoveredNav(null)}
              className="relative px-1.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:text-primary"
              data-i18n-key={link.key}
            >
              {link.name}
              <AnimatePresence>
                {hoveredNav === link.key && (
                  <motion.span
                    layoutId="desktop-nav-hover-line"
                    className="absolute inset-x-1.5 bottom-0 h-px rounded-full bg-primary-neon shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                    initial={{ opacity: 0, scaleX: 0.35 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0.35 }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
              </AnimatePresence>
            </motion.a>
          ))}
          <ThemeToggle />
          <LanguageToggle />
          <Button
            variant="outline"
            className="ml-2 border-primary-neon/20 hover:bg-primary-neon/10 hover:text-primary-neon transition-colors"
            asChild
          >
            <a href={`/api/cv?lang=${lang}`} download className="flex items-center gap-2">
              <span data-i18n-key="nav.resume">Resume</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-neon/15 text-primary-neon leading-none">
                {lang.toUpperCase()}
              </span>
            </a>
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            className="text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/45 backdrop-blur-2xl border-b border-border/60 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative w-fit pb-1 text-lg font-medium text-foreground/80 transition-colors hover:text-primary-neon focus-visible:outline-none focus-visible:text-primary-neon"
                  onHoverStart={() => setHoveredMobileNav(link.key)}
                  onHoverEnd={() => setHoveredMobileNav(null)}
                  onFocus={() => setHoveredMobileNav(link.key)}
                  onBlur={() => setHoveredMobileNav(null)}
                  onClick={(e) => handleNavClick(e, link.href)}
                  data-i18n-key={link.key}
                >
                  {link.name}
                  <AnimatePresence>
                    {hoveredMobileNav === link.key && (
                      <motion.span
                        layoutId="mobile-nav-hover-line"
                        className="absolute inset-x-0 bottom-0 h-px rounded-full bg-primary-neon shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                        initial={{ opacity: 0, scaleX: 0.25 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0.25 }}
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.a>
              ))}
              <Button asChild className="w-full mt-4 bg-primary-neon hover:bg-primary-neon/90 text-white dark:text-slate-950 font-bold">
                <a href={`/api/cv?lang=${lang}`} download className="flex items-center justify-center gap-2">
                  <span>Download CV</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 leading-none">
                    {lang.toUpperCase()}
                  </span>
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
