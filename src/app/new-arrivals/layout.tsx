import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fresh From The Kilns & Looms | New Arrivals",
  description:
    "Explore newly fired pottery drops, freshly woven natural textiles, and limited edition seasonal craft releases directly from regional master artisans.",
  alternates: {
    canonical: "/new-arrivals",
  },
  openGraph: {
    title: "Fresh From The Kilns & Looms | ARTSINLY New Arrivals",
    description:
      "Explore newly fired pottery drops, freshly woven natural textiles, and limited edition seasonal craft releases directly from regional master artisans.",
    url: "/new-arrivals",
  },
};

export default function NewArrivalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
