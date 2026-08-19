import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/email";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/conta", "/checkout", "/carrinho"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
