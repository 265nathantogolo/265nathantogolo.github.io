import type { CSSProperties } from "react";
import type { ProjectImage } from "@/data/projects";
import { cn } from "@/lib/utils";
import { Img } from "./primitives";

type Row = { kind: "full" | "row"; items: ProjectImage[] };

const WIDE = 1.45;

/**
 * Compose la galerie à partir des proportions réelles des images :
 * - visuels larges : pleine largeur, ou par deux pour casser la répétition ;
 * - formats verticaux : par trois (stories) ou par deux ;
 * - toutes les images d'une ligne partagent la même hauteur.
 */
export function buildRows(images: ProjectImage[]): Row[] {
  const rows: Row[] = [];
  let i = 0;
  let lastFull = false;
  while (i < images.length) {
    const a = images[i];
    if (a.ratio >= WIDE) {
      const b = images[i + 1];
      if (lastFull && b && b.ratio >= WIDE && a.ratio < 2.2 && b.ratio < 2.2) {
        rows.push({ kind: "row", items: [a, b] });
        i += 2;
        lastFull = false;
      } else {
        rows.push({ kind: "full", items: [a] });
        i += 1;
        lastFull = true;
      }
      continue;
    }
    let items = [a];
    i += 1;
    while (i < images.length && images[i].ratio < WIDE) {
      const next = [...items, images[i]];
      const cap = next.every((im) => im.ratio < 0.8) ? 3 : 2;
      if (next.length > cap) break;
      items = next;
      i += 1;
    }
    rows.push({ kind: "row", items });
    lastFull = false;
  }
  return rows;
}

/** largeur max d'une ligne : pas d'agrandissement au-delà de 1,5× la taille d'origine */
function naturalMax(items: ProjectImage[]) {
  const minH = Math.min(...items.map((im) => im.height));
  const sum = items.reduce((s, im) => s + im.ratio, 0);
  return Math.round(sum * minH * 1.5);
}

export function ImageGallery({
  images,
  onOpen,
}: {
  images: ProjectImage[];
  onOpen: (image: ProjectImage) => void;
}) {
  const rows = buildRows(images);
  return (
    <section className="gallery page-pad" aria-label="Galerie du projet">
      {rows.map((row, r) => {
        const sum = row.items.reduce((s, im) => s + im.ratio, 0);
        const single = row.kind === "row" && row.items.length === 1;
        const side = r % 2 === 0 ? "start" : "end";
        const style = {
          "--sum": sum.toFixed(3),
          "--natmax": `${naturalMax(row.items)}px`,
        } as CSSProperties;
        return (
          <div
            key={r}
            className={cn("gallery__row", `gallery__row--${row.kind}`, single && "gallery__row--single", `is-${side}`)}
            style={style}
            data-speed={r % 3 === 1 ? 0.95 : undefined}
          >
            {row.items.map((im) => (
              <figure
                key={im.index}
                className="gallery__fig"
                style={{ flex: `${im.ratio} 1 0` }}
                data-reveal=""
              >
                <button
                  type="button"
                  className="gallery__btn"
                  style={{ aspectRatio: `${im.width} / ${im.height}`, backgroundColor: im.color }}
                  onClick={() => onOpen(im)}
                  data-cursor="Agrandir"
                  aria-label={`Agrandir l'image ${im.index} : ${im.alt}`}
                >
                  <Img
                    image={im}
                    alt=""
                    sizes={`(max-width: 899px) 100vw, ${Math.round((im.ratio / sum) * 92)}vw`}
                  />
                </button>
                <figcaption className="gallery__cap">
                  <span className="gallery__idx">{im.index}</span>
                  {im.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        );
      })}
    </section>
  );
}

/** Pour un projet à image unique : trois recadrages du même visuel. */
export function DetailCrops({ image, onOpen }: { image: ProjectImage; onOpen: () => void }) {
  const crops = [
    { pos: "50% 4%", scale: 2.1, label: "Haut de l'affiche" },
    { pos: "50% 46%", scale: 2.4, label: "Centre de l'affiche" },
    { pos: "50% 92%", scale: 1.7, label: "Bas de l'affiche" },
  ];
  return (
    <section className="crops page-pad" aria-label="Détails">
      <p className="label" data-reveal="">
        Détails
      </p>
      <div className="crops__row">
        {crops.map((c) => (
          <button
            key={c.label}
            type="button"
            className="crops__item"
            data-reveal=""
            data-cursor="Agrandir"
            onClick={onOpen}
            aria-label={`${c.label} — agrandir l'affiche`}
            style={{ backgroundColor: image.color }}
          >
            <Img
              image={image}
              alt=""
              sizes="(max-width: 899px) 100vw, 32vw"
              style={{ objectPosition: c.pos, transform: `scale(${c.scale})`, transformOrigin: c.pos }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
