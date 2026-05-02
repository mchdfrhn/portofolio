import React from "react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Loader2, Send, XCircle } from "lucide-react";

type Lang = "en" | "id";
type Status = "idle" | "success" | "error";

const copy = {
  en: {
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    namePlaceholder: "Your Name",
    emailPlaceholder: "your@email.com",
    messagePlaceholder: "Tell me about your project...",
    submit: "Send Message",
    sending: "Sending...",
    success: "Message sent. I will get back to you soon.",
    error: "Unable to send your message right now. Please try again.",
  },
  id: {
    nameLabel: "Nama",
    emailLabel: "Email",
    messageLabel: "Pesan",
    namePlaceholder: "Nama Anda",
    emailPlaceholder: "email@anda.com",
    messagePlaceholder: "Ceritain proyeknya...",
    submit: "Kirim Pesan",
    sending: "Mengirim...",
    success: "Pesan terkirim. Saya akan membalas secepatnya.",
    error: "Pesan belum bisa dikirim sekarang. Coba lagi ya.",
  },
} as const;

const formVariants = {
  hidden: { opacity: 1, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 1, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const FieldShell = ({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) => {
  const [focused, setFocused] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : fieldVariants}
      className="group space-y-2 text-left"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      <motion.label
        htmlFor={htmlFor}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                color: focused ? "hsl(var(--primary-neon))" : "hsl(var(--foreground) / 0.9)",
                y: focused ? -1 : 0,
              }
        }
        className="block text-sm font-semibold leading-none text-foreground/90"
      >
        {label}
      </motion.label>
      {children}
    </motion.div>
  );
};

export const ContactForm = () => {
  const [lang, setLang] = React.useState<Lang>("en");
  const [status, setStatus] = React.useState<Status>("idle");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const text = copy[lang];

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      formRef.current?.reset();
      setStatus("success");

      if (!shouldReduceMotion) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#38BDF8", "#A78BFA", "#111827"],
        });
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      ref={formRef}
      id="contact-form"
      name="contact"
      method="POST"
      action="/api/contact"
      variants={shouldReduceMotion ? undefined : formVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-5 rounded-2xl border border-border bg-card p-5 text-left shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:space-y-6 sm:p-8 dark:bg-card/40 dark:shadow-2xl"
    >
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
        <FieldShell label={text.nameLabel} htmlFor="name">
          <input
            type="text"
            id="name"
            name="name"
            className="flex h-12 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all focus-visible:border-primary-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon dark:bg-background/50"
            placeholder={text.namePlaceholder}
            required
          />
        </FieldShell>

        <FieldShell label={text.emailLabel} htmlFor="email">
          <input
            type="email"
            id="email"
            name="email"
            className="flex h-12 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all focus-visible:border-primary-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon dark:bg-background/50"
            placeholder={text.emailPlaceholder}
            required
          />
        </FieldShell>
      </div>

      <FieldShell label={text.messageLabel} htmlFor="message">
        <textarea
          id="message"
          name="message"
          className="flex min-h-[140px] w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus-visible:border-primary-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon dark:bg-background/50"
          placeholder={text.messagePlaceholder}
          required
        />
      </FieldShell>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        variants={shouldReduceMotion ? undefined : fieldVariants}
        whileHover={shouldReduceMotion || isSubmitting ? undefined : { y: -3 }}
        whileTap={shouldReduceMotion || isSubmitting ? undefined : { scale: 0.98 }}
        className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-xl border-none bg-primary-neon px-6 text-base font-bold text-white transition-colors duration-300 hover:bg-primary-neon/90 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-neon focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 dark:text-slate-900 sm:mt-4 sm:h-14 sm:px-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isSubmitting ? (
            <motion.span
              key="sending"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="inline-flex items-center"
            >
              {text.sending}
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            </motion.span>
          ) : (
            <motion.span
              key="send"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="inline-flex items-center"
            >
              {text.submit}
              <Send className="ml-2 h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="min-h-5 text-center text-sm font-medium" aria-live="polite">
        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="inline-flex items-center justify-center text-green-600 dark:text-green-400"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {text.success}
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="inline-flex items-center justify-center text-red-600 dark:text-red-400"
            >
              <XCircle className="mr-2 h-4 w-4" />
              {text.error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
};
