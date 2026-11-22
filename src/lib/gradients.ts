/**
 * Fondu opaque → transparent en courbe en S (smootherstep) : pente nulle aux deux
 * bouts, donc aucune ligne de démarcation avec l'aplat ni avec la photo.
 * `rgb` : canaux séparés par des espaces (ex. « 11 11 13 », le noir du footer).
 */
export function smoothFade(rgb: string, direction: "to top" | "to bottom") {
  const steps = 16;
  const stops = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const eased = t * t * t * (t * (t * 6 - 15) + 10);
    return `rgb(${rgb} / ${(1 - eased).toFixed(3)}) ${+(t * 100).toFixed(1)}%`;
  });
  return `linear-gradient(${direction}, ${stops.join(", ")})`;
}
