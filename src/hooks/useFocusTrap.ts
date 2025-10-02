import { useEffect, useRef } from "react";

export function useFocusTrap<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    
    const focusable = node.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusable.length === 0) return;
      
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    
    document.addEventListener("keydown", onKey);
    const prev = document.activeElement as HTMLElement | null;
    first?.focus();
    
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, []);
  
  return ref;
}
