"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  useMotionValue,
  animate,
  m,
  useReducedMotion,
  useScroll,
  useVelocity,
  useSpring,
  useAnimationFrame,
  useTransform,
} from "motion/react";
import useMeasure from "react-use-measure";

// Annexe C. Adaptations (§ 8) :
// 1. Le bandeau ralentit au survol (duration 40 → 120).
// 2. Logos en h-10 / md:h-12 au lieu de h-4 / md:h-5.
// 3. Niveaux de gris au repos, couleur au survol ; plus de pointer-events-none.
// 4. useReducedMotion() : grille statique si les animations sont réduites.
// 5. Plus de [...logos, ...logos] : InfiniteSlider duplique déjà ses enfants.
// 6. `controls` typé (TypeScript strict).
// 7. width/height réels ou omis (plus de "auto").
// + `dark:brightness-0 dark:invert` retiré : les logos du CV sont des icônes
//   carrées en couleur, le filtre les transformerait en carrés blancs.
// + Un logo sans `src` est composé en typographie (client sans fichier de logo).
// + Hauteur selon la forme du logo, pour un poids visuel homogène : icône
//   carrée du CV (arrondie), symbole compact, logotype horizontal.
// + Variante « pastilles » (accueil, façon Supaste) : chaque logo dans un
//   cercle gris.
// + `boostOnScroll` : le bandeau accélère tant qu'on fait défiler la page
//   (vitesse du scroll ajoutée à son propre défilement).

export type Logo = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  kind?: "app" | "mark" | "wordmark";
};

const logoSize: Record<NonNullable<Logo["kind"]>, string> = {
  app: "h-10 md:h-12 rounded-[0.6rem] md:rounded-[0.75rem]",
  mark: "h-11 md:h-14",
  wordmark: "h-8 md:h-10",
};

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  boostOnScroll?: boolean;
  className?: string;
};

/** Ramène `v` dans l'intervalle [min, max[ (boucle du bandeau). */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return range ? ((((v - min) % range) + range) % range) + min : v;
};

const InfiniteSlider = memo(function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  boostOnScroll = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  // Accélération au scroll : la vitesse de défilement (lissée) s'ajoute au
  // décalage, toujours dans le sens du bandeau, puis on reboucle la position.
  const half = useRef(0);
  useEffect(() => {
    half.current = ((direction === "horizontal" ? width : height) + gap) / 2;
  }, [direction, width, height, gap]);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    if (!boostOnScroll) return;
    const push = Math.min(Math.abs(velocity.get()), 4000) * 0.1 * (delta / 1000);
    boost.set(boost.get() + (reverse ? push : -push));
  });
  const position = useTransform(() =>
    boostOnScroll ? wrap(-half.current, 0, translation.get() + boost.get()) : translation.get(),
  );

  useEffect(() => {
    const size = direction === "horizontal" ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    let controls: ReturnType<typeof animate> | undefined;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration:
          currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prev) => prev + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => translation.set(from),
      });
    }

    return controls?.stop;
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <m.div
        ref={ref}
        className="flex w-max items-center"
        style={{
          ...(direction === "horizontal"
            ? { x: position }
            : { y: position }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        {...hoverProps}
      >
        {children}
        {/* Copie décorative pour la boucle : masquée aux lecteurs d'écran. */}
        <div aria-hidden className="contents">
          {children}
        </div>
      </m.div>
    </div>
  );
});

const badgeLogoSize: Record<NonNullable<Logo["kind"]>, string> = {
  app: "size-[46%] rounded-[0.55rem]",
  mark: "max-h-[46%] max-w-[56%]",
  wordmark: "max-h-[30%] max-w-[64%]",
};

const LogoImage = memo(function LogoImage({ logo, badge = false }: { logo: Logo; badge?: boolean }) {
  if (badge && logo.src) {
    return (
      <span className="group/badge grid size-24 shrink-0 place-items-center rounded-full bg-surface md:size-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={logo.alt}
          src={logo.src}
          width={logo.width}
          height={logo.height}
          loading="lazy"
          decoding="async"
          className={cn(
            "h-auto w-auto select-none object-contain grayscale opacity-75 transition group-hover/badge:grayscale-0 group-hover/badge:opacity-100",
            badgeLogoSize[logo.kind ?? "app"],
          )}
        />
      </span>
    );
  }
  if (!logo.src) {
    return (
      <span className="shrink-0 select-none whitespace-nowrap text-xl font-semibold tracking-[-0.03em] text-foreground opacity-65 transition hover:opacity-100 md:text-2xl">
        {logo.alt}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={logo.alt}
      src={logo.src}
      width={logo.width}
      height={logo.height}
      loading="lazy"
      decoding="async"
      className={cn(
        "w-auto shrink-0 select-none grayscale opacity-70 transition hover:grayscale-0 hover:opacity-100",
        logoSize[logo.kind ?? "app"],
      )}
    />
  );
});

export const LogoMarquee = memo(function LogoMarquee({
  logos,
  className,
  badges = false,
}: {
  logos: Logo[];
  className?: string;
  badges?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <ul className={cn("flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-4", badges && "gap-x-3 gap-y-3", className)}>
        {logos.map((logo) => (
          <li key={logo.alt}>
            <LogoImage logo={logo} badge={badges} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden py-4 mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <InfiniteSlider gap={badges ? 14 : 56} reverse duration={badges ? 50 : 40} durationOnHover={120} boostOnScroll={badges}>
        {logos.map((logo) => (
          <LogoImage key={logo.alt} logo={logo} badge={badges} />
        ))}
      </InfiniteSlider>
    </div>
  );
});

LogoMarquee.displayName = "LogoMarquee";
export default LogoMarquee;
