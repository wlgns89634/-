"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbProps {
  productTitle?: string;
}

export default function CustomBreadcrumb({ productTitle }: BreadcrumbProps) {
  const pathname = usePathname();
  const pathnames = pathname.split("/").filter(Boolean);

  const displayNames = pathnames
    .map((p) => {
      if (p === "category") return "";
      return p.charAt(0).toUpperCase() + p.slice(1);
    })
    .filter(Boolean);

  if (productTitle) {
    displayNames.push(productTitle);
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {displayNames.map((name, index) => {
          const isLast = index === displayNames.length - 1;
          const href = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
