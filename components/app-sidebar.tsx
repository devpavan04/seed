"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavUser } from "@/components/nav-user";
import { SidebarLogo } from "@/components/sidebar-logo";
import { LayersIcon, type LayersIconHandle } from "@/components/ui/layers";
import { PlusIcon, type PlusIconHandle } from "@/components/ui/plus";
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

type IconHandle = PlusIconHandle | LayersIconHandle;

const navItems = [
  {
    title: "New Sketch",
    url: "/studio/new-sketch",
    icon: PlusIcon,
  },
  {
    title: "All Sketches",
    url: "/studio/all-sketches",
    icon: LayersIcon,
  },
] as const;

type NavItem = (typeof navItems)[number];

function NavMenuItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const iconRef = React.useRef<IconHandle>(null);
  const isNewSketch = item.title === "New Sketch";

  const handleMouseEnter = () => {
    iconRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    iconRef.current?.stopAnimation();
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          href={item.url}
          className={isNewSketch && !isActive ? "animate-shimmer" : ""}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <item.icon ref={iconRef} size={16} />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

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
                <NavMenuItem
                  key={item.title}
                  item={item}
                  isActive={pathname === item.url}
                />
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
