import { contact, experiences, identity } from "@/data/profile";
import { featured, projectBySlug, projects } from "@/data/projects";
import { useReveals, useScrollEffects } from "@/lib/motion";
import { Link, paths } from "@/lib/router";
import { FeaturedProject } from "@/components/FeaturedProject";
import { ProjectStrip } from "@/components/ProjectStrip";
import { Arrow, FitText, SplitWords } from "@/components/primitives";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export function Home() {
  useReveals();
  useScrollEffects();

  return (
    <div className="home">
      {/* ---------- Ouverture ---------- */}
      <section className="hero page-pad" aria-labelledby="hero-title">
        <div className="hero__labels label">
          <p data-reveal="">
            Stratégie des marques
            <br />
            et communication
          </p>
          <p data-reveal="" className="hero__labels-right">
            {identity.school}
            <br />
            {identity.programYears}
          </p>
        </div>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__hello" data-reveal="">
            {identity.greeting} <span className="hero__wave" aria-hidden="true">{identity.wave}</span> {identity.greetingEnd}
          </span>
          <span className="hero__name" data-reveal="">
            <FitText text={`${identity.firstName} ${identity.lastName}`} disableBelow={640} />
          </span>
        </h1>

        <ProjectStrip />

        <div className="hero__bottom">
          <p className="availability" data-reveal="">
            <span className="availability__dot" aria-hidden="true" />
            {identity.search}
          </p>
          <a className="hero__mail" href={`mailto:${contact.email}`} data-reveal="">
            {contact.email}
          </a>
          <div className="hero__cta" data-reveal="">
            <LiquidButton asChild size="xl">
              <Link to={paths.work()}>
                <span>Explorer les projets</span>
                <Arrow />
              </Link>
            </LiquidButton>
          </div>
        </div>
      </section>

      {/* ---------- Sélection ---------- */}
      <section className="featured page-pad" aria-label="Sélection de projets">
        <header className="featured__head">
          <p className="label" data-reveal="">
            Sélection — 04 / {projects.length}
          </p>
          <SplitWords as="h2" text="Quatre projets, quatre compétences" className="featured__title" />
          <p className="featured__intro" data-reveal="">
            Un projet par compétence du CV : campagnes publicitaires, création graphique, réseaux sociaux et benchmark.
          </p>
        </header>
        <div className="featured__list">
          {featured.map((f) => (
            <FeaturedProject key={f.slug} project={projectBySlug[f.slug]} images={f.images} layout={f.layout} />
          ))}
        </div>
        <div className="featured__more" data-reveal="">
          <LiquidButton asChild size="xl">
            <Link to={paths.work()}>
              <span>Voir les {projects.length} projets</span>
              <Arrow />
            </Link>
          </LiquidButton>
        </div>
      </section>

      {/* ---------- Profil (aperçu) ---------- */}
      <section className="home-profile page-pad" aria-labelledby="home-profile-title">
        <p className="label" data-reveal="" id="home-profile-title">
          Profil
        </p>
        <SplitWords
          as="p"
          className="home-profile__statement"
          text={`En Bachelor Stratégie des Marques et Communication à ${identity.school}, je cherche une alternance en tant que chargé de communication.`}
        />
        <ul className="home-profile__xp">
          {experiences.map((x) => (
            <li key={x.org} data-reveal="">
              <span className="label">
                {x.kind} · {x.period}
              </span>
              <span className="home-profile__org">{x.org}</span>
              <span className="home-profile__role">{x.role}</span>
            </li>
          ))}
        </ul>
        <Link to={paths.about()} className="text-link" data-reveal="">
          Voir le profil complet <Arrow />
        </Link>
      </section>
    </div>
  );
}
