/**
 * Élément partagé entre deux pages (View Transitions) : l'image cliquée
 * devient l'image de couverture du projet. Un seul élément peut porter le nom.
 */
export function setSharedElement(el: Element | null | undefined) {
  document.querySelectorAll(".vt-hero").forEach((e) => e.classList.remove("vt-hero"));
  el?.classList.add("vt-hero");
}
