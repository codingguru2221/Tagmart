import { useEffect } from "react";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "product";
  robots?: string;
  jsonLd?: JsonLd;
}

const siteName = "Tagmart Super Market";
const fallbackImage = "/opengraph.jpg";
const logoImage = "/TG%20logo.png";

function getSiteUrl() {
  return (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
}

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
}

export function Seo({
  title,
  description,
  path = "/",
  image = fallbackImage,
  type = "website",
  robots = "index, follow",
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const canonical = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

    document.title = title;
    document.documentElement.lang = "en-IN";

    setMeta("description", description);
    setMeta("robots", robots);
    setMeta("theme-color", "#ff4d1d");

    setMeta("og:site_name", siteName, "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type === "product" ? "product" : "website", "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:image", imageUrl, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl);

    setLink("canonical", canonical);

    document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((script) => script.remove());

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [description, image, jsonLd, path, robots, title, type]);

  return null;
}

export function organizationJsonLd(path = "/") {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteName,
    url: `${siteUrl}${path}`,
    logo: `${siteUrl}${logoImage}`,
    image: `${siteUrl}${fallbackImage}`,
    description:
      "Tagmart Super Market is an online megamart for groceries, fashion, electronics, beauty, home care, stationery, and doorstep delivery.",
    sameAs: ["https://thecodexss.in/"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
