"use client";

import * as React from "react";

import { BookOpen, Layers, Settings2, Sparkles } from "lucide-react";

import { NavMain, type NavMainItem } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SidebarLogo } from "@/components/sidebar-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const navMain: NavMainItem[] = [
  {
    title: "Generate",
    url: "/studio",
    icon: Sparkles,
    items: [
      {
        title: "New Sketch",
        url: "/studio",
      },
      {
        title: "History",
        url: "/studio/history",
      },
      {
        title: "Templates",
        url: "/studio/templates",
      },
    ],
  },
  {
    title: "Sketches",
    url: "/studio/sketches/all",
    icon: Layers,
    items: [
      {
        title: "All",
        url: "/studio/sketches/all",
      },
      {
        title: "Starred",
        url: "/studio/sketches/starred",
      },
    ],
  },
  {
    title: "Documentation",
    url: "/studio/documentation/getting-started",
    icon: BookOpen,
    items: [
      {
        title: "Getting Started",
        url: "/studio/documentation/getting-started",
      },
      {
        title: "p5.js Reference",
        url: "https://p5js.org/reference/",
        external: true,
      },
    ],
  },
  {
    title: "Settings",
    url: "/studio/settings/general",
    icon: Settings2,
    items: [
      {
        title: "General",
        url: "/studio/settings/general",
      },
      {
        title: "API Keys",
        url: "/studio/settings/api-keys",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
