import { MetadataRoute } from "next";
import { INITIAL_TEMPLATES } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://freedocforge.com";
  const currentDate = new Date();

  // Core Static Marketing & Utility Routes
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic Template Detail Pages for All 60+ World-Class Documents
  const templatePages: MetadataRoute.Sitemap = INITIAL_TEMPLATES.map((tmpl) => {
    // Top-tier pillar templates receive higher crawl priority
    const isTopPillar =
      tmpl.slug.includes("invoice") ||
      tmpl.slug.includes("routine") ||
      tmpl.slug.includes("exam") ||
      tmpl.slug.includes("prescription") ||
      tmpl.slug.includes("diagnostic");

    return {
      url: `${baseUrl}/templates/${tmpl.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: isTopPillar || tmpl.badge ? 0.9 : 0.8,
    };
  });

  return [...staticPages, ...templatePages];
}
