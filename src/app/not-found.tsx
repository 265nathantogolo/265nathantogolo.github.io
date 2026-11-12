import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LiquidButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[80svh] flex-col items-center justify-center pt-36 text-center">
      <p className="section-pill">Erreur 404</p>
      <h1 className="display-lg mt-6 max-w-3xl text-balance">
        Cette page s&apos;est <span className="serif">perdue.</span>
      </h1>
      <p className="lead mx-auto mt-6 max-w-lg">
        <strong>Elle n&apos;existe pas, ou elle a changé d&apos;adresse.</strong> Les projets, eux, sont toujours là.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <LiquidButton asChild variant="tinted" size="xl">
          <Link href="/projets/">
            Voir les projets
            <ArrowRight />
          </Link>
        </LiquidButton>
        <LiquidButton asChild variant="ink" size="xl">
          <Link href="/">Retour à l&apos;accueil</Link>
        </LiquidButton>
      </div>
    </div>
  );
}
