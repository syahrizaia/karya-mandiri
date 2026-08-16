import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://karya-mandiri.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/general-dashboard",
    "/jobs",
    "/services",
    "/news",
    "/how-it-works",
    "/training",
    "/security",
    "/help-center",
    "/terms",
    "/privacy",
    "/contact",
    "/download",
    "/login",
    "/register",
  ];

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
