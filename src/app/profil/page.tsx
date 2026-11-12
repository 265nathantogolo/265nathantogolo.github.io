import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brush,
  ChevronDown,
  Clapperboard,
  Compass,
  Download,
  GraduationCap,
  HandFist,
  Megaphone,
  Palette,
  PenLine,
  ScanSearch,
  Share2,
  Telescope,
  type LucideIcon,
} from "lucide-react";

import { site } from "@/data/site";
import { skills, type SkillSlug } from "@/data/projects";
import { cefr, education, experiences, languages, passions, softSkills, tools } from "@/data/profile";
import { asset } from "@/lib/images";
import { cn } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { ResponsiveImage } from "@/components/site/responsive-image";
import { Signature } from "@/components/site/signature";
import { ProfileSubnav } from "@/components/profil/profile-subnav";

export const metadata: Metadata = {
  title: "À propos de moi",
  description:
    "Expériences en agence (Havas Paris · L'Agence Verte, Workly, Havas People), formation à Sup de Pub, compétences, outils et passions de Nathan Togolo.",
  alternates: { canonical: "/profil/" },
  openGraph: { url: "/profil/" },
};

const skillIcons: Record<SkillSlug, LucideIcon> = {
  "creation-graphique": Palette,
  "reseaux-sociaux": Share2,
  campagnes: Megaphone,
  copywriting: PenLine,
  benchmark: ScanSearch,
};

const passionIcons: Record<string, LucideIcon> = {
  Philosophie: BookOpen,
  Boxe: HandFist,
  Dessin: Brush,
  Cinéma: Clapperboard,
  Astronomie: Telescope,
};

/** Titre de chapitre façon brand book : numéro, titre en Inter, mot en serif. */
function Chapter({
  number,
  id,
  title,
  accent,
  dark = false,
}: {
  number: string;
  id: string;
  title: string;
  accent?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("flex items-baseline gap-4 border-t pt-6", dark ? "border-white/15" : "border-border")}>
      <span className={cn("text-sm font-medium tabular-nums", dark ? "text-white/50" : "text-muted-foreground")}>{number}</span>
      <h2 id={id} className="display-md">
        {title} {accent && <span className="serif">{accent}</span>}
      </h2>
    </div>
  );
}

const sdp = education.find((item) => item.id === "sup-de-pub")!;

