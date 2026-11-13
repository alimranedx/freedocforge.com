import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl =
    isProduction && (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost"))
      ? "https://freedocforge.com"
      : process.env.NEXTAUTH_URL || "https://freedocforge.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/dashboard",
          "/dashboard/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/dashboard",
          "/dashboard/",
        ],
      },
      {
        userAgent: "Mediapartners-Google", // AdSense crawler
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
