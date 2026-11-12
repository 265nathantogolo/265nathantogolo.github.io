import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { GlassFilter } from "@/components/ui/glass-filter";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { LegacyHashRedirect } from "@/components/site/legacy-hash-redirect";
import { MotionProvider } from "@/components/site/motion-provider";
import { IntroLoader, introHeadScript } from "@/components/site/intro-loader";

// Inter avec l'axe de taille optique (opsz) : coupe Display automatique
// sur les grands titres, coupe Text sur le courant.
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

// Instrument Serif italique : mots mis en valeur dans les titres.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const description =
  "Portfolio de Nathan Togolo, étudiant en Bachelor Stratégie des Marques et Communication à Sup de Pub : identités visuelles, campagnes, réseaux sociaux et benchmarks.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.baseline.replace(/\.$/, "")}`,
    template: `%s · ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.linkedin }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name} · ${site.baseline.replace(/\.$/, "")}`,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : data-intro est posé par le script de l'écran de chargement.
    <html lang="fr" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introHeadScript }} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <IntroLoader />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
        >
          Aller au contenu
        </a>
        <GlassFilter />
        <MotionProvider>
          <SiteHeader />
          <main id="contenu">{children}</main>
          <SiteFooter projectLinks={projects.slice(0, 5).map(({ slug, title }) => ({ slug, title }))} />
        </MotionProvider>
        <LegacyHashRedirect />
      </body>
    </html>
  );
}
