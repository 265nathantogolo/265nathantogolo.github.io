import { statSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download } from "lucide-react";

import { adjacentProjects, getProject, getSkill, orderedImages, projects, type ProjectDocument } from "@/data/projects";
import { asset, imageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/button";
import { GlassSurface } from "@/components/ui/glass-surface";
import { ResponsiveImage } from "@/components/site/responsive-image";
import { Reveal } from "@/components/site/reveal";
import { frenchTypo } from "@/components/site/rich-text";
import { Lightbox } from "@/components/projects/lightbox";
import { ProjectHero } from "@/components/projects/project-hero";
import { FactTiles, ProjectGallery, StoryBlock } from "@/components/projects/project-story";
import { ProjectBottomBar } from "@/components/projects/project-bottom-bar";

// Poids réel du document, lu au moment du build (comme le CV sur Contact).
function documentMeta(document: ProjectDocument) {
  try {
    const bytes = statSync(path.join(process.cwd(), "public", document.file)).size;
    const size = `${(bytes / 1024 / 1024).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo`;
    return `PDF · ${document.pages} pages · ${size}`;
  } catch {
    return `PDF · ${document.pages} pages`;
  }
}

function DocumentButton({ document, size = "lg" }: { document: ProjectDocument; size?: "lg" | "xl" }) {
  return (
    <LiquidButton asChild variant="tinted" size={size}>
      <a href={asset(document.file)} download={document.downloadName}>
        <Download />
        {document.label}
      </a>
    </LiquidButton>
  );
}

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const url = `/projets/${project.slug}/`;
  return {
    title: project.title,
    description: `${project.tagline} Projet ${project.number} du portfolio de Nathan Togolo.`,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${project.title} · Nathan Togolo`,
      description: project.tagline,
      images: [{ url: imageSrc(project.cover, 1280) }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = adjacentProjects(project.slug);
  const { rest, all } = orderedImages(project);
  const byId = new Map(project.images.map((image) => [image.id, image]));
  const { theme, document } = project;
  const docMeta = document && documentMeta(document);

  // Fiche du projet, façon étude de cas.
  const fiche = [
    project.type && { label: "Type", value: <>{project.type}</> },
    {
      label: project.skills.length > 1 ? "Expertises" : "Expertise",
      value: (
        <span className="flex flex-wrap gap-x-3 gap-y-1">
          {project.skills.map((skillSlug) => (
            <Link
              key={skillSlug}
              href={`/projets/?competence=${skillSlug}`}
              className="underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
            >
              {getSkill(skillSlug)?.label}
            </Link>
          ))}
        </span>
      ),
      wide: true,
    },
    { label: "Livrables", value: <>{project.deliverables.join(" · ")}</>, wide: true },
    { label: "Année", value: <span className="tabular-nums">{project.year}</span> },
  ].filter(Boolean) as { label: string; value: React.ReactNode; wide?: boolean }[];

  return (
    <article
      style={
        {
          "--tint": `color-mix(in srgb, ${theme.accent} 90%, transparent)`,
          "--on-tint": theme.onAccent,
          "--ink": theme.ink,
          "--project": theme.accent,
          "--on-project": theme.onAccent,
        } as React.CSSProperties
      }
    >
      <Lightbox images={all} title={project.title}>
        <ProjectHero project={project} />

        {/* Fiche en verre liquide, posée à cheval sur le bas du hero. */}
        <div className="container-page relative z-10 -mt-24 md:-mt-28">
          <GlassSurface className="rounded-card bg-white/80 px-6 py-6 md:px-10 md:py-8">
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:flex lg:justify-between">
              {fiche.map((item) => (
                <div key={item.label} className={cn(item.wide && "lg:max-w-md lg:flex-1")}>
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{item.label}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
            {document && (
              <div className="mt-6 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.9375rem]">
                  <span className="font-medium">{document.title}</span>
                  <span className="text-muted-foreground"> · {docMeta}</span>
                </p>
                <DocumentButton document={document} />
              </div>
            )}
          </GlassSurface>
        </div>

        <section aria-labelledby="a-propos-title" id="a-propos" className="container-page mt-24 md:mt-36">
          <h2 id="a-propos-title" className="sr-only">
            Le projet
          </h2>
          <div className="space-y-20 md:space-y-32">
            {project.story.map((section, index) => (
              <div key={section.text.slice(0, 32)}>
                <StoryBlock
                  section={section}
                  index={index}
                  total={project.story.length}
                  images={(section.images ?? []).map((id) => byId.get(id)!).filter(Boolean)}
                />
                {index === 0 && project.facts && (
                  <div className="mt-3 md:mt-4">
                    <FactTiles facts={project.facts} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {project.conclusion && (
            <Reveal className="mx-auto mt-28 max-w-4xl text-center md:mt-40">
              <blockquote className="serif text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.08] text-balance text-ink">
                <p>{frenchTypo(`« ${project.conclusion} »`)}</p>
              </blockquote>
            </Reveal>
          )}

          {document && (
            <Reveal className="mt-12 flex flex-col items-center gap-3 text-center md:mt-16">
              <DocumentButton document={document} size="xl" />
              <p className="text-sm text-muted-foreground">{docMeta}</p>
            </Reveal>
          )}
        </section>

        {rest.length > 0 && (
          <section aria-labelledby="visuels-title" className="container-page mt-28 md:mt-40">
            <ProjectGallery images={rest} title={project.title} />
          </section>
        )}
      </Lightbox>

      <section aria-label="Projet suivant" className="container-page mt-24 md:mt-32">
        <Link
          href={`/projets/${next.slug}/`}
          className="group relative isolate flex min-h-[20rem] flex-col items-center justify-center overflow-hidden rounded-card bg-night px-6 py-16 text-center text-white md:min-h-[28rem]"
        >
          <ResponsiveImage
            id={next.cover}
            alt=""
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="absolute inset-0 -z-10 size-full object-cover opacity-50 transition duration-700 ease-apple group-hover:scale-[1.03] group-hover:opacity-65 motion-reduce:group-hover:scale-100"
            style={{ objectPosition: next.coverPosition ?? "50% 50%" }}
          />
          <span aria-hidden className="absolute inset-0 -z-10 bg-black/35" />
          <p className="text-sm font-medium text-white/80">Projet suivant · {next.number}</p>
          <p className="display-lg mt-3 text-balance">{next.title}</p>
          <p className="serif mt-3 text-2xl text-white/85 md:text-3xl">{frenchTypo(next.accroche ?? next.tagline)}</p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
            Voir le projet
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </Link>
      </section>

      <ProjectBottomBar
        project={{ number: project.number, title: project.title }}
        previous={{ slug: previous.slug, title: previous.title }}
        next={{ slug: next.slug, title: next.title, number: next.number }}
      />
    </article>
  );
}
