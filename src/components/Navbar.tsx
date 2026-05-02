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
          ? "bg-background/60 backdrop-blur-xl border-b border-primary-neon/20 py-4 shadow-lg"
          : "bg-transparent py-6",
      )}
    >
      <div className="w-full max-w-none md:max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 flex items-center justify-between">
        <motion.a
          href="#"
          onClick={(e) => handleNavClick(e, "#")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 hover:bg-primary-neon/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]"
        >
          <span className="font-mono text-xl font-bold text-primary-neon tracking-tight drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">
            &gt;_
          </span>
          <div className="flex items-baseline">
            <span className="font-mono text-xl font-bold tracking-wide text-foreground group-hover:text-primary-neon transition-colors duration-300">
              frhn
            </span>
            <span className="font-mono text-xl font-bold tracking-wide text-primary-neon/60 group-hover:text-primary-neon transition-colors duration-300">
              .dev
            </span>
          </div>
        </motion.a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
              data-i18n-key={link.key}
            >
              {link.name}
            </a>
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
        <div className="flex items-center gap-2 md:hidden">
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
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground/80 hover:text-primary-neon"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
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
