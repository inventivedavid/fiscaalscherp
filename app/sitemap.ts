import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { ARTICLES } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const SECTORS = ["tech", "productie", "ecommerce"];

  const base: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/tools/dga-salaris-check`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE.url}/benchmarks`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE.url}/kennisbank`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/prijzen`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE.url}/methodologie`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE.url}/disclaimer`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const articles: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE.url}/kennisbank/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const sectors: MetadataRoute.Sitemap = SECTORS.map((s) => ({
    url: `${SITE.url}/voor/${s}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...base, ...articles, ...sectors];
}
