"use client";

import { useTheme } from "next-themes";

import { useClerk, useUser } from "@clerk/nextjs";
import {
  BadgeCheck,
  Check,
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const { setTheme, theme } = useTheme();

  if (!user) {
    return null;
  }

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : (user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() ?? "U");

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent data-[state=open]:bg-transparent"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.fullName ?? "User"}
                />
                <AvatarFallback className="rounded-full">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">
                  {user.fullName ?? "User"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  Free
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName ?? "User"}
                  />
                  <AvatarFallback className="rounded-full">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.fullName ?? "User"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Free
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => openUserProfile()}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun />
                Light mode
                {theme === "light" && (
                  <Check className="text-primary ml-auto size-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon />
                Dark mode
                {theme === "dark" && (
                  <Check className="text-primary ml-auto size-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor />
                System
                {theme === "system" && (
                  <Check className="text-primary ml-auto size-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
