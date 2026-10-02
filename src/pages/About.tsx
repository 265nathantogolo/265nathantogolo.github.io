import { useEffect, useRef, useState } from "react";
import { contact, identity, profileSections } from "@/data/profile";
import { avatar } from "@/data/projects";
import { prefersReducedMotion, useReveals } from "@/lib/motion";
import { paths, replaceSilently } from "@/lib/router";
import { cn } from "@/lib/utils";
import { Arrow, SectionHead } from "@/components/primitives";
import { EducationTimeline, ExperienceTimeline, Passions, Skills, ToolsGrid } from "@/components/Profile";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

/**
 * Profil construit à partir du CV, dans l'ordre des sections du gabarit index.html.
 */
export function About({ section }: { section: string | null }) {
  const [active, setActive] = useState<string>(profileSections[0].id);
  const firstScroll = useRef(true);
  useReveals();

  // défilement vers la section demandée (#/profil/competences)
  useEffect(() => {
    if (!section) {
      firstScroll.current = false;
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      const smooth = !firstScroll.current && !prefersReducedMotion();
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }
    firstScroll.current = false;
  }, [section]);

  // section en cours de lecture
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    profileSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const avatarImage = avatar
    ? { ...avatar, alt: "Avatar 3D de Nathan Togolo, bras croisés, sur fond orange", ratio: avatar.width / avatar.height }
    : null;

  return (
    <div className="about">
      <header className="about__hero page-pad">
        {avatarImage && (
          <figure className="about__avatar" data-reveal="" style={{ backgroundColor: avatarImage.color }}>
            <img
              src={avatarImage.src}
              alt={avatarImage.alt}
              width={avatarImage.width}
              height={avatarImage.height}
              decoding="async"
            />
          </figure>
        )}
        <div className="about__intro">
          <p className="hero__hello" data-reveal="">
            {identity.greeting} <span aria-hidden="true">{identity.wave}</span> {identity.greetingEnd}
          </p>
          <h1 className="about__name" data-reveal="">
            {identity.firstName}
            <br />
            {identity.lastName}
          </h1>
          <p className="availability availability--banner" data-reveal="">
            <span className="availability__dot" aria-hidden="true" />
            {identity.search}
          </p>
          <ul className="about__contact" data-reveal="">
            <li>
              <span className="label">Téléphone</span>
              <a href={contact.phoneHref}>{contact.phone}</a>
            </li>
            <li>
              <span className="label">E-mail</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
          <div className="about__cta" data-reveal="">
            <LiquidButton asChild size="xl">
              <a href={contact.cv} download="CV-Nathan-Togolo.pdf">
                <span>Télécharger le CV</span>
                <Arrow dir="down" />
              </a>
            </LiquidButton>
          </div>
        </div>
      </header>

      <div className="about__body page-pad">
        <nav className="about__index" aria-label="Sections du profil">
          <ol>
            {profileSections.map((s) => (
              <li key={s.id}>
                <a
                  href={paths.about(s.id)}
                  className={cn("about__index-link", active === s.id && "is-active")}
                  aria-current={active === s.id ? "true" : undefined}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    replaceSilently(paths.about(s.id));
                    const target = document.getElementById(s.id);
                    target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });                  }}
                >
                  <span className="about__index-num">{s.num}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="about__sections">
          <section id="experiences" className="about__section">
            <SectionHead num="01" title="Expériences" />
            <ExperienceTimeline />
          </section>

          <section id="histoire" className="about__section">
            <SectionHead num="02" title="Mon histoire" kicker="Du droit à la stratégie de marque" />
            <EducationTimeline />
          </section>

          <section id="competences" className="about__section">
            <SectionHead num="03" title="Compétences" />
            <Skills />
          </section>

          <section id="outils" className="about__section">
            <SectionHead num="04" title="Outils & logiciels" />
            <ToolsGrid />
          </section>

          <section id="passions" className="about__section">
            <SectionHead num="05" title="Passions" />
            <Passions />
          </section>
        </div>
      </div>
    </div>
  );
}
