import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grievance Redressal & Consumer Protection Officer",
  description:
    "Statutory nodal and grievance redressal officer details compliant with the Information Technology Act, 2000 and Consumer Protection (E-Commerce) Rules, 2020.",
  alternates: {
    canonical: "/grievance",
  },
  openGraph: {
    title: "Grievance Redressal Officer | ARTSINLY",
    description:
      "Statutory nodal and grievance redressal details under Consumer Protection (E-Commerce) Rules, 2020.",
    url: "/grievance",
  },
};

export default function GrievanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
