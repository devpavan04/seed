"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbConfig {
  section?: string;
  sectionUrl?: string;
  page: string;
}

// Map routes to their breadcrumb configuration
const ROUTE_CONFIG: Record<string, BreadcrumbConfig> = {
  // Generate section (no section label - routes are directly under /studio)
  "/studio": { page: "New Sketch" },
  "/studio/history": { page: "History" },
  "/studio/templates": { page: "Templates" },
  // Sketches section
  "/studio/sketches/all": {
    section: "Sketches",
    sectionUrl: "/studio/sketches/all",
    page: "All",
  },
  "/studio/sketches/starred": {
    section: "Sketches",
    sectionUrl: "/studio/sketches/all",
    page: "Starred",
  },
  // Documentation section
  "/studio/documentation/getting-started": {
    section: "Documentation",
    sectionUrl: "/studio/documentation/getting-started",
    page: "Getting Started",
  },
  // Settings section
  "/studio/settings/general": {
    section: "Settings",
    sectionUrl: "/studio/settings/general",
    page: "General",
  },
  "/studio/settings/api-keys": {
    section: "Settings",
    sectionUrl: "/studio/settings/general",
    page: "API Keys",
  },
};

export function StudioBreadcrumb(): React.ReactNode {
  const pathname = usePathname();

  const config = ROUTE_CONFIG[pathname];

  // Fallback for unknown routes
  if (!config) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/studio">Studio</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/studio">Studio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        {config.section && config.sectionUrl && (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={config.sectionUrl}>
                {config.section}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{config.page}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