export default function ProfilePage() {
  return (
    <div className="container-page pt-36 md:pt-44">
      {/* Ouverture : grand titre typographique et fiche d'identité. */}
      <header className="grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="section-pill">À propos de moi</p>
          <h1 className="display-xl mt-6">
            Nathan
            <br />
            <span className="serif">Togolo.</span>
          </h1>
          <p className="lead mt-8 max-w-xl">
            <strong>Étudiant en Bachelor Stratégie des Marques et Communication à Sup de Pub.</strong> Un parcours commencé en droit,
            poursuivi en agence, chez Havas Paris, Havas People et Workly.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LiquidButton asChild variant="tinted" size="xl">
              <a href={asset(site.cv)} download={site.cvDownloadName}>
                <Download />
                Télécharger le CV
              </a>
            </LiquidButton>
            <LiquidButton asChild variant="ink" size="xl">
              <Link href="/contact/">Me contacter</Link>
            </LiquidButton>
          </div>
        </div>

        <Reveal className="lg:col-span-5">
          <dl className="relative isolate overflow-hidden rounded-card bg-night p-7 text-white md:p-9">
            <Signature className="pointer-events-none absolute -right-6 -bottom-10 -z-10 h-56 -rotate-6 text-white/[0.06]" />
            {[
              { label: "Formation", value: `${sdp.degree}, ${sdp.school} (${sdp.period})` },
              { label: "Expérience", value: `${experiences.length} expériences en agence et en mission, depuis 2024` },
              { label: "Langues", value: languages.map((language) => `${language.name} ${language.level === "Langue maternelle" ? "(natif)" : language.level}`).join(" · ") },
              { label: "Soft skills", value: softSkills.join(" · ") },
            ].map((item, i) => (
              <div key={item.label} className={cn(i > 0 && "mt-6 border-t border-white/10 pt-6")}>
                <dt className="text-xs font-medium tracking-wide text-white/50 uppercase">{item.label}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-white/90">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      <div className="mt-16 md:mt-24">
        <ProfileSubnav />
      </div>

      {/* 01 · Expériences : index façon agence, missions dépliables. */}
      <section id="experiences" aria-labelledby="experiences-title" className="mt-16 md:mt-24">
        <Chapter number="01" id="experiences-title" title="Expériences" accent="en agence." />
        <ol className="mt-10 space-y-3">
          {experiences.map((experience) => (
            <Reveal as="li" key={experience.id}>
              <details id={experience.id} className="group rounded-card bg-surface open:bg-white open:ring-1 open:ring-border">
                <summary className="flex cursor-pointer list-none items-center gap-5 p-5 md:gap-8 md:p-7 [&::-webkit-details-marker]:hidden">
                  {experience.logo && (
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white ring-1 ring-border md:size-16">
                      <ResponsiveImage id={experience.logo} alt={experience.logoAlt ?? ""} sizes="40px" className="size-9 rounded-[0.55rem] md:size-10" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl font-semibold tracking-[-0.025em] md:text-[1.75rem]">{experience.company}</span>
                    <span className="mt-1 block text-[0.9375rem] text-muted-foreground">{experience.role}</span>
                  </span>
                  <span className="hidden text-right text-sm text-muted-foreground sm:block">
                    {experience.type}
                    <span className="block font-medium text-foreground">{experience.period}</span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-border transition-transform group-open:rotate-180">
                    <ChevronDown className="size-4" aria-hidden />
                    <span className="sr-only">Afficher les missions</span>
                  </span>
                </summary>
                <div className="grid gap-8 px-5 pb-7 md:grid-cols-12 md:px-7 md:pb-9">
                  <p className="text-sm text-muted-foreground sm:hidden">
                    {experience.type} · {experience.period}
                  </p>
                  <ul className="space-y-3 md:col-span-7 md:col-start-1">
                    {experience.missions.map((mission) => (
                      <li key={mission} className="flex gap-3 text-base leading-snug md:text-[1.0625rem]">
                        <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-primary" />
                        {mission}
                      </li>
                    ))}
                  </ul>
                  {experience.clients && (
                    <div className="md:col-span-5">
                      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Clients</h3>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {experience.clients.map((client) => (
                          <li key={client} className="rounded-full bg-surface px-3 py-1 text-sm font-medium">
                            {client}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* 02 · Mon histoire : frise sur fond sombre. */}
      <section id="histoire" aria-labelledby="histoire-title" className="mt-24 md:mt-36">
        <div className="rounded-card bg-night px-6 py-12 text-white md:px-12 md:py-16">
          <Chapter number="02" id="histoire-title" title="Mon" accent="histoire." dark />
          <p className="serif mt-6 text-2xl text-white/70 md:text-3xl">Du droit à la stratégie de marque.</p>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
            {education.map((item, i) => (
              <Reveal as="li" key={item.id} delay={0.08 * i} className="relative md:pt-10">
                {/* Frise : un trait relie les étapes sur desktop. */}
                <span aria-hidden className="absolute top-[1.15rem] right-0 left-0 hidden h-px bg-white/15 md:block" />
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-3 left-0 hidden size-3.5 rounded-full ring-4 ring-night md:block",
                    i === education.length - 1 ? "bg-signature" : "bg-white/60",
                  )}
                />
                <div className="flex items-center gap-4">
                  {item.logo ? (
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white">
                      <ResponsiveImage id={item.logo} alt={item.logoAlt ?? ""} sizes="32px" className="size-8 rounded-[0.5rem]" />
                    </span>
                  ) : (
                    // Aucun logo du lycée dans le dossier « Logos CV » : pictogramme neutre, pas de logo inventé.
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 text-white/80">
                      <GraduationCap className="size-5" aria-hidden />
                    </span>
                  )}
                  <p className="text-3xl font-bold tracking-[-0.04em] tabular-nums">{item.period}</p>
                </div>
                <h3 className="mt-5 text-lg leading-snug font-semibold tracking-[-0.02em]">{item.degree}</h3>
                <p className="mt-1 text-[0.9375rem] text-white/60">
                  {item.school}
                  {item.place && ` · ${item.place}`}
                </p>
                {item.details && <p className="mt-3 text-sm leading-relaxed text-white/75">{item.details}</p>}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 · Compétences : grille comme les Expertises de l'accueil, sans compteurs. */}
      <section id="competences" aria-labelledby="competences-title" className="mt-24 md:mt-36">
        <Chapter number="03" id="competences-title" title="Compétences" accent="clés." />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => {
            const Icon = skillIcons[skill.slug];
            return (
              <Reveal as="li" key={skill.slug} delay={0.05 * index}>
                <Link
                  href={`/projets/?competence=${skill.slug}`}
                  className="group flex h-full flex-col rounded-card bg-surface p-7 transition duration-300 ease-apple hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(0,0,0,0.3)]"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em]">{skill.cvTitle}</h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">{skill.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-ink">
                    Voir les projets
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            );
          })}
          <Reveal as="li" delay={0.25}>
            <div className="flex h-full flex-col rounded-card bg-night p-7 text-night-foreground">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10">
                <Compass className="size-5" aria-hidden />
              </span>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em]">Soft skills</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {softSkills.map((softSkill) => (
                  <li key={softSkill} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.9375rem] font-medium">
                    {softSkill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </ul>

        <div className="mt-3 rounded-card bg-surface p-7 md:p-9">
          <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Langues</h3>
          <ul className="mt-6 grid gap-8 md:grid-cols-3">
            {languages.map((language) => (
              <li key={language.name}>
                <p className="flex items-baseline justify-between gap-4">
                  <span className="text-xl font-semibold tracking-[-0.025em]">{language.name}</span>
                  <span className="text-sm font-medium">{language.level}</span>
                </p>
                <div aria-hidden className="mt-4 grid grid-cols-6 gap-1">
                  {cefr.map((level, index) => (
                    <div key={level}>
                      <span className={cn("block h-1.5 rounded-full", index < language.rank ? "bg-primary" : "bg-border")} />
                      <span className="mt-1.5 block text-center text-[0.6875rem] text-muted-foreground">{level}</span>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">Échelle européenne (CECRL), de A1 à C2.</p>
        </div>
      </section>

      {/* 04 · Outils & logiciels : pastilles. */}
      <section id="outils" aria-labelledby="outils-title" className="mt-24 md:mt-36">
        <Chapter number="04" id="outils-title" title="Outils" accent="& logiciels." />
        <ul className="mt-10 divide-y divide-border border-b border-border">
          {tools.map((group, index) => (
            <Reveal as="li" key={group.group} delay={0.05 * index} className="grid gap-4 py-6 md:grid-cols-12 md:py-8">
              <div className="md:col-span-4">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{group.group}</h3>
                {group.note && <p className="mt-2 max-w-xs text-sm text-muted-foreground">{group.note}</p>}
              </div>
              <ul className="flex flex-wrap content-start gap-2 md:col-span-8">
                {group.items.map((tool) => (
                  <li key={tool} className="rounded-full bg-surface px-4 py-2 text-[0.9375rem] font-medium">
                    {tool}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* 05 · Passions : cartes typographiques avec pictogrammes. */}
      <section id="passions" aria-labelledby="passions-title" className="mt-24 md:mt-36">
        <Chapter number="05" id="passions-title" title="En dehors" accent="du travail." />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {passions.map((passion, index) => {
            const Icon = passionIcons[passion.name] ?? BookOpen;
            const content = (
              <>
                <span className="grid size-12 place-items-center rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="mt-auto pt-12">
                  <span className="block text-xs font-medium text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block text-2xl font-semibold tracking-[-0.03em]">{passion.name}</span>
                  {passion.href && (
                    <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary-ink">
                      Voir Cineman
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  )}
                </span>
              </>
            );
            return (
              <Reveal as="li" key={passion.name} delay={0.05 * index}>
                {passion.href ? (
                  <Link href={passion.href} className="group flex aspect-[4/5] h-full flex-col rounded-card bg-surface p-6 transition duration-300 ease-apple hover:-translate-y-1">
                    {content}
                  </Link>
                ) : (
                  <div className="group flex aspect-[4/5] h-full flex-col rounded-card bg-surface p-6">{content}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
