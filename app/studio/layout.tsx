"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  useUser,
} from "@clerk/nextjs";
import {
  BadgeCheck,
  Check,
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  Plus,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import MagnetLines from "@/components/magnet-lines";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayersIcon } from "@/components/ui/layers";
import { PlusIcon } from "@/components/ui/plus";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

// =============================================================================
// Types
// =============================================================================

type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};

type SidebarMenuItemType = {
  title: string;
  url: string;
  icon: React.ElementType;
};

type AppSidebarMenuItemProps = {
  item: SidebarMenuItemType;
  isActive: boolean;
};

// =============================================================================
// Constants
// =============================================================================

const SIDEBAR_MENU_ITEMS: SidebarMenuItemType[] = [
  {
    title: "New Sketch",
    url: "/studio/new",
    icon: PlusIcon,
  },
  {
    title: "Sketches",
    url: "/studio/sketches",
    icon: LayersIcon,
  },
];

// =============================================================================
// Components
// =============================================================================

function AppSidebarMenuItem({ item, isActive }: AppSidebarMenuItemProps) {
  const iconRef = React.useRef<AnimatedIconHandle>(null);

  const handleMouseEnter = () => {
    iconRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    iconRef.current?.stopAnimation();
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link
          href={item.url}
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

function AppSidebarContent() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {SIDEBAR_MENU_ITEMS.map((item) => (
            <AppSidebarMenuItem
              key={item.title}
              item={item}
              isActive={pathname === item.url}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AppSidebarFooter() {
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

// =============================================================================
// Layout
// =============================================================================

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedOut>
        <div className="grid min-h-svh lg:grid-cols-2">
          <div className="bg-background hidden items-center justify-center overflow-hidden lg:flex">
            <MagnetLines
              rows={20}
              columns={20}
              containerSize="max(100vh, 50vw)"
              lineColor="currentColor"
              lineWidth="2px"
              lineHeight="16px"
              baseAngle={0}
              className="text-foreground"
            />
          </div>
          <div className="bg-background flex flex-col items-center justify-center gap-6">
            <SignInButton mode="modal">
              <Button type="button">
                <Plus />
                Create a sketch
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="icon" variant="floating">
            <SidebarContent className="overscroll-contain">
              <AppSidebarContent />
            </SidebarContent>
            <SidebarFooter>
              <AppSidebarFooter />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="h-svh max-h-svh overflow-hidden overscroll-contain py-2 pr-2">
            <div className="bg-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}
