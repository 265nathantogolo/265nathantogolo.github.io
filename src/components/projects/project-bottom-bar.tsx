"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { LiquidButton } from "@/components/ui/button";
import { GlassSurface } from "@/components/ui/glass-surface";

type BottomBarProps = {
  project: Pick<Project, "number" | "title">;
  previous: Pick<Project, "slug" | "title">;
  next: Pick<Project, "slug" | "title" | "number">;
};

/** Barre fixe en verre liquide : projet courant, retour au récit, précédent / suivant (teinte du projet). */
export function ProjectBottomBar({ project, previous, next }: BottomBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 900;
      setVisible(window.scrollY > window.innerHeight * 0.8 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-3 z-40 transition duration-500 ease-apple md:bottom-4",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
      inert={!visible}
    >
      <div className="container-page flex justify-center">
        <GlassSurface
          as="nav"
          aria-label="Navigation du projet"
          className="flex h-16 w-full max-w-2xl items-center gap-2 rounded-full bg-white/75 pr-2 pl-5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]"
        >
          <p className="min-w-0 flex-1 truncate text-sm font-semibold">
            <span className="mr-2 text-ink tabular-nums">{project.number}</span>
            {project.title}
          </p>
          <a
            href="#a-propos"
            className="hidden rounded-full px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground sm:inline-flex"
          >
            Le projet
          </a>
          <LiquidButton asChild size="icon" aria-label={`Projet précédent : ${previous.title}`}>
            <Link href={`/projets/${previous.slug}/`}>
              <ArrowLeft />
            </Link>
          </LiquidButton>
          <LiquidButton asChild variant="tinted" size="lg">
            <Link href={`/projets/${next.slug}/`}>
              <span className="hidden sm:inline">Projet suivant</span>
              <span className="sr-only sm:hidden">Projet suivant : {next.title}</span>
              <ArrowRight aria-hidden />
            </Link>
          </LiquidButton>
        </GlassSurface>
      </div>
    </div>
  );
}
