import { useEffect, useRef, useState } from "react";
import { coverOf, type Project } from "@/data/projects";
import { Link, paths } from "@/lib/router";
import { setSharedElement } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { Arrow, FitText, Img } from "./primitives";
import { LiquidButton } from "./ui/liquid-glass-button";

/** Bloc de fin de page : le projet suivant, en très grand. */
export function NextProject({ project }: { project: Project }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cover = coverOf(project);
  return (
    <section className="next page-pad" aria-label="Projet suivant" id="projet-suivant">
      <Link
        to={paths.project(project.slug)}
        className="next__link"
        data-cursor="Ouvrir"
        navOptions={{ kind: "project" }}
        onNavigate={() => setSharedElement(imgRef.current)}
      >
        <span className="label next__label">
          Projet suivant <span className="next__num">{project.number}</span>
        </span>
        <span className="next__title">
          <FitText text={project.title} />
        </span>
        <span className="next__media" style={{ backgroundColor: cover.color }}>
          <Img ref={imgRef} image={cover} alt="" sizes="(max-width: 899px) 80vw, 34vw" />
        </span>
      </Link>
    </section>
  );
}

/**
 * Bouton flottant en Liquid Glass : apparaît une fois la couverture passée,
 * disparaît quand le bloc « Projet suivant » entre dans l'écran.
 */
export function FloatingNext({ project }: { project: Project }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let nearEnd = false;
    let scrolled = false;
    const update = () => setVisible(scrolled && !nearEnd);
    const onScroll = () => {
      scrolled = window.scrollY > window.innerHeight * 0.8;
      update();
    };
    const end = document.getElementById("projet-suivant");
    const io = new IntersectionObserver(([entry]) => {
      nearEnd = entry.isIntersecting || entry.boundingClientRect.top < 0;
      update();
    });
    if (end) io.observe(end);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [project.slug]);

  return (
    <div className={cn("float-next", visible && "is-visible")} aria-hidden={!visible}>
      <LiquidButton asChild size="lg">
        <Link to={paths.project(project.slug)} navOptions={{ kind: "project" }} tabIndex={visible ? 0 : -1}>
          <span className="float-next__label">Suivant</span>
          <span className="float-next__title">{project.title}</span>
          <Arrow />
        </Link>
      </LiquidButton>
    </div>
  );
}
