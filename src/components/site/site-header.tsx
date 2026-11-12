"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import { nav, site } from "@/data/site";
import { projectHeroTones } from "@/data/hero-tones";
import { cn } from "@/lib/utils";
import { GlassSurface } from "@/components/ui/glass-surface";
import { Signature } from "./signature";

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function isActive(pathname: string, href: string) {
  const current = normalize(pathname);
  const target = normalize(href);
  return target === "/" ? current === "/" : current === target || current.startsWith(`${target}/`);
}

type Tone = "dark" | "light";

/** Ton du hero de la page (connu dès le rendu statique, pour éviter un flash). */
function heroTone(pathname: string): Tone {
  const path = normalize(pathname);
  if (path === "/" || path === "/contact") return "dark";
  const slug = path.match(/^\/projets\/([^/]+)$/)?.[1];
  if (slug) return projectHeroTones[slug] ?? "light";
  return "light";
}

/** Nav en pilule de verre liquide qui flotte sous le haut de l'écran. */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Sous le hero (ou sans hero sombre), la nav repasse en verre clair, texte encre.
  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setPastHero(hero ? hero.getBoundingClientRect().bottom < 88 : window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Ferme le menu à chaque navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setPastHero(false);
  }

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      // Piège de focus : le bouton de fermeture et les liens du menu.
      if (event.key === "Tab" && dialogRef.current && toggleRef.current) {
        const focusables = [toggleRef.current, ...dialogRef.current.querySelectorAll<HTMLElement>("a[href]")];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const tone: Tone = open || pastHero ? "light" : heroTone(pathname);
  const dark = tone === "dark";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
      <div className="relative z-50">
        <GlassSurface
          surface={tone}
          className={cn(
            "flex h-[3.75rem] items-center gap-2 rounded-full pr-2 pl-5 shadow-[0_14px_36px_-16px_rgba(0,0,0,0.35)] transition-colors duration-500 md:gap-6 md:pr-3 md:pl-6",
            dark ? "bg-white/10 text-white" : "bg-white/75 text-foreground",
          )}
        >
          {/* Au survol, la signature passe en rose-rouge et pivote avec un petit rebond. */}
          <Link href="/" className="group flex items-center rounded-full">
            <Signature
              className={cn(
                "h-9 -rotate-3 transition-[color,rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                "group-hover:-rotate-12 group-hover:scale-110 group-hover:text-signature",
                "group-focus-visible:-rotate-12 group-focus-visible:scale-110 group-focus-visible:text-signature",
                "motion-reduce:group-hover:-rotate-3 motion-reduce:group-hover:scale-100",
                "motion-reduce:group-focus-visible:-rotate-3 motion-reduce:group-focus-visible:scale-100",
              )}
            />
            <span className="sr-only">{site.name}, accueil</span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center rounded-full px-3.5 text-sm font-medium transition-colors lg:px-4",
                        active
                          ? dark ? "text-white" : "text-foreground"
                          : dark ? "text-white/65 hover:text-white" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-signature transition duration-300 ease-apple",
                          active ? "scale-100 opacity-100" : "scale-0 opacity-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Seule mention de l'alternance hors page Contact : discrète. */}
          <Link
            href="/contact/"
            className={cn(
              "hidden items-center gap-2 rounded-full px-2 text-xs font-medium whitespace-nowrap transition-colors lg:inline-flex",
              dark ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span aria-hidden className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            {site.availability}
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="ml-auto inline-flex size-10 items-center justify-center rounded-full transition-opacity hover:opacity-70 md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </GlassSurface>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            ref={dialogRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-white px-4 pt-28 pb-8 sm:px-6 md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav aria-label="Navigation principale (mobile)">
              <ol className="flex flex-col gap-1">
                {nav.map((item, index) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <m.li
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-baseline gap-4 rounded-tile py-2"
                      >
                        <span className={cn("text-sm font-semibold tabular-nums", active ? "text-primary-ink" : "text-muted-foreground")}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={cn("text-[2.5rem] leading-tight font-bold tracking-[-0.04em]", active && "text-primary")}>
                          {item.label}
                        </span>
                      </Link>
                    </m.li>
                  );
                })}
              </ol>
            </nav>
            <div className="mt-auto space-y-2 border-t border-border pt-6 text-[0.9375rem]">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
                {site.availability}
              </p>
              <a className="block font-medium text-foreground" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a className="block text-muted-foreground" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
