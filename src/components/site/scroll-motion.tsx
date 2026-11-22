"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

import { smoothFade } from "@/lib/gradients";
import { imageMeta, imageSrc, imageSrcSet } from "@/lib/images";

type ScrollRiseProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
  /** Rang dans une rangée : chaque élément démarre un peu après le précédent (effet de vague). */
  order?: number;
  /** Distance de départ sous sa place, en px. */
  distance?: number;
  /** Échelle de départ. */
  from?: number;
};

/**
 * Bloc qui monte depuis le bas et prend sa place au rythme du scroll : le
 * mouvement suit le défilement (il redescend si l'on remonte). Sans animation
 * si les animations sont réduites.
 */
export function ScrollRise({ children, className, as = "div", order = 0, distance = 110, from = 0.94 }: ScrollRiseProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // 0 quand le haut du bloc entre par le bas de l'écran, 1 quand il atteint 55 % de la hauteur.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  const start = Math.min(order * 0.09, 0.45);
  const end = Math.min(start + 0.72, 1);
  const y = useTransform(scrollYProgress, [start, end], [distance, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [from, 1]);
  const opacity = useTransform(scrollYProgress, [start, start + 0.4], [0, 1]);

  if (reduce) {
    const Tag = as;
    return (
      <Tag ref={ref as never} className={className}>
        {children}
      </Tag>
    );
  }
  const Component = as === "li" ? m.li : m.div;
  return (
    <Component ref={ref as never} className={className} style={{ y, scale, opacity }}>
      {children}
    </Component>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <m.span style={{ opacity }}>{children}</m.span>{" "}
    </>
  );
}

/**
 * Fin de l'accueil, comme sur Supaste : la photo du hero revient juste avant le
 * footer, des écrans publicitaires jusqu'à la rue (taxi jaune, passage piéton).
 * Elle sort du blanc en fondu, glisse doucement au fil du scroll et s'assombrit
 * vers le footer noir. Les fondus n'occupent qu'un tiers chacun : la photo reste
 * bien visible au milieu.
 */
export function EndBand() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const photo = imageMeta("brand/times-street");

  return (
    <div
      ref={ref}
      data-end-band=""
      aria-hidden
      className="relative mt-32 h-[clamp(28rem,92svh,60rem)] overflow-hidden md:mt-48"
    >
      <m.img
        src={imageSrc("brand/times-street", 1920)}
        srcSet={imageSrcSet("brand/times-street")}
        sizes="100vw"
        width={photo.w}
        height={photo.h}
        alt=""
        loading="lazy"
        decoding="async"
        style={reduce ? undefined : { y }}
        className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover object-[50%_58%] max-md:object-[38%_50%]"
      />
      {/* Entrée depuis le blanc de la page, puis sortie vers le footer noir : un tiers chacun. */}
      <span className="absolute inset-x-0 top-0 h-[34%]" style={{ background: smoothFade("255 255 255", "to bottom") }} />
      <span className="absolute inset-x-0 bottom-0 h-[36%]" style={{ background: smoothFade("11 11 13", "to top") }} />
    </div>
  );
}

/** Texte qui s'éclaire mot à mot au fil du scroll (citation de l'accueil). */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.45"] });
  const words = text.split(" ");

  if (reduce)
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {word}
          </Word>
        ))}
      </span>
    </p>
  );
}
