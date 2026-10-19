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
