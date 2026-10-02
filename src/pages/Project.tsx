import { useEffect, useState, type CSSProperties } from "react";
import { categoryById } from "@/data/categories";
import { coverOf, nextProject, projectBySlug, projects } from "@/data/projects";
import { useReveals, useScrollEffects } from "@/lib/motion";
import { Link, lastWorkPath, paths } from "@/lib/router";
import { DetailCrops, ImageGallery } from "@/components/ImageGallery";
import { Lightbox } from "@/components/Lightbox";
import { FloatingNext, NextProject } from "@/components/NextProject";
import { Arrow, FitText, Img } from "@/components/primitives";
import { NotFound } from "./NotFound";

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectPage({ slug }: { slug: string }) {
  const project = projectBySlug[slug];
  const [open, setOpen] = useState<number | null>(null);
  useReveals([slug]);
  useScrollEffects([slug]);
  useEffect(() => setOpen(null), [slug]);

  if (!project) return <NotFound />;

  const cover = coverOf(project);
  const gallery = project.images.filter((im) => im !== cover);
  const openImage = (im: typeof cover) => setOpen(project.images.indexOf(im));

  return (
    <article className="project" key={slug}>
      <header className="project__head page-pad">
        <div className="project__top">
          <Link to={lastWorkPath()} className="back-link">
            <Arrow dir="left" /> Projets
          </Link>
          <p className="label">
            {project.number} / {pad(projects.length)}
          </p>
        </div>

        <h1 className="project__title" data-reveal="">
          <FitText text={project.title} disableBelow={640} />
        </h1>

        <div className="project__intro">
          <p className="project__summary" data-reveal="">
            {project.summary}
          </p>
          <dl className="project__meta" data-reveal="">
            <div className="project__meta-item">
              <dt className="label">Compétences</dt>
              <dd className="tag-list">
                {project.categories.map((c) => (
                  <Link key={c} to={paths.work(c)} className="tag">
                    {categoryById[c].label}
                  </Link>
                ))}
              </dd>
            </div>
            <div className="project__meta-item">
              <dt className="label">Livrables</dt>
              <dd>
                <ul className="project__deliverables">
                  {project.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="project__meta-item">
              <dt className="label">Visuels</dt>
              <dd className="project__count">{pad(project.images.length)}</dd>
            </div>
          </dl>
        </div>
      </header>

      <figure className="project__cover" style={{ backgroundColor: cover.color }}>
        <button
          type="button"
          className="project__cover-btn"
          onClick={() => openImage(cover)}
          data-cursor="Agrandir"
          aria-label={`Agrandir : ${cover.alt}`}
        >
          <span className="project__cover-zoom" data-zoom="">
            <Img
              image={cover}
              priority
              className="vt-hero project__cover-img"
              sizes="100vw"
              style={{ "--r": cover.ratio, "--wmax": `${Math.round(cover.width * 1.35)}px` } as CSSProperties}
            />
          </span>
        </button>
      </figure>

      <section className="project__desc page-pad" aria-label="À propos du projet">
        <p className="label" data-reveal="">
          À propos
        </p>
        <div className="prose">
          {project.description.map((text) => (
            <p key={text.slice(0, 24)} data-reveal="">
              {text}
            </p>
          ))}
        </div>
      </section>

      {gallery.length > 0 ? (
        <ImageGallery images={gallery} onOpen={openImage} />
      ) : (
        <DetailCrops image={cover} onOpen={() => openImage(cover)} />
      )}

      <NextProject project={nextProject(project)} />
      <FloatingNext project={nextProject(project)} />

      {open !== null && (
        <Lightbox
          title={project.title}
          images={project.images}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </article>
  );
}
