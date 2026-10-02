import { Link, paths } from "@/lib/router";
import { Arrow } from "@/components/primitives";

export function NotFound() {
  return (
    <section className="notfound page-pad">
      <p className="label">404</p>
      <h1 className="notfound__title">Page introuvable</h1>
      <Link to={paths.work()} className="text-link">
        Voir les projets <Arrow />
      </Link>
    </section>
  );
}
