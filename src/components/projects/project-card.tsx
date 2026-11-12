import Link from "next/link";

import { getSkill, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ResponsiveImage } from "@/components/site/responsive-image";

/** Carte projet : numéro, visuel, titre, nature du projet, compétences, année. */
export function ProjectCard({ project, priority, className }: { project: Project; priority?: boolean; className?: string }) {
  const cover = project.images.find((image) => image.id === project.cover);
  return (
    <Link href={`/projets/${project.slug}/`} className={cn("group block rounded-card", className)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
        <ResponsiveImage
          id={project.cover}
          alt={cover?.alt ?? project.title}
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 46vw, 92vw"
          priority={priority}
          className="size-full object-cover transition duration-700 ease-apple group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          style={{ objectPosition: project.coverPosition ?? "50% 50%" }}
        />
        <ul aria-label="Compétences" className="absolute top-4 left-4 flex flex-wrap gap-1.5 pr-4">
          {project.skills.map((slug) => (
            <li key={slug} className="rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
              {getSkill(slug)?.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 px-1">
        <p className="flex items-center justify-between text-sm font-semibold tabular-nums">
          <span className="text-primary-ink">{project.number}</span>
          <span className="font-medium text-muted-foreground">{project.year}</span>
        </p>
        <h3 className="mt-1 text-2xl font-bold tracking-[-0.03em] transition-colors group-hover:text-primary">{project.title}</h3>
        <p className="mt-1 text-[0.9375rem] leading-snug text-muted-foreground">{project.tagline}</p>
      </div>
    </Link>
  );
}
