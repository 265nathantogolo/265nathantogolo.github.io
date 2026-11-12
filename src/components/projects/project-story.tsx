import type { ProjectImage, StorySection } from "@/data/projects";
import { imageMeta } from "@/lib/images";
import { cn } from "@/lib/utils";
import { ResponsiveImage } from "@/components/site/responsive-image";
import { Reveal } from "@/components/site/reveal";
import { RichText } from "@/components/site/rich-text";
import { Zoomable } from "./lightbox";

/*
  Mise en page bento des pages projets :
  - chaque visuel garde son format réel et remplit son cadre bord à bord
    (plus de carte grise ni de recadrage) ;
  - plusieurs visuels côte à côte partagent la même hauteur et remplissent
    exactement la largeur (rangée justifiée : largeur proportionnelle au format) ;
  - les paragraphes alternent entre tuiles colorées collées aux visuels et
    grand texte libre ; la disposition se déduit du nombre et du format des
    visuels, pour que les pages ne se ressemblent pas.
  Les couleurs des tuiles viennent de --project / --on-project (page projet).
*/

const ratio = (image: ProjectImage) => {
  const { w, h } = imageMeta(image.id);
  return w / h;
};

/** Hauteur maximale d'une rangée de visuels sur grand écran (px). */
const ROW_MAX = 640;

