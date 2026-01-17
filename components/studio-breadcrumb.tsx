"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const ROUTE_CONFIG: Record<string, string> = {
  "/studio/new-sketch": "New Sketch",
  "/studio/all-sketches": "All Sketches",
};

export function StudioBreadcrumb(): React.ReactNode {
  const pathname = usePathname();
  const pageTitle = ROUTE_CONFIG[pathname];

  if (!pageTitle) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
