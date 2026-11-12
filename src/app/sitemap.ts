import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { BASE_PATH } from "@/lib/images";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${site.url}${BASE_PATH}`;
  const pages = ["/", "/projets/", "/profil/", "/contact/"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
  const projectPages = projects.map((project) => ({
    url: `${base}/projets/${project.slug}/`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...projectPages];
}
