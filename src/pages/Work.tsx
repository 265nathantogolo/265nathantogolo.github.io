import { categories, categoryById, type CategoryId } from "@/data/categories";
import { projects } from "@/data/projects";
import { useReveals, useScrollEffects } from "@/lib/motion";
import { navigate, paths, type View } from "@/lib/router";
import { cn } from "@/lib/utils";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectList } from "@/components/ProjectList";
import { SplitWords } from "@/components/primitives";

const counts = Object.fromEntries(
  categories.map((c) => [c.id, projects.filter((p) => p.categories.includes(c.id)).length])
) as Record<CategoryId, number>;

const pad = (n: number) => String(n).padStart(2, "0");

export function Work({ category, view }: { category: CategoryId | null; view: View }) {
  const items = category ? projects.filter((p) => p.categories.includes(category)) : projects;
  useReveals([category, view]);
  useScrollEffects([category, view]);

  const go = (c: CategoryId | null, v: View) =>
    navigate(paths.work(c, v), { replace: true, keepScroll: true, kind: "filter" });

  return (
    <div className="work">
      <header className="work__head page-pad">
        <p className="label" data-reveal="">
          Index — {pad(items.length)} / {pad(projects.length)}
        </p>
        <h1 className="work__title">
          <SplitWords text="Projets" />
        </h1>
        <div className="work__bar">
          <p className="work__intro" data-reveal="" key={category ?? "all"}>
            {category ? (
              <>
                <strong>{categoryById[category].label}</strong> — {categoryById[category].detail}.
              </>
            ) : (
              "Dix projets, classés selon les cinq compétences de mon CV."
            )}
          </p>
          <div className="view-toggle" role="group" aria-label="Affichage des projets" data-reveal="">
            {(["grille", "liste"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                className={cn("view-toggle__btn", view === v && "is-active")}
                aria-pressed={view === v}
                onClick={() => go(category, v)}
              >
                {v === "grille" ? "Grille" : "Liste"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <p className="sr-only" aria-live="polite">
        {items.length} projet{items.length > 1 ? "s" : ""} affiché{items.length > 1 ? "s" : ""}
        {category ? ` : ${categoryById[category].label}` : ""}
      </p>

      {view === "liste" ? <ProjectList items={items} /> : <ProjectGrid items={items} />}

      <CategoryFilter value={category} onChange={(c) => go(c, view)} counts={counts} total={projects.length} />
    </div>
  );
}
