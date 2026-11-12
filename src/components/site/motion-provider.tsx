"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("./motion-features").then((module) => module.default);

/**
 * - LazyMotion : les composants `m.*` s'affichent tout de suite, les
 *   fonctionnalités d'animation arrivent dans un fichier séparé (performance).
 * - MotionConfig : toutes les animations respectent prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
