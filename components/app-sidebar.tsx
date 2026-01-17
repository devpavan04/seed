"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ExternalLink, Layers, Plus } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { SidebarLogo } from "@/components/sidebar-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "New Sketch",
    url: "/studio/new-sketch",
    icon: Plus,
  },
  {
    title: "All Sketches",
    url: "/studio/all-sketches",
    icon: Layers,
  },
  {
    title: "p5.js Reference",
    url: "https://p5js.org/reference/",
    icon: ExternalLink,
    external: true,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={!item.external && pathname === item.url}
                  >
                    {item.external ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
