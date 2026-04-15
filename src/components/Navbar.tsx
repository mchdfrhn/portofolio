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
          ? "bg-background/80 backdrop-blur-md border-b border-primary-neon/20 py-4 shadow-[0_4px_20px_rgba(0,136,255,0.1)]"
          : "bg-transparent py-6",
      )}
    >
      <div className="w-full max-w-none md:max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 flex items-center justify-between">
        <motion.a
          href="#"
          onClick={(e) => handleNavClick(e, "#")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-2 text-2xl font-bold tracking-tighter"
        >
          <Code className="text-primary w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
          <div className="relative overflow-hidden">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-foreground/90 to-muted-foreground group-hover:from-primary-neon group-hover:to-blue-400 group-hover:neon-glow-blue transition-all duration-700">
              frhn
            </span>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>
          <span className="text-muted-foreground group-hover:text-primary font-mono text-sm translate-y-[1px] transition-colors duration-500">
            .dev
          </span>
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
            className="ml-2 border-primary/20 hover:bg-primary/10"
          >
            <span data-i18n-key="nav.resume">Resume</span>
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
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-foreground/80 hover:text-primary"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
              <Button className="w-full mt-4">Download CV</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
