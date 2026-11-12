import type { Metadata } from "next";

import { projects, skills } from "@/data/projects";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";

export const metadata: Metadata = {
  title: "Projets",
  description: `${projects.length} projets de Nathan Togolo classés par compétence : création graphique, réseaux sociaux, campagnes, copywriting et benchmark.`,
  alternates: { canonical: "/projets/" },
  openGraph: { url: "/projets/" },
};

export default function ProjectsPage() {
  return (
    <div className="container-page pt-36 md:pt-44">
      <header className="mx-auto max-w-3xl text-center">
        <p className="section-pill tabular-nums">Index · {projects.length} projets</p>
        <h1 className="display-lg mt-5">
          Tous les <span className="serif">projets.</span>
        </h1>
        <p className="lead mx-auto mt-6 max-w-xl">
          {projects.length} projets classés selon les {skills.length} compétences du CV. Filtrez par compétence, ou passez en vue liste.
        </p>
      </header>

      <div className="mt-14 md:mt-20">
        <ProjectsExplorer />
      </div>
    </div>
  );
}
