import type { CSSProperties } from "react";
import { categories } from "@/data/categories";
import { education, experiences, interests, languages, softSkills, tools } from "@/data/profile";
import { projects } from "@/data/projects";
import { Link, paths } from "@/lib/router";
import { Arrow } from "./primitives";

/* ---------- 01 · Expériences ---------- */

export function ExperienceTimeline() {
  return (
    <ol className="xp-list">
      {experiences.map((x) => (
        <li key={x.org} className="xp" data-reveal="">
          <div className="xp__when">
            <span className="xp__period">{x.period}</span>
            <span className="label">{x.kind}</span>
          </div>
          <div className="xp__main">
            <h3 className="xp__org">{x.org}</h3>
            <p className="xp__role">{x.role}</p>
            {x.clients && (
              <div className="xp__clients">
                <p className="label">Clients</p>
                <ul className="pill-list">
                  {x.clients.map((c) => (
                    <li key={c} className="pill">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <ul className="xp__missions">
              {x.missions.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- 02 · Mon histoire ---------- */

export function EducationTimeline() {
  return (
    <ol className="edu" style={{ "--n": education.length } as CSSProperties}>
      {education.map((e, i) => (
        <li key={e.title} className="edu__step" data-reveal="" style={{ "--i": i } as CSSProperties}>
          <span className="edu__years">{e.years}</span>
          <span className="edu__dot" aria-hidden="true" />
          <h3 className="edu__title">{e.title}</h3>
          <p className="edu__school">{e.school}</p>
          {e.subjects && <p className="edu__subjects">{e.subjects}</p>}
        </li>
      ))}
    </ol>
  );
}

/* ---------- 03 · Compétences ---------- */

export function Skills() {
  return (
    <div className="skills">
      <div className="skills__col" data-reveal="">
        <h3 className="skills__head">Soft skills</h3>
        <ul className="pill-list pill-list--lg">
          {softSkills.map((s) => (
            <li key={s} className="pill pill--lg">
              {s}
            </li>
          ))}
        </ul>

        <h3 className="skills__head skills__head--spaced">Langues</h3>
        <ul className="langs">
          {languages.map((l) => (
            <li key={l.name} className="lang">
              <span className="lang__name">{l.name}</span>
              <span className="lang__scale" aria-hidden="true">
                {Array.from({ length: 6 }, (_, k) => (
                  <span key={k} className={k < l.steps ? "is-on" : undefined} />
                ))}
              </span>
              <span className="lang__level">{l.level ?? ""}</span>
            </li>
          ))}
        </ul>
        <p className="skills__note">Échelle européenne (CECRL), de A1 à C2.</p>
      </div>

      <div className="skills__col" data-reveal="">
        <h3 className="skills__head">Hard skills</h3>
        <ul className="hard">
          {categories.map((c) => {
            const count = projects.filter((p) => p.categories.includes(c.id)).length;
            return (
              <li key={c.id} className="hard__item">
                <p className="hard__name">{c.label}</p>
                <p className="hard__detail">{c.detail}</p>
                {count > 0 && (
                  <Link to={paths.work(c.id)} className="hard__link">
                    {count} projet{count > 1 ? "s" : ""} <Arrow />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------- 04 · Outils & logiciels ---------- */

export function ToolsGrid() {
  return (
    <div className="tools">
      {tools.map((g) => (
        <div key={g.group} className="tools__group" data-reveal="">
          <h3 className="label tools__head">{g.group}</h3>
          <ul className="tools__list">
            {g.items.map((t) => (
              <li key={t} className="tool">
                {t}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ---------- 05 · Passions ---------- */

export function Passions() {
  return (
    <ul className="passions">
      {interests.map((p, i) => (
        <li key={p} className="passion" data-reveal="" style={{ "--i": i } as CSSProperties}>
          <span className="passion__num">0{i + 1}</span>
          <span className="passion__word">{p}</span>
        </li>
      ))}
    </ul>
  );
}
