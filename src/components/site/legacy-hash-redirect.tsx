"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/images";

// L'ancien portfolio utilisait des URL en hash (#/projets/europcar).
// Les liens déjà partagés (CV, LinkedIn) sont redirigés vers les nouvelles routes.
const renamed: Record<string, string> = {
  "/projets/dr-gi": "/projets/dr-gti",
};

export function LegacyHashRedirect() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash.startsWith("#/")) return;
    const legacy = hash.slice(1).replace(/\/$/, "") || "/";
    const target = renamed[legacy] ?? legacy;
    if (target === "/") {
      window.history.replaceState(null, "", `${BASE_PATH}/`);
      return;
    }
    window.location.replace(`${BASE_PATH}${target}/`);
  }, []);

  return null;
}
