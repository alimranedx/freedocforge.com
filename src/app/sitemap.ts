import { MetadataRoute } from "next";
import { INITIAL_TEMPLATES } from "@/lib/templates";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://freedocforge.com";
  const currentDate = new Date();

  // Core Static Marketing & Authority Content Routes (excludes private/auth utility pages)
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

  // Core 60+ World-Class System Templates
  const templatePages: MetadataRoute.Sitemap = INITIAL_TEMPLATES.map((tmpl) => {
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

  // Dynamic Discovery: Custom templates created by Admin in MySQL via Prisma ORM
  let customTemplatePages: MetadataRoute.Sitemap = [];
  try {
    const dbTemplates = await prisma.template.findMany({
      select: { slug: true, createdAt: true },
    });
    const initialSlugs = new Set(INITIAL_TEMPLATES.map((t) => t.slug));
    customTemplatePages = dbTemplates
      .filter((dbTmpl) => !initialSlugs.has(dbTmpl.slug))
      .map((dbTmpl) => ({
        url: `${baseUrl}/templates/${dbTmpl.slug}`,
        lastModified: dbTmpl.createdAt || currentDate,
        changeFrequency: "weekly",
        priority: 0.85,
      }));
  } catch (err) {
    // Graceful offline fallback during static pre-rendering
  }

  return [...staticPages, ...templatePages, ...customTemplatePages];
}
