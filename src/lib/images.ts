import manifestJson from "@/data/images.generated.json";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Préfixe un chemin de /public avec le basePath GitHub Pages. */
export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}

type ImageEntry = { w: number; h: number; widths: number[] };
const manifest = manifestJson as Record<string, ImageEntry>;

export function imageMeta(id: string): ImageEntry {
  const entry = manifest[id];
  if (!entry) throw new Error(`Image absente du manifeste : ${id}`);
  return entry;
}

/** URL de la plus petite variante ≥ `width`, sinon la plus grande. */
export function imageSrc(id: string, width = 1280) {
  const { widths } = imageMeta(id);
  const w = widths.find((v) => v >= width) ?? widths[widths.length - 1];
  return asset(`/images/${id}-${w}.webp`);
}

export function imageSrcSet(id: string) {
  return imageMeta(id)
    .widths.map((w) => `${asset(`/images/${id}-${w}.webp`)} ${w}w`)
    .join(", ");
}
