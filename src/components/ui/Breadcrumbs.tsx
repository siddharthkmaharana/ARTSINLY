import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { BreadcrumbJsonLd, BreadcrumbItem } from "@/components/seo/JsonLd";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [
    { name: "Home", url: "/" },
    ...items.filter((item) => item.url !== "/"),
  ];

  return (
    <>
      <BreadcrumbJsonLd items={fullItems} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs text-[#8C877E] overflow-x-auto whitespace-nowrap scrollbar-none py-2 ${className}`}
      >
        <ol className="flex items-center space-x-1.5 sm:space-x-2">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;

            return (
              <li key={item.url + index} className="flex items-center space-x-1.5 sm:space-x-2">
                {index === 0 ? (
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 hover:text-[#1E1E1C] transition-colors focus:outline-none focus:underline"
                    aria-label="Home"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span className="sr-only sm:not-sr-only">Home</span>
                  </Link>
                ) : isLast ? (
                  <span
                    className="text-[#1E1E1C] font-medium max-w-[200px] sm:max-w-xs truncate"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-[#1E1E1C] transition-colors focus:outline-none focus:underline max-w-[150px] truncate"
                  >
                    {item.name}
                  </Link>
                )}

                {!isLast && (
                  <ChevronRight className="w-3 h-3 text-[#B8B2A7] shrink-0" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
