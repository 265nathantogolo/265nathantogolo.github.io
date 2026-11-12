import Link from "next/link";

import { projects, type Project } from "@/data/projects";
import { imageMeta } from "@/lib/images";
import { cn } from "@/lib/utils";
import { ResponsiveImage } from "@/components/site/responsive-image";
import { frenchTypo } from "@/components/site/rich-text";

/** Visuels du hero « vitrine » : un seul, ou trois en éventail. */
function Showcase({ images }: { images: string[] }) {
  if (images.length === 1) {
    const { w, h } = imageMeta(images[0]);
    const landscape = w > h;
    return (
      <ResponsiveImage
        id={images[0]}
        alt=""
        priority
        sizes={landscape ? "(min-width: 1024px) 40rem, 92vw" : "(min-width: 1024px) 28rem, 70vw"}
        className={cn(
          "rounded-tile shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] md:rounded-[1.375rem]",
          landscape ? "h-auto w-full max-w-[40rem]" : "h-auto max-h-[64svh] w-auto max-w-full",
        )}
      />
    );
  }

  // Trois visuels verticaux : celui du centre devant, les autres inclinés derrière.
  const [center, left, right] = images;
  const side = "absolute top-1/2 h-[82%] w-auto -translate-y-1/2 rounded-tile shadow-[0_30px_60px_-24px_rgba(0,0,0,0.5)]";
  return (
    <div className="relative mx-auto h-[min(64svh,36rem)] w-full max-w-[34rem]">
      <ResponsiveImage id={left} alt="" priority sizes="16rem" className={cn(side, "left-0 -rotate-[8deg]")} />
      <ResponsiveImage id={right} alt="" priority sizes="16rem" className={cn(side, "right-0 rotate-[8deg]")} />
      <ResponsiveImage
        id={center}
        alt=""
        priority
        sizes="20rem"
        className="absolute top-1/2 left-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2 rounded-tile shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}

/** Fondu vers le blanc en bas du hero, sous la fiche en verre. */
function HeroFade() {
  return <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-b from-transparent to-white md:h-32" />;
}

/**
 * Hero de page projet, façon Supaste : plein écran, titre en Inter et accroche
 * en Instrument Serif italique. Visuel paysage en fond (« cover ») ou visuels
 * posés sur un aplat de la couleur du projet (« showcase »).
 */
export function ProjectHero({ project }: { project: Project }) {
  const { hero, theme } = project;
  const dark = theme.heroTone === "dark";

  const heading = (
    <div className={cn(dark ? "text-white" : "text-foreground")}>
      <nav aria-label="Fil d'Ariane" className={cn("text-sm", dark ? "text-white/70" : "text-foreground/65")}>
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/projets/" className={cn("transition-colors", dark ? "hover:text-white" : "hover:text-foreground")}>
              Projets
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className={cn("font-medium", dark ? "text-white" : "text-foreground")}>
            {project.title}
          </li>
        </ol>
      </nav>
      <p className={cn("mt-8 text-sm font-medium tabular-nums", dark ? "text-white/70" : "text-foreground/65")}>
        Projet {project.number} / {String(projects.length).padStart(2, "0")}
      </p>
      <h1 className="display-xl mt-3 text-balance">{project.title}</h1>
      <p className="serif mt-5 max-w-3xl text-[clamp(1.75rem,3.4vw,2.875rem)] leading-[1.1] text-balance">
        {frenchTypo(project.accroche ?? project.tagline)}
      </p>
    </div>
  );

  if (hero.mode === "cover") {
    return (
      <header data-hero={theme.heroTone} className="relative isolate flex min-h-[92svh] items-end overflow-hidden">
        <ResponsiveImage
          id={hero.image}
          alt=""
          priority
          sizes="100vw"
          className="hero-bg absolute inset-0 -z-20 size-full object-cover"
          style={{ objectPosition: hero.position ?? "50% 50%" }}
        />
        {hero.shade ? (
          // Ombre teintée, dense en bas à gauche derrière le titre, effacée vers le haut à droite.
          <span
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background: [
                `radial-gradient(140% 100% at 0% 100%, rgba(${hero.shade}, 0.95) 0%, rgba(${hero.shade}, 0.82) 40%, rgba(${hero.shade}, 0) 80%)`,
                `linear-gradient(to top, rgba(${hero.shade}, 0.8) 0%, rgba(${hero.shade}, 0.55) 40%, rgba(${hero.shade}, 0) 72%)`,
                `linear-gradient(to right, rgba(${hero.shade}, 0.45) 0%, rgba(${hero.shade}, 0) 55%)`,
                `linear-gradient(to bottom, rgba(${hero.shade}, 0.45) 0%, rgba(${hero.shade}, 0) 22%)`,
              ].join(", "),
            }}
          />
        ) : (
          <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/35 to-black/35" />
        )}
        <HeroFade />
        <div className="container-page pt-36 pb-40 md:pb-48">{heading}</div>
      </header>
    );
  }

  return (
    <header
      data-hero={theme.heroTone}
      className="relative isolate flex min-h-[92svh] items-end overflow-hidden"
      style={{ background: hero.background }}
    >
      <HeroFade />
      <div className="container-page grid w-full items-center gap-12 pt-32 pb-40 md:pb-48 lg:grid-cols-12">
        <div className="lg:col-span-6">{heading}</div>
        <div className="flex justify-center lg:col-span-6">
          <Showcase images={hero.images} />
        </div>
      </div>
    </header>
  );
}
