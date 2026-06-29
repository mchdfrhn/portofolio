import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { haptic } from "../utils/haptic";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    haptic("medium");
    const waUrl = "https://wa.me/6288971084208?text=Halo%20Farhan%2C%20saya%20tertarik%20dengan%20layanan%20Anda";
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/30 flex items-center justify-center transition-colors group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label="Chat WhatsApp"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
          <span className="absolute right-full mr-3 px-3 py-1.5 text-xs font-medium bg-background text-foreground rounded-lg border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Chat Saya 💬
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
