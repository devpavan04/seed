"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export interface NavSubItem {
  title: string;
  url: string;
  external?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavSubItem[];
}

interface NavMainProps {
  items: NavMainItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <div className="text-sidebar-foreground flex h-8 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sm font-medium">
              {item.icon && <item.icon className="size-4 shrink-0" />}
              <span className="truncate">{item.title}</span>
            </div>
            {item.items?.length ? (
              <SidebarMenuSub>
                {item.items.map((subItem) => {
                  const isActive =
                    !subItem.external && pathname === subItem.url;

                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={isActive}>
                        {subItem.external ? (
                          <a
                            href={subItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{subItem.title}</span>
                          </a>
                        ) : (
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        )}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
