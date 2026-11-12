import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { site } from "@/data/site";
import { featured, getProject, getSkill, projects, skills, type Project } from "@/data/projects";
import { experiences, education } from "@/data/profile";
import { marqueeLogos } from "@/data/logos";
import { asset, imageMeta, imageSrc, imageSrcSet } from "@/lib/images";
import { LiquidButton } from "@/components/ui/button";
import { GlassFolder, type ArtRecipe, type FolderFile } from "@/components/ui/glass-folder";
import { GlassSurface } from "@/components/ui/glass-surface";
import TailwindImageAccordion, { type AccordionItem } from "@/components/ui/image-accordion";
import { LogoMarquee } from "@/components/ui/logo-marquee";
import { BlurIn, BlurText } from "@/components/site/blur-text";
import { ResponsiveImage } from "@/components/site/responsive-image";
import { ScrollRise, ScrollWords } from "@/components/site/scroll-motion";

const accordionItems: AccordionItem[] = featured.map(({ slug, image }) => {
  const project = getProject(slug)!;
  const meta = imageMeta(image);
  const alt = project.images.find((img) => img.id === image)?.alt ?? project.title;
  return {
    id: slug,
    url: imageSrc(image, 1280),
    srcSet: imageSrcSet(image),
    width: meta.w,
    height: meta.h,
    title: project.title,
    description: `${project.number} · ${project.year}`,
    alt,
    href: `/projets/${slug}/`,
    tags: project.skills.map((skill) => getSkill(skill)!.label),
  };
});

// Expertises : les 5 compétences du CV + la stratégie de marque (intitulé du Bachelor),
// chacune en dossier de verre qui contient ses projets.
const asFile = (project: Project): FolderFile => ({
  name: project.title,
  meta: String(project.year),
  image: imageSrc(project.cover, 640),
  href: `/projets/${project.slug}/`,
});

// Peinture liquide du fond des dossiers, dans les couleurs du site : noir, rose-rouge
// signature et argent bleuté du logo chromé. Deux recettes en alternance.
const folderArt: ArtRecipe[] = [
  {
    style: "marble",
    colors: ["#07080b", "#191b23", "#56637d", "#101017", "#b5003a", "#ff205c", "#ffd3de"],
    scale: 0.66,
    warp: 3.3,
    angle: -0.5,
    gloss: 0.55,
    veins: 0.5,
  },
  {
    style: "streak",
    colors: ["#f6f8fb", "#d5dde9", "#93a6c1", "#2b303b", "#ff205c", "#ffe1e9", "#eef2f7"],
    scale: 0.7,
    warp: 1.4,
    angle: -0.62,
    gloss: 0.22,
    veins: 0,
  },
];

const retro = getProject("retromarketing")!;
const strategyProjects = ["retromarketing", "les-watchers", "europcar"].map((slug) => asFile(getProject(slug)!));

const expertises = [
  {
    label: "Stratégie de marque",
    title: "Stratégie de marque",
    description: "Positionnement, plateforme de marque et recommandations de communication.",
    href: "/profil/#histoire",
    files: [
      ...(retro.document
        ? [{ name: "Benchmark Retromarketing", meta: "PDF", href: asset(retro.document.file), download: retro.document.downloadName }]
        : []),
      ...strategyProjects,
    ],
    meta: `${strategyProjects.length} projets${retro.document ? " · 1 PDF" : ""}`,
  },
  ...skills.map((skill) => ({
    label: skill.label,
    title: skill.cvTitle,
    description: skill.description,
    href: `/projets/?competence=${skill.slug}`,
    files: projects.filter((project) => project.skills.includes(skill.slug)).map(asFile),
    meta: undefined,
  })),
];

const sdp = education.find((item) => item.id === "sup-de-pub")!;
const heroInfos = [site.school, `${experiences.length} expériences en agence`, "Alternance 2026"];

