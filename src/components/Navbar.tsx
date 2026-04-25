import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail, Code } from "lucide-react";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
          className="group flex items-center text-3xl font-bold tracking-tighter"
        >
          <Code className="text-primary-neon w-7 h-7 mr-2.5 transition-transform duration-300 group-hover:rotate-12" />
          <div className="relative overflow-hidden flex items-baseline">
            <span className="text-foreground group-hover:text-primary-neon transition-colors duration-500">
              frhn
            </span>
            <span className="text-muted-foreground group-hover:text-foreground font-mono text-xl translate-y-[1px] ml-[2px] transition-colors duration-500">
              .dev
            </span>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-neon scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
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
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              <span data-i18n-key="nav.resume">Resume</span>
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
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                  Download CV
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
