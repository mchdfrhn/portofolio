import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // Initial check from document state (set by the inline script in Layout.astro)
    const root = document.documentElement;
    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = theme === "light" ? "dark" : "light";
    
    if (nextTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  // Prevent layout shift during hydration
  if (!theme) return <div className="w-10 h-10" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full hover:bg-secondary/50 flex items-center justify-center transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Moon 
          className={`absolute inset-0 transition-all duration-500 text-muted-foreground ${
            theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`} 
        />
        <Sun 
          className={`absolute inset-0 transition-all duration-500 text-yellow-500 ${
            theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
          }`} 
        />
      </div>
    </Button>
  );
};
