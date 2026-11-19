import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://freedocforge.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
          "/dashboard",
          "/dashboard/",
          "/dashboard/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
          "/dashboard",
          "/dashboard/",
          "/dashboard/*",
        ],
      },
      {
        userAgent: "Mediapartners-Google", // AdSense crawler
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
          "/dashboard",
          "/dashboard/",
          "/dashboard/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
