import type { Project } from "@/data/projects";
import { ProjectCard, type CardSlot } from "./ProjectCard";

/** Grille éditoriale asymétrique : motif de 4 emplacements (large, étroit, étroit, large). */
const pattern: CardSlot[] = ["wide", "narrow", "narrow", "wide"];

export function ProjectGrid({ items }: { items: Project[] }) {
  return (
    <div className="pgrid page-pad">
      {items.map((p, i) => (
        <ProjectCard key={p.slug} project={p} slot={pattern[i % 4]} priority={i < 2} />
      ))}
    </div>
  );
}
