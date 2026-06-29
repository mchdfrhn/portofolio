import { useEffect, useRef } from "react";

const visibleSections = new Map<string, number>();

function trackSection(name: string, visible: boolean) {
  const now = Date.now();
  if (visible) {
    visibleSections.set(name, now);
  } else {
    const enteredAt = visibleSections.get(name);
    if (enteredAt) {
      const duration = now - enteredAt;
      visibleSections.delete(name);
      // Replace with your analytics provider
      if (import.meta.env.DEV) {
        console.log(`[Analytics] 🚶 Leave: ${name} (${(duration / 1000).toFixed(1)}s)`);
      }
    }
  }
}

export function useSectionAnalytics(sectionName: string) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => trackSection(sectionName, entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionName]);
  return ref;
}
