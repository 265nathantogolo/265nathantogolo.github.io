"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, LayoutGrid, List } from "lucide-react";

import { getSkill, projects, skills, type Project, type SkillSlug } from "@/data/projects";
import { BASE_PATH, imageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/button";
import { ProjectCard } from "./project-card";

type Filter = SkillSlug | "tout";
type View = "grille" | "liste";

function isSkill(value: string | null): value is SkillSlug {
  return skills.some((skill) => skill.slug === value);
}

// Filtre lu dans ?competence= (liens depuis le Profil et les pages projet).
// useSyncExternalStore plutôt que useSearchParams + <Suspense> : la grille
// rendue en HTML statique n'est pas remontée à l'hydratation (meilleur LCP).
function subscribeToUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function readUrlFilter(): Filter {
  const value = new URLSearchParams(window.location.search).get("competence");
  return isSkill(value) ? value : "tout";
}

export function ProjectsExplorer() {
  const urlFilter = useSyncExternalStore(subscribeToUrl, readUrlFilter, () => "tout" as Filter);
  const [chosen, setChosen] = useState<Filter | null>(null);
  const filter = chosen ?? urlFilter;
  const [view, setView] = useState<View>("grille");
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (filter === "tout" ? projects : projects.filter((project) => project.skills.includes(filter))),
    [filter],
  );

  function choose(next: Filter) {
    setChosen(next);
    const url = next === "tout" ? `${BASE_PATH}/projets/` : `${BASE_PATH}/projets/?competence=${next}`;
    window.history.replaceState(null, "", url);
  }

  // Sans compteurs par compétence : un « 1 » isolé dessert plus qu'il n'informe.
  const options: { value: Filter; label: string }[] = [
    { value: "tout", label: "Tout" },
    ...skills.map((skill) => ({ value: skill.slug, label: skill.label })),
  ];

  return (
    <div>
      <div className="sticky top-[4.75rem] z-30 -mx-4 bg-background/95 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4 border-b border-border py-3">
          <div
            role="group"
            aria-label="Filtrer par compétence"
            className="no-scrollbar -my-3 flex min-w-0 flex-1 gap-2 overflow-x-auto py-3 pr-2"
          >
            {options.map((option) => {
              const active = filter === option.value;
              return (
                <LiquidButton
                  key={option.value}
                  size="lg"
                  aria-pressed={active}
                  onClick={() => choose(option.value)}
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "bg-foreground text-background hover:scale-100" : "text-foreground",
                  )}
                >
                  {option.label}
                </LiquidButton>
              );
            })}
          </div>

          <div role="group" aria-label="Affichage" className="hidden shrink-0 rounded-full bg-surface p-1 sm:flex">
            {(
              [
                { value: "grille", label: "Grille", Icon: LayoutGrid },
                { value: "liste", label: "Liste", Icon: List },
              ] as const
            ).map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                onClick={() => setView(value)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
                  view === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h2 className="sr-only">Liste des projets</h2>
      <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
        {visible.length} projet{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""}
        {filter !== "tout" && <> · {getSkill(filter)?.cvTitle}</>}
      </p>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-card bg-surface p-10">
          <p className="text-xl font-semibold">Aucun projet pour ce filtre.</p>
          <button type="button" onClick={() => choose("tout")} className="mt-4 text-primary-ink underline-offset-4 hover:underline">
            Tout afficher
          </button>
        </div>
      ) : view === "grille" ? (
        <m.ul className="mt-6 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, index) => (
              <m.li
                key={project.slug}

                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={project} priority={index < 3} />
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      ) : (
        <ProjectList projects={visible} />
      )}
    </div>
  );
}

/** Vue liste : lignes numérotées, aperçu de l'image qui suit le curseur (souris uniquement). */
function ProjectList({ projects: items }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const showPreview = finePointer && !reduce;

  return (
    <div
      className="relative mt-6"
      onPointerMove={(event) => {
        x.set(event.clientX + 24);
        y.set(event.clientY - 110);
      }}
      onPointerLeave={() => setHovered(null)}
    >
      <ul className="border-b border-border">
        {items.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projets/${project.slug}/`}
              onPointerEnter={() => setHovered(project)}
              onFocus={() => setHovered(null)}
              className="group grid grid-cols-[2.75rem_1fr_auto] items-center gap-x-4 border-t border-border py-5 md:grid-cols-[4rem_minmax(0,1.3fr)_minmax(0,1fr)_5rem] md:py-7"
            >
              <span className="text-sm font-semibold text-primary-ink tabular-nums">{project.number}</span>
              <span className="min-w-0">
                <span className="block text-2xl font-bold tracking-[-0.035em] transition-colors group-hover:text-primary md:text-4xl">
                  {project.title}
                </span>
                <span className="mt-1 block text-[0.9375rem] text-muted-foreground">{project.tagline}</span>
              </span>
              <span className="hidden text-sm text-muted-foreground md:block">
                {project.skills.map((slug) => getSkill(slug)?.label).join(" · ")}
              </span>
              <span className="flex items-center justify-end gap-2 text-sm text-muted-foreground tabular-nums">
                {project.year}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {showPreview && (
        <AnimatePresence>
          {hovered && (
            <m.div
              key="preview"
              aria-hidden
              className="pointer-events-none fixed top-0 left-0 z-40 aspect-[4/3] w-80 overflow-hidden rounded-tile bg-surface shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]"
              style={{ x: springX, y: springY }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc(hovered.cover, 640)}
                alt=""
                className="size-full object-cover"
                style={{ objectPosition: hovered.coverPosition ?? "50% 50%" }}
              />
            </m.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
