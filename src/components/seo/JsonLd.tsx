import React from "react";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ARTSINLY",
    url: "https://artsinly.com",
    logo: "https://artsinly.com/favicon.ico",
    description:
      "Modern editorial pavilion connecting certified Indian generational artisans directly with contemporary collectors worldwide.",
    founder: {
      "@type": "Person",
      name: "ARTSINLY Curatorial Guild",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "India",
    },
    sameAs: [
      "https://instagram.com/artsinly",
      "https://twitter.com/artsinly",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ARTSINLY",
    url: "https://artsinly.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://artsinly.com/catalog?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artsinly.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  authorName: string;
  authorBio?: string;
  authorJobTitle?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  authorName,
  authorBio,
  authorJobTitle,
}: ArticleSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artsinly.com";
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: imageUrl,
    url: fullUrl,
    datePublished: datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: authorJobTitle || "Master Artisan & Craft Conservator",
      description: authorBio,
      worksFor: {
        "@type": "Organization",
        name: "ARTSINLY Curatorial Guild",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "ARTSINLY",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

