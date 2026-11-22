import { statSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ArrowUpRight, Download, Phone } from "lucide-react";

import { site } from "@/data/site";
import { smoothFade } from "@/lib/gradients";
import { asset, imageMeta, imageSrc, imageSrcSet } from "@/lib/images";
import { LiquidButton } from "@/components/ui/button";
import { BlurIn, BlurText } from "@/components/site/blur-text";
import { CopyEmail } from "@/components/site/copy-email";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contacter Nathan Togolo : e-mail, téléphone, LinkedIn et CV à télécharger.",
  alternates: { canonical: "/contact/" },
  openGraph: { url: "/contact/" },
};

// Taille réelle du CV, lue au moment du build (plus de valeur écrite en dur).
function cvSize() {
  try {
    const bytes = statSync(path.join(process.cwd(), "public", site.cv)).size;
    return `${(bytes / 1024 / 1024).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo`;
  } catch {
    return null;
  }
}

export default function ContactPage() {
  const size = cvSize();
  const [user, domain] = site.email.split("@");

  const photo = imageMeta("brand/hero-times");

  return (
    <section data-hero="dark" aria-labelledby="contact-title" className="relative isolate overflow-hidden text-white">
      {/*
        Photo de Times Square, cadrée plus bas que sur l'accueil (écrans, bus, taxi),
        sous un voile bleu nuit plus dense à gauche, côté texte. En bas, elle se
        fond dans le footer noir avec la même courbe douce que la fin de l'accueil.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc("brand/hero-times", 1920)}
        srcSet={imageSrcSet("brand/hero-times")}
        sizes="100vw"
        width={photo.w}
        height={photo.h}
        alt=""
        fetchPriority="high"
        className="hero-bg absolute inset-0 -z-20 size-full object-cover object-[50%_62%] max-md:object-[40%_55%]"
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: [
            // assez dense jusqu'au bout de la grande adresse e-mail (écrans vifs à droite)
            "linear-gradient(to right, rgba(4,8,22,0.74) 0%, rgba(4,8,22,0.58) 40%, rgba(4,8,22,0.44) 70%, rgba(4,8,22,0.26) 100%)",
            "linear-gradient(to bottom, rgba(4,8,22,0.45) 0%, rgba(4,8,22,0.15) 26%, rgba(4,8,22,0.2) 55%, rgba(4,8,22,0) 75%)",
          ].join(", "),
        }}
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[38%]" style={{ background: smoothFade("11 11 13", "to top") }} />

      <div className="container-page flex min-h-svh flex-col justify-center pt-36 pb-32 md:pb-44">
        <BlurIn>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-white/80">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {site.availability}
          </p>
        </BlurIn>
        <h1 id="contact-title" className="display-xl mt-6 max-w-5xl">
          <BlurText text="Travaillons" delay={100} />{" "}
          <span className="serif">
            <BlurText text="ensemble." delay={350} />
          </span>
        </h1>
        <BlurIn delay={600} className="mt-6 max-w-xl">
          <p className="text-lg leading-relaxed text-white/75 md:text-xl">{site.search}</p>
        </BlurIn>

        {/* L'adresse en très grand, cliquable, avec copie. */}
        <BlurIn delay={750} className="mt-14 md:mt-20">
          <p className="text-sm text-white/60">Écrire un e-mail</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-2 block text-[clamp(1.5rem,5.4vw,4.75rem)] leading-[1.05] font-semibold tracking-[-0.04em] break-words [text-shadow:0_2px_28px_rgba(4,8,22,0.75)] transition-colors hover:text-white/80"
          >
            {user}
            <wbr />
            <span className="text-white/65">@{domain}</span>
          </a>
          <div className="mt-6">
            <CopyEmail email={site.email} surface="dark" />
          </div>
        </BlurIn>

        <BlurIn delay={900} className="mt-14 md:mt-20">
          {/* Boutons posés directement sur l'image : le verre liquide a de quoi déformer. */}
          <div className="grid border-t border-white/15 sm:grid-cols-3">
            <div className="flex flex-col gap-4 py-6 sm:pr-6 md:py-8">
              <p className="text-sm text-white/60">Téléphone</p>
              <LiquidButton asChild variant="tinted" surface="dark" size="lg" className="w-fit">
                <a href={site.phoneHref}>
                  <Phone />
                  {site.phone}
                </a>
              </LiquidButton>
            </div>
            <div className="flex flex-col gap-4 border-t border-white/15 py-6 sm:border-t-0 sm:border-l sm:pl-6 md:py-8">
              <p className="text-sm text-white/60">LinkedIn</p>
              <LiquidButton asChild surface="dark" size="lg" className="w-fit">
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  Voir le profil
                  <ArrowUpRight />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              </LiquidButton>
            </div>
            <div className="flex flex-col gap-4 border-t border-white/15 py-6 sm:border-t-0 sm:border-l sm:pl-6 md:py-8">
              <p className="text-sm text-white/60">CV{size && ` · PDF, ${size}`}</p>
              <LiquidButton asChild surface="dark" size="lg" className="w-fit">
                <a href={asset(site.cv)} download={site.cvDownloadName}>
                  <Download />
                  Télécharger
                </a>
              </LiquidButton>
            </div>
          </div>
        </BlurIn>
      </div>
    </section>
  );
}
