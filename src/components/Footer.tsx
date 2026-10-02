import { contact, profileSections } from "@/data/profile";
import { projects } from "@/data/projects";
import { Link, paths } from "@/lib/router";
import { prefersReducedMotion } from "@/lib/motion";
import { Arrow, Signature } from "./primitives";

/** Pied de page « rideau » : la page glisse vers le haut et le découvre. */
export function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  return (
    <footer className="site-footer dark">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <Link to={paths.home} className="site-footer__brand" aria-label="Nathan Togolo — accueil">
            <Signature className="site-footer__sig" />
          </Link>
          <div className="site-footer__cols">
            <nav className="site-footer__col" aria-label="Projets">
              <p className="label">Projets</p>
              <ul>
                {projects.map((p) => (
                  <li key={p.slug}>
                    <Link to={paths.project(p.slug)} className="site-footer__link">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className="site-footer__col" aria-label="Profil">
              <p className="label">Profil</p>
              <ul>
                {profileSections.map((s) => (
                  <li key={s.id}>
                    <Link to={paths.about(s.id)} className="site-footer__link">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="site-footer__col">
              <p className="label">Contact</p>
              <ul>
                <li>
                  <a className="site-footer__link" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a className="site-footer__link" href={contact.phoneHref}>
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a className="site-footer__link" href={contact.cv} download>
                    CV (PDF)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Nathan Togolo</span>
          <button type="button" className="site-footer__top-btn" onClick={toTop}>
            Haut de page <Arrow dir="up" />
          </button>
        </div>
      </div>
    </footer>
  );
}
