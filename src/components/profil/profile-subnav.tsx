"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "experiences", label: "Expériences" },
  { id: "histoire", label: "Mon histoire" },
  { id: "competences", label: "Compétences" },
  { id: "outils", label: "Outils & logiciels" },
  { id: "passions", label: "Passions" },
];

/** Sous-navigation fixe façon Apple (« Présentation, Caractéristiques… ») avec suivi du scroll. */
export function ProfileSubnav() {
  const [active, setActive] = useState(sections[0].id);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  // Garde l'onglet actif visible sur mobile (liste défilante).
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !link) return;
    list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Sections du profil"
      className="sticky top-[4.75rem] z-30 -mx-4 bg-background/95 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10"
    >
      <ol ref={listRef} className="no-scrollbar relative flex gap-1 overflow-x-auto border-b border-border py-2">
        {sections.map((section, index) => {
          const isActive = active === section.id;
          return (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                data-id={section.id}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
                  isActive ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground",
                )}
              >
                <span className={cn("tabular-nums text-xs", isActive ? "text-background/70" : "text-muted-foreground")}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
