import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories Behind The Kilns — Craft Heritage Essays & Field Notes",
  description:
    "Curatorial field notes documenting the sacred geometry, earth pigments, and oral poetry of rural guild masters across India.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Stories Behind The Kilns — Craft Heritage Essays | ARTSINLY",
    description:
      "Curatorial field notes documenting the sacred geometry, earth pigments, and oral poetry of rural guild masters across India.",
    url: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
