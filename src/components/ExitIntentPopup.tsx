import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Zap } from "lucide-react";
import { haptic } from "../utils/haptic";

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !sessionStorage.getItem("exit_popup_shown")) {
      setShow(true);
      sessionStorage.setItem("exit_popup_shown", "1");
    }
  }, []);

  useEffect(() => {
    if ("ontouchstart" in window) return;
    if (sessionStorage.getItem("exit_popup_shown")) return;
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  // Fallback: show after 45s
  useEffect(() => {
    if ("ontouchstart" in window) return;
    if (sessionStorage.getItem("exit_popup_shown")) return;
    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("exit_popup_shown", "1");
    }, 45000);
    return () => clearTimeout(timer);
  }, []);

  const handleCTA = () => {
    haptic("medium");
    setShow(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
          />
          <motion.div
            className="fixed z-[9991] top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="relative rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground transition-all"
                aria-label="Close"
              >
                <X size={14} />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-neon/10 border border-primary-neon/20 flex items-center justify-center mb-5">
                  <Zap size={24} className="text-primary-neon" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Tunggu Dulu! ⚡</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  Butuh bantuan <span className="text-primary-neon font-semibold">automation</span> atau <span className="text-primary-neon font-semibold">chatbot</span>? Konsultasi gratis, tanpa komitmen.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button type="button" onClick={handleCTA} className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-semibold bg-primary-neon text-background rounded-xl transition-all hover:opacity-90">
                    Ya, Diskusi <ArrowRight size={14} />
                  </button>
                  <button type="button" onClick={() => setShow(false)} className="flex-1 h-11 px-6 text-sm font-medium text-muted-foreground bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10">
                    Nanti Saja
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