export default function HomePage() {
  const logo = imageMeta("brand/logo-chrome");

  return (
    <>
      {/*
        Hero plein écran sur l'image spatiale : la Voie lactée derrière le titre,
        l'horizon de la Terre sous le panneau des projets, fondu vers le blanc.
      */}
      <section data-hero="dark" aria-labelledby="hero-title" className="relative isolate overflow-hidden text-white">
        <picture>
          <source
            media="(max-aspect-ratio: 4/5)"
            type="image/webp"
            srcSet={imageSrcSet("brand/hero-space-portrait")}
            sizes="100vw"
          />
          <img
            src={imageSrc("brand/hero-space", 1920)}
            srcSet={imageSrcSet("brand/hero-space")}
            sizes="100vw"
            width={imageMeta("brand/hero-space").w}
            height={imageMeta("brand/hero-space").h}
            alt=""
            fetchPriority="high"
            className="hero-bg absolute inset-0 -z-20 size-full object-cover object-[50%_78%]"
          />
        </picture>
        <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[38%] bg-linear-to-b from-transparent via-white/70 to-white" />

        <div className="container-page flex min-h-svh flex-col items-center justify-center pt-28 pb-16 text-center">
          <h1 id="hero-title" className="w-[min(30rem,76vw)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-hero-logo=""
              src={imageSrc("brand/logo-chrome", 800)}
              srcSet={imageSrcSet("brand/logo-chrome")}
              sizes="(min-width: 48rem) 30rem, 76vw"
              width={logo.w}
              height={logo.h}
              alt={site.name}
              fetchPriority="high"
              className="hero-logo h-auto w-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
            />
          </h1>
          <p className="serif mt-6 text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.05]">
            <BlurText text={site.baseline} delay={150} />
          </p>
          <BlurIn delay={700} className="mt-5 max-w-xl">
            <p className="text-[1.0625rem] leading-relaxed text-white/75 md:text-lg">
              Identités visuelles, campagnes et contenus social media, pensés pour la marque et pour son public.
            </p>
          </BlurIn>
          <BlurIn delay={850} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <LiquidButton asChild surface="dark" size="xl">
              <Link href="/projets/">
                Voir mes projets
                <ArrowRight />
              </Link>
            </LiquidButton>
            <LiquidButton asChild surface="dark" size="xl" className="text-white/85">
              <Link href="/contact/">Me contacter</Link>
            </LiquidButton>
          </BlurIn>
          <BlurIn delay={1000} className="mt-10">
            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-white/65">
              {heroInfos.map((info, i) => (
                <li key={info} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="size-1 rounded-full bg-white/40" />}
                  {info}
                </li>
              ))}
            </ul>
          </BlurIn>
        </div>

        {/* Panneau des projets phares, en verre liquide, posé sur l'horizon. */}
        <ScrollRise className="container-page pb-20 md:pb-28" distance={140} from={0.9}>
          <div className="mb-4 flex items-end justify-between gap-4 px-1">
            <h2 className="text-sm font-medium text-white/80">Projets phares</h2>
            <Link href="/projets/" className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white">
              Les {projects.length} projets
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
          <GlassSurface surface="dark" className="rounded-card bg-white/10 p-2 md:p-3">
            <TailwindImageAccordion items={accordionItems} />
          </GlassSurface>
        </ScrollRise>
      </section>

      {/* Logos en pastilles grises : agences, missions et clients accompagnés. */}
      <section aria-labelledby="logos-title" className="mt-16 md:mt-24">
        <ScrollRise distance={60} from={1}>
          <h2 id="logos-title" className="container-page text-center text-sm text-muted-foreground">
            Agences, missions et clients accompagnés
          </h2>
          {/* Le bandeau accélère quand on fait défiler la page. */}
          <LogoMarquee logos={marqueeLogos} badges className="mt-6" />
        </ScrollRise>
      </section>

      {/* Expertises : six dossiers de verre ; ouverts, ils déploient leurs projets en éventail. */}
      <section aria-labelledby="expertises-title" className="container-page mt-28 md:mt-40">
        <ScrollRise className="mx-auto max-w-3xl text-center">
          <p className="section-pill">Expertises</p>
          <h2 id="expertises-title" className="display-md mt-5 text-balance">
            De la stratégie <span className="serif">à l&apos;exécution.</span>
          </h2>
          <p className="lead mx-auto mt-5 max-w-xl">
            Six savoir-faire, du positionnement d&apos;une marque jusqu&apos;au post qui la fait exister.{" "}
            <strong>Ouvrez un dossier pour voir les projets.</strong>
          </p>
        </ScrollRise>
        <ul className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {expertises.map((expertise, i) => (
            <li key={expertise.title}>
              <h3 className="sr-only">{expertise.title}</h3>
              <GlassFolder
                label={expertise.label}
                meta={expertise.meta}
                art={folderArt[i % folderArt.length]}
                seed={i + 2}
                files={expertise.files}
                href={expertise.href}
                hrefLabel={`Tous les projets : ${expertise.label}`}
                appearDelay={(i % 3) * 140}
              />
              <p className="mt-5 px-1 text-[0.9375rem] leading-relaxed text-muted-foreground">{expertise.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Citation : une pause dans le défilement. */}
      <section aria-label="Citation" className="container-page mt-32 md:mt-48">
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="serif text-[clamp(2rem,4.8vw,3.875rem)] leading-[1.1] text-balance">
            {/* La citation s'éclaire mot à mot au fil du scroll. */}
            <ScrollWords text={"«\u00a0Rendre les choses compliquées est à la portée de tout le monde. Rendre les choses simples, incroyablement simples, c'est cela la créativité.\u00a0»"} />
          </blockquote>
          <ScrollRise distance={40} from={1}>
            <figcaption className="mt-8 text-sm font-medium text-muted-foreground">Charles Mingus</figcaption>
          </ScrollRise>
        </figure>
      </section>

      {/* Parcours en agence : cartes grises centrées. */}
      <section aria-labelledby="parcours-title" className="container-page mt-32 md:mt-48">
        <ScrollRise className="mx-auto max-w-3xl text-center">
          <p className="section-pill">Parcours</p>
          <h2 id="parcours-title" className="display-md mt-5 text-balance">
            Formé <span className="serif">en agence.</span>
          </h2>
        </ScrollRise>
        <ul className="mt-14 grid gap-3 md:grid-cols-2">
          {experiences.map((experience, i) => (
            <ScrollRise as="li" key={experience.id} order={i % 2}>
              <Link
                href={`/profil/#${experience.id}`}
                className="group flex h-full items-start gap-5 rounded-card bg-surface p-6 transition duration-300 ease-apple hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(0,0,0,0.3)] md:p-7"
              >
                {experience.logo && (
                  <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white">
                    <ResponsiveImage id={experience.logo} alt={experience.logoAlt ?? ""} sizes="40px" className="size-10 rounded-[0.6rem]" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-muted-foreground">
                    {experience.type} · {experience.period}
                  </span>
                  <span className="mt-1 block text-lg font-semibold tracking-[-0.02em]">{experience.company}</span>
                  <span className="mt-0.5 block text-[0.9375rem] text-muted-foreground">{experience.role}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </Link>
            </ScrollRise>
          ))}
        </ul>
        <ScrollRise className="mt-3">
          <Link
            href="/profil/#histoire"
            className="group flex flex-col items-center justify-between gap-4 rounded-card bg-night p-7 text-center text-white sm:flex-row sm:text-left md:p-8"
          >
            <span>
              <span className="block text-sm text-white/60">
                {sdp.period} · {sdp.school}
              </span>
              <span className="mt-1 block text-lg font-semibold tracking-[-0.02em]">{sdp.degree}</span>
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white">
              Mon parcours
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </ScrollRise>
      </section>
    </>
  );
}
