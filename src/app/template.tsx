"use client";

import { useEffect } from "react";
import { m, useReducedMotion } from "motion/react";

// Transition de page discrète, uniquement lors des navigations côté client :
// le premier rendu (HTML statique) reste visible sans attendre le JavaScript.
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const animateIn = hasNavigated && !reduce;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div
      initial={animateIn ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
