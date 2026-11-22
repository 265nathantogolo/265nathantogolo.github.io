"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";

import { nav, site } from "@/data/site";
import { asset } from "@/lib/images";
import { LiquidButton } from "@/components/ui/button";
import { isActive } from "./site-header";

/** Coins concaves au pied de l'onglet, pour fondre l'encoche dans le footer. */
function Ear({ side }: { side: "left" | "right" }) {
  const at = side === "left" ? "0% 0%" : "100% 0%";
  const mask = `radial-gradient(circle at ${at}, transparent 1.25rem, #000 calc(1.25rem + 0.5px))`;
  return (
    <span
      aria-hidden
      className={`absolute bottom-0 size-5 bg-night ${side === "left" ? "-left-5" : "-right-5"}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

const linkClass = "text-[0.9375rem] text-white/60 transition-colors hover:text-white";

/** Footer noir façon Supaste : encoche inversée, colonnes de liens, nom en très grand. */
export function SiteFooter({ projectLinks }: { projectLinks: { slug: string; title: string }[] }) {
  const pathname = usePathname();
  const onContact = isActive(pathname, "/contact/");
  // Sur l'accueil, le footer s'accroche directement à la bande photo de fin de page.
  const onHome = pathname === "/";

  return (
    <footer className={`relative bg-night text-white ${onContact || onHome ? "" : "mt-36 md:mt-48"}`}>
      {/* Encoche inversée : l'onglet remonte dans la page. */}
      <div className="absolute bottom-full left-1/2 flex h-12 -translate-x-1/2 items-center rounded-t-[1.5rem] bg-night px-6">
        <Ear side="left" />
        <Ear side="right" />
        <a href="#contenu" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
          <ArrowUp className="size-4" aria-hidden />
          Haut de page
        </a>
      </div>

      <div className="container-page pt-11 pb-7 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {onContact ? (
              <p className="max-w-sm text-2xl leading-snug font-semibold tracking-[-0.03em]">
                {site.name}
                <span className="serif mt-1 block text-[1.75rem] font-normal text-white/70">{site.baseline}</span>
              </p>
            ) : (
              <>
                <h2 className="max-w-md text-[clamp(2.125rem,3.6vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.035em]">
                  Un poste, un projet, une question&nbsp;? <span className="serif">Parlons-en.</span>
                </h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  <LiquidButton asChild variant="tinted" surface="dark" size="lg">
                    <a href={`mailto:${site.email}`}>
                      <Mail />
                      Écrire un e-mail
                    </a>
                  </LiquidButton>
                  <LiquidButton asChild surface="dark" size="lg">
                    <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                      <ArrowUpRight />
                      <span className="sr-only">(nouvel onglet)</span>
                    </a>
                  </LiquidButton>
                </div>
              </>
            )}
          </div>

          <nav aria-label="Pied de page" className="grid gap-8 sm:grid-cols-[1fr_1fr_1.45fr] lg:col-span-7">
            <div>
              <h3 className="text-sm font-medium text-white">Navigation</h3>
              <ul className="mt-3 space-y-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={`${linkClass} aria-[current=page]:text-white`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Projets</h3>
              <ul className="mt-3 space-y-2">
                {projectLinks.map((project) => (
                  <li key={project.slug}>
                    <Link href={`/projets/${project.slug}/`} className={linkClass}>
                      {project.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/projets/" className={linkClass}>
                    Tous les projets
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Contact</h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href={`mailto:${site.email}`} className={linkClass}>
                    {site.email}
                  </a>
                </li>
                <li>
                  <a href={site.phoneHref} className={linkClass}>
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    LinkedIn<span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </li>
                <li>
                  <a href={asset(site.cv)} download={site.cvDownloadName} className={linkClass}>
                    CV (PDF)
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Nom en très grand, rogné en bas, comme une signature d'agence. */}
      <div aria-hidden className="overflow-hidden">
        <p className="container-page translate-y-[0.18em] text-center text-[clamp(3.25rem,13.2vw,14.5rem)] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap text-white select-none">
          {site.name}
        </p>
      </div>

      <div className="border-t border-white/10">
        <p className="container-page py-4 text-xs text-white/50">
          © {new Date().getFullYear()} {site.name} · {site.school} {site.schoolYears}
        </p>
      </div>
    </footer>
  );
}
