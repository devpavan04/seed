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
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import MagnetLines from "@/components/magnet-lines";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
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
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const PAGE_TITLE_BY_PATHNAME: Record<string, string> = {
  "/studio/new": "New Sketch",
  "/studio/sketches": "Sketches",
};

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

function AppBreadcrumb() {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLE_BY_PATHNAME[pathname];

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

function AppSidebarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="justify-center hover:bg-transparent"
          tooltip="Seed"
        >
          <Link href="/">
            <div className="flex items-center justify-center text-lg">🌱</div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
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
            <span className="text-4xl">🌱</span>
            <SignInButton mode="modal">
              <Button variant="default" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
              <AppSidebarHeader />
            </SidebarHeader>
            <SidebarContent className="overscroll-contain">
              <AppSidebarContent />
            </SidebarContent>
            <SidebarFooter>
              <AppSidebarFooter />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="h-svh max-h-svh overflow-hidden overscroll-contain py-2 pr-2">
            <div className="bg-card flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-lg border">
              <header className="flex shrink-0 items-center gap-2 px-4 pt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger className="-ml-1" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Toggle Sidebar <kbd className="ml-1">⌘B</kbd>
                  </TooltipContent>
                </Tooltip>
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <AppBreadcrumb />
              </header>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}
