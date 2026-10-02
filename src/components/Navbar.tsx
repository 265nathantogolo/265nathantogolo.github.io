import { Link, paths, type Route } from "@/lib/router";
import { cn } from "@/lib/utils";
import { Signature } from "./primitives";

const items = [
  { num: "01", label: "Projets", to: paths.work(), match: ["work", "project"] },
  { num: "02", label: "Profil", to: paths.about(), match: ["about"] },
  { num: "03", label: "Contact", to: paths.contact, match: ["contact"] },
];

/** En-tête fixe en mode « difference » : lisible sur le papier, l'encre et les images. */
export function Navbar({ route }: { route: Route }) {
  return (
    <header className="site-header">
      <Link to={paths.home} className="site-header__brand" aria-label="Nathan Togolo — accueil">
        <Signature className="site-header__sig" />
        <span className="site-header__name" aria-hidden="true">
          Nathan Togolo
          <span className="site-header__role">Portfolio</span>
        </span>
      </Link>
      <nav aria-label="Navigation principale">
        <ul className="site-nav">
          {items.map((item) => {
            const active = item.match.includes(route.name);
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={cn("site-nav__link", active && "is-active")}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="site-nav__num" aria-hidden="true">
                    {item.num}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
