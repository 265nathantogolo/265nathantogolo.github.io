import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { isCategoryId, type CategoryId } from "@/data/categories";
import { prefersReducedMotion } from "./motion";

/**
 * Routeur par hash (#/projets/joon) : le site fonctionne sur n'importe quel
 * hébergement statique, sans configuration serveur.
 * Les changements de page passent par la View Transitions API quand elle existe.
 */

export type View = "grille" | "liste";

export type Route =
  | { name: "home" }
  | { name: "work"; category: CategoryId | null; view: View }
  | { name: "project"; slug: string }
  | { name: "about"; section: string | null }
  | { name: "contact" }
  | { name: "notfound" };

export function parse(hash: string): Route {
  const raw = hash.replace(/^#/, "") || "/";
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query);
  if (parts.length === 0) return { name: "home" };
  if (parts[0] === "projets") {
    if (parts[1]) return { name: "project", slug: decodeURIComponent(parts[1]) };
    const c = params.get("c");
    return {
      name: "work",
      category: isCategoryId(c) ? c : null,
      view: params.get("vue") === "liste" ? "liste" : "grille",
    };
  }
  if (parts[0] === "profil") return { name: "about", section: parts[1] || null };
  if (parts[0] === "contact") return { name: "contact" };
  return { name: "notfound" };
}

export const paths = {
  home: "#/",
  work(category?: CategoryId | null, view?: View) {
    const q = new URLSearchParams();
    if (category) q.set("c", category);
    if (view === "liste") q.set("vue", "liste");
    const s = q.toString();
    return "#/projets" + (s ? `?${s}` : "");
  },
  project: (slug: string) => `#/projets/${slug}`,
  about: (section?: string) => (section ? `#/profil/${section}` : "#/profil"),
  contact: "#/contact",
};

/* ---------- état ---------- */

const currentHash = () => window.location.hash || "#/";
let current: Route = parse(currentHash());
let lastHash = currentHash();
const listeners = new Set<() => void>();
const scrollMemory = new Map<string, number>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRoute() {
  return useSyncExternalStore(subscribe, () => current);
}

/** dernière vue « Projets » visitée, pour un retour qui conserve le filtre */
let lastWorkHash = paths.work();
export const lastWorkPath = () => lastWorkHash;

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void>; ready: Promise<void> };
};

function commit(hash: string, scrollTo: number | null) {
  current = parse(hash);
  lastHash = hash;
  if (current.name === "work") lastWorkHash = hash;
  flushSync(() => listeners.forEach((l) => l()));
  if (scrollTo !== null) window.scrollTo({ top: scrollTo, behavior: "instant" as ScrollBehavior });
}

function withTransition(update: () => void, kind?: string) {
  const doc = document as DocWithVT;
  // onglet masqué : le navigateur suspend le rendu, la transition n'aboutirait pas
  if (!doc.startViewTransition || prefersReducedMotion() || document.visibilityState === "hidden") {
    update();
    return;
  }
  const root = document.documentElement;
  if (kind) root.dataset.vt = kind;
  const t = doc.startViewTransition(update);
  // une transition interrompue (clic rapide, onglet masqué) n'est pas une erreur : la page est déjà à jour
  t.ready.catch(() => {});
  t.finished
    .catch(() => {})
    .finally(() => {
      if (root.dataset.vt === kind) delete root.dataset.vt;
    });
}

export type NavigateOptions = { replace?: boolean; keepScroll?: boolean; kind?: string };

export function navigate(to: string, opts: NavigateOptions = {}) {
  if (to === lastHash) return;
  scrollMemory.set(lastHash, window.scrollY);
  withTransition(() => {
    if (opts.replace) history.replaceState(null, "", to);
    else history.pushState(null, "", to);
    commit(to, opts.keepScroll ? null : 0);
  }, opts.kind ?? "page");
}

/** met l'URL à jour sans transition ni nouveau rendu (ancres internes au profil) */
export function replaceSilently(to: string) {
  history.replaceState(null, "", to);
  current = parse(to);
  lastHash = to;
}

function onHistory() {
  const hash = currentHash();
  if (hash === lastHash) return;
  scrollMemory.set(lastHash, window.scrollY);
  withTransition(() => commit(hash, scrollMemory.get(hash) ?? 0), "page");
}

if (typeof window !== "undefined") {
  history.scrollRestoration = "manual";
  window.addEventListener("popstate", onHistory);
  window.addEventListener("hashchange", onHistory);
}

/* ---------- lien ---------- */

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  /** appelé juste avant la navigation (ex. : nommer l'image partagée) */
  onNavigate?: () => void;
  navOptions?: NavigateOptions;
};

export function Link({ to, onNavigate, navOptions, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate?.();
    navigate(to, navOptions);
  };
  return <a href={to} onClick={handle} {...rest} />;
}
