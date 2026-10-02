import { useEffect, useRef } from "react";
import { categoryById } from "@/data/categories";
import { projectBySlug } from "@/data/projects";
import { useRoute, type Route } from "@/lib/router";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { GlassFilter } from "@/components/ui/liquid-glass-button";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { ProjectPage } from "@/pages/Project";
import { Work } from "@/pages/Work";

const SITE = "Nathan Togolo";

function titleFor(route: Route) {
  switch (route.name) {
    case "home":
      return `${SITE} — Portfolio`;
    case "work":
      return route.category ? `${categoryById[route.category].label} — Projets — ${SITE}` : `Projets — ${SITE}`;
    case "project":
      return `${projectBySlug[route.slug]?.title ?? "Projet"} — ${SITE}`;
    case "about":
      return `Profil — ${SITE}`;
    case "contact":
      return `Contact — ${SITE}`;
    default:
      return `Page introuvable — ${SITE}`;
  }
}

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "home":
      return <Home />;
    case "work":
      return <Work category={route.category} view={route.view} />;
    case "project":
      return <ProjectPage slug={route.slug} />;
    case "about":
      return <About section={route.section} />;
    case "contact":
      return <Contact />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  const route = useRoute();
  const mainRef = useRef<HTMLElement>(null);
  const pageKey = route.name === "project" ? `project-${route.slug}` : route.name;
  const first = useRef(true);

  useEffect(() => {
    document.title = titleFor(route);
  }, [route]);

  // à chaque changement de page : focus sur le contenu pour les lecteurs d'écran
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pageKey]);

  // le verre « liquide » (filtre SVG en backdrop-filter) n'est rendu que par Chromium
  useEffect(() => {
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    if (brands?.some((b) => /Chromium/i.test(b.brand))) document.documentElement.classList.add("svg-backdrop");
  }, []);

  const dark = route.name === "contact";

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => {
        e.preventDefault();
        mainRef.current?.focus();
      }}>
        Aller au contenu
      </a>
      <GlassFilter />
      <Loader />
      <Navbar route={route} />
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className={dark ? "site-main site-main--dark dark" : "site-main"}
        data-page={route.name}
      >
        <Page key={pageKey} route={route} />
      </main>
      {!dark && <Footer />}
      <Cursor />
    </>
  );
}