/** Visuel cliquable à son format réel ; légende révélée au survol (et dans la visionneuse). */
export function ProjectFigure({ image, sizes, className }: { image: ProjectImage; sizes: string; className?: string }) {
  return (
    <Zoomable id={image.id} alt={image.alt} className={cn("rounded-tile bg-surface md:rounded-[1.375rem]", className)}>
      <ResponsiveImage
        id={image.id}
        alt={image.alt}
        sizes={sizes}
        className="h-auto w-full transition duration-700 ease-apple group-hover:scale-[1.025] motion-reduce:group-hover:scale-100"
      />
      {/* Légende visuelle seulement : le bouton porte déjà le texte (« Agrandir : … »). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pt-12 pr-14 pb-4 text-left text-xs leading-snug text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {image.alt}
      </span>
    </Zoomable>
  );
}


const sumOf = (images: ProjectImage[]) => images.reduce((total, image) => total + ratio(image), 0);
/** Format équivalent d'une pile verticale (même largeur) : 1 / Σ(1 / format). */
const stackOf = (images: ProjectImage[]) => 1 / images.reduce((total, image) => total + 1 / ratio(image), 0);

type Breakpoint = "lg" | "xl";

/**
 * Rangée justifiée : chaque visuel prend une part de largeur égale à son format,
 * donc tous ont la même hauteur. Trop basse sur mobile, elle s'empile.
 * `stackFrom` : à partir de ce point de rupture, les visuels s'empilent en colonne
 * (colonne collée à une tuile de texte).
 */
function ImageRow({
  images,
  className,
  stackFrom,
  sizes,
}: {
  images: ProjectImage[];
  className?: string;
  stackFrom?: Breakpoint;
  sizes?: string;
}) {
  const sum = sumOf(images);
  // Sur mobile (~343 px), une rangée plus basse que ~155 px devient illisible : on empile.
  const stack = sum > 2.2;
  return (
    <div
      className={cn(
        "flex gap-3 md:gap-4",
        stack && "max-sm:flex-col",
        stackFrom === "lg" && "lg:flex-col",
        stackFrom === "xl" && "xl:flex-col",
        className,
      )}
      // Hauteur plafonnée : on réduit la largeur de la rangée plutôt que de rogner.
      style={stackFrom ? undefined : { maxWidth: `${Math.round(ROW_MAX * sum + 16 * (images.length - 1))}px` }}
    >
      {images.map((image) => (
        <div
          key={image.id}
          className={cn(
            "min-w-0 flex-[var(--r)_1_0%]",
            stack && "max-sm:flex-none",
            stackFrom === "lg" && "lg:flex-none",
            stackFrom === "xl" && "xl:flex-none",
          )}
          style={{ "--r": ratio(image).toFixed(4) } as React.CSSProperties}
        >
          <ProjectFigure
            image={image}
            sizes={sizes ?? `(min-width: 1280px) ${Math.round((1200 * ratio(image)) / sum)}px, (min-width: 640px) ${Math.round((100 * ratio(image)) / sum)}vw, 92vw`}
          />
        </div>
      ))}
    </div>
  );
}

type TileTone = "soft" | "accent" | "night";

const tileTone: Record<TileTone, string> = {
  soft: "bg-[color-mix(in_srgb,var(--project)_13%,white)] text-foreground",
  accent: "bg-[var(--project)] text-[var(--on-project)]",
  night: "bg-night text-white",
};

type FontSize = 22 | 19 | 17;

// Taille du texte de tuile à partir du point de rupture où la tuile passe à côté des visuels.
const tileFont: Record<Breakpoint, Record<FontSize, string>> = {
  lg: { 22: "lg:text-[1.375rem] lg:leading-[1.5]", 19: "lg:text-[1.1875rem] lg:leading-[1.55]", 17: "" },
  xl: { 22: "xl:text-[1.375rem] xl:leading-[1.5]", 19: "xl:text-[1.1875rem] xl:leading-[1.55]", 17: "" },
};

/** Tuile de texte du bento : grand numéro du paragraphe en haut, texte en bas. */
function TextTile({
  section,
  index,
  total,
  tone,
  font,
  className,
}: {
  section: StorySection;
  index: number;
  total: number;
  tone: TileTone;
  font?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col justify-between gap-8 rounded-card p-7 md:p-9", tileTone[tone], className)}>
      <p className="flex items-baseline gap-2">
        <span className="serif text-[3.5rem] leading-none md:text-[4.5rem]">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-sm font-medium tabular-nums opacity-60">/ {String(total).padStart(2, "0")}</span>
      </p>
      <p className={cn("text-pretty text-[1.0625rem] leading-[1.6]", font)}>
        <RichText text={section.text} />
      </p>
    </div>
  );
}

type Fit = { breakpoint: Breakpoint; t: number; share: number; arrangement: "row" | "stack"; font: FontSize };

/** Estimation : le paragraphe tient-il dans une tuile à côté de ses visuels, à cette largeur de page ? */
function tileFits(chars: number, font: FontSize, t: number, share: number, gaps: number, width: number) {
  const height = (width - 16 * gaps) / (t + share);
  const tileWidth = t * height;
  const pad = 72;
  const lines = Math.ceil((chars * font * 0.53) / (tileWidth - pad)) + 1;
  return height <= ROW_MAX && lines * font * 1.55 + pad + 56 <= height;
}

/**
 * Tuile à côté des visuels : premier point de rupture où le texte y tient, en
 * rangée ou (deux visuels paysage) en pile verticale, avec le plus grand texte possible.
 */
function sideBySide(section: StorySection, images: ProjectImage[]): Fit | null {
  const chars = section.text.replace(/\*/g, "").length;
  const sum = sumOf(images);
  // Pile verticale : seulement deux visuels paysage (une pile de verticaux ferait une colonne trop étroite).
  const stackable = images.length === 2 && images.every((image) => ratio(image) >= 1.2);
  const arrangements: Fit["arrangement"][] = stackable ? ["stack", "row"] : ["row"];
  for (const [breakpoint, width] of [["lg", 944], ["xl", 1200]] as const) {
    for (const arrangement of arrangements) {
      const share = arrangement === "row" ? sum : stackOf(images);
      const gaps = arrangement === "row" ? images.length : 1;
      for (const font of [22, 19, 17] as const) {
        for (let t = Math.max(1.875 - share, 0.6); t <= 2.6; t += 0.05) {
          // Les visuels gardent au moins un tiers de la largeur.
          if (share / (t + share) < 0.34) break;
          if (tileFits(chars, font, t, share, gaps, width)) return { breakpoint, t, share, arrangement, font };
        }
      }
    }
  }
  return null;
}

/**
 * Un paragraphe du récit et ses visuels, en bento. Trois dispositions :
 * - tuile colorée collée aux visuels, même hauteur (quand le texte y tient) ;
 * - grand texte libre puis rangée de visuels ;
 * - texte seul, en grand.
 */
export function StoryBlock({ section, images, index, total }: { section: StorySection; images: ProjectImage[]; index: number; total: number }) {
  const first = index === 0;

  if (images.length === 0) {
    return (
      <Reveal className="mx-auto max-w-3xl">
        <p className="text-pretty text-[1.25rem] leading-[1.55] font-medium tracking-[-0.015em] md:text-[1.625rem]">
          <RichText text={section.text} />
        </p>
      </Reveal>
    );
  }

  const fit = sideBySide(section, images);
  // Le premier paragraphe reste en grand texte ; ensuite, tuile un paragraphe sur deux
  // (ou dès qu'il n'a qu'un visuel), quand le texte y tient.
  if (fit && !first && (index % 2 === 1 || images.length === 1)) {
    const textRight = section.layout === "split-right" || (section.layout !== "split-left" && index % 4 === 3);
    const lg = fit.breakpoint === "lg";
    const tone = (["accent", "soft", "night"] as const)[Math.floor(index / 2) % 3];
    const share = fit.share / (fit.t + fit.share);
    return (
      <Reveal>
        <div
          className={cn(
            "flex flex-col gap-3 md:gap-4",
            lg ? "lg:flex-row" : "xl:flex-row",
            textRight && (lg ? "lg:flex-row-reverse" : "xl:flex-row-reverse"),
          )}
          style={{ "--t": fit.t.toFixed(3), "--s": fit.share.toFixed(3) } as React.CSSProperties}
        >
          <TextTile
            section={section}
            index={index}
            total={total}
            tone={tone}
            font={tileFont[fit.breakpoint][fit.font]}
            className={cn("min-w-0", lg ? "lg:flex-[var(--t)_1_0%]" : "xl:flex-[var(--t)_1_0%]")}
          />
          <div className={cn("min-w-0", lg ? "lg:flex-[var(--s)_1_0%]" : "xl:flex-[var(--s)_1_0%]")}>
            {fit.arrangement === "stack" ? (
              <ImageRow
                images={images}
                stackFrom={fit.breakpoint}
                sizes={`(min-width: ${lg ? 1024 : 1280}px) ${Math.round(1200 * share)}px, (min-width: 640px) 50vw, 92vw`}
              />
            ) : (
              <ImageRow images={images} className="mx-auto" />
            )}
          </div>
        </div>
      </Reveal>
    );
  }

  // Ouverture avec un seul visuel vertical ou carré : grand texte et visuel côte à côte.
  if (first && images.length === 1 && ratio(images[0]) < 1.25) {
    const r = ratio(images[0]);
    return (
      <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-pretty text-[1.125rem] leading-[1.55] font-medium tracking-[-0.015em] md:text-[1.625rem] md:leading-[1.5]">
            <RichText text={section.text} />
          </p>
        </Reveal>
        <Reveal className="w-full">
          <div className="mx-auto" style={{ maxWidth: `${Math.round(ROW_MAX * r)}px` }}>
            <ProjectFigure image={images[0]} sizes={`(min-width: 1024px) ${Math.min(600, Math.round(ROW_MAX * r))}px, 92vw`} />
          </div>
        </Reveal>
      </div>
    );
  }

  // Grand texte libre, alterné à gauche / à droite, puis la rangée de visuels.
  const alignRight = !first && index % 2 === 0;
  return (
    <div>
      <Reveal className={cn("max-w-3xl", alignRight && "lg:ml-auto")}>
        <p
          className={cn(
            "text-pretty text-[1.125rem] leading-[1.6] text-foreground/80 md:text-[1.3125rem]",
            first && "font-medium tracking-[-0.015em] text-foreground md:text-[1.625rem] md:leading-[1.5]",
          )}
        >
          <RichText text={section.text} />
        </p>
      </Reveal>
      <Reveal className="mt-8 md:mt-12">
        <ImageRow images={images} className={cn(alignRight ? "ml-auto" : "mr-auto", images.length > 1 && "mx-auto")} />
      </Reveal>
    </div>
  );
}

/** Chiffres clés en petites tuiles bento, de tons alternés. */
export function FactTiles({ facts }: { facts: { label: string; value: string }[] }) {
  const factTones: TileTone[] = ["accent", "soft", "soft", "night"];
  return (
    <dl className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
      {facts.map((fact, i) => (
        <Reveal key={fact.label} delay={0.05 * i}>
          <div className={cn("flex h-full min-h-44 flex-col justify-between gap-6 rounded-card p-6 md:p-7", tileTone[factTones[i % factTones.length]])}>
            <dt className="text-xs font-medium tracking-wide uppercase opacity-75">{fact.label}</dt>
            <dd className="text-[1.125rem] leading-snug font-semibold tracking-[-0.015em]">{fact.value}</dd>
          </div>
        </Reveal>
      ))}
    </dl>
  );
}

/**
 * Galerie : une tuile vitrine de la couleur du projet, où jusqu'à trois visuels
 * posés de biais débordent du bord (clic = visionneuse), puis les autres en
 * mosaïque, chacun à son format réel.
 */
export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  // Les formats verticaux font de plus belles cartes en éventail.
  const fan = [...images].sort((a, b) => ratio(a) - ratio(b)).slice(0, 3);
  const mosaic = images.filter((image) => !fan.includes(image));
  const angles = fan.length === 1 ? [-6] : fan.length === 2 ? [-9, 7] : [-11, 2, 13];
  const lefts = fan.length === 1 ? [30] : fan.length === 2 ? [12, 48] : [2, 30, 58];

  return (
    <>
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-card bg-[var(--project)] text-[var(--on-project)]">
          <div className="relative z-10 p-7 md:absolute md:inset-y-0 md:left-0 md:flex md:w-[42%] md:flex-col md:justify-between md:p-10">
            <p className="text-sm font-medium opacity-75">Galerie</p>
            <div className="mt-6 md:mt-0">
              <h2 id="visuels-title" className="display-md">
                Autres <span className="serif">visuels.</span>
              </h2>
              <p className="mt-4 text-sm opacity-80">
                {images.length} visuel{images.length > 1 ? "s" : ""} de {title} · cliquer pour agrandir
              </p>
            </div>
          </div>
          <div className="relative h-[19rem] sm:h-[24rem] md:ml-[42%] md:h-[34rem]">
            {fan.map((image, i) => {
              const r = ratio(image);
              return (
                <div
                  key={image.id}
                  className="absolute top-[14%] transition-transform duration-500 ease-apple hover:z-10 hover:-translate-y-3 motion-reduce:hover:translate-y-0"
                  style={{
                    left: `${lefts[i]}%`,
                    rotate: `${angles[i]}deg`,
                    // Cartes verticales dimensionnées en hauteur (elles débordent du bas), paysages en largeur.
                    ...(r < 1.2 ? { height: "100%", aspectRatio: `${r}` } : { width: "64%", aspectRatio: `${r}` }),
                  }}
                >
                  <Zoomable
                    id={image.id}
                    alt={image.alt}
                    className="size-full rounded-tile shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] md:rounded-[1.375rem]"
                  >
                    <ResponsiveImage id={image.id} alt={image.alt} sizes="(min-width: 768px) 24rem, 50vw" className="size-full object-cover" />
                  </Zoomable>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Peu de visuels : une rangée justifiée ; au-delà, une mosaïque en colonnes. */}
      {mosaic.length > 0 && mosaic.length <= 3 && (
        <Reveal className="mt-3 md:mt-4">
          <ImageRow images={mosaic} className="mx-auto" />
        </Reveal>
      )}
      {mosaic.length > 3 && (
        <ul className={cn("mt-3 columns-2 gap-3 md:mt-4 md:gap-4", mosaic.length > 4 && "md:columns-3")}>
          {mosaic.map((image, i) => (
            <li key={image.id} className="mb-3 break-inside-avoid md:mb-4">
              <Reveal delay={0.04 * (i % 3)}>
                <ProjectFigure image={image} sizes="(min-width: 1280px) 390px, (min-width: 768px) 31vw, 46vw" />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
