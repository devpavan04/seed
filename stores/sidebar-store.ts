"use client";

import { create } from "zustand";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type SidebarState = {
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
};

type SidebarActions = {
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleSidebar: () => void;
};

export type SidebarStore = SidebarState & SidebarActions;

export const useSidebarStore = create<SidebarStore>((set, get) => ({
  open: true,
  openMobile: false,
  isMobile: false,

  setOpen: (open) => {
    set({ open });
    // Persist to cookie
    if (typeof document !== "undefined") {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  },

  setOpenMobile: (openMobile) => {
    set({ openMobile });
  },

  setIsMobile: (isMobile) => {
    set({ isMobile });
  },

  toggleSidebar: () => {
    const { isMobile, open, openMobile } = get();
    if (isMobile) {
      set({ openMobile: !openMobile });
    } else {
      const newOpen = !open;
      set({ open: newOpen });
      // Persist to cookie
      if (typeof document !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${newOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      }
    }
  },
}));

// Selector hooks for optimized re-renders
export const useSidebarOpen = () => useSidebarStore((state) => state.open);
export const useSidebarOpenMobile = () =>
  useSidebarStore((state) => state.openMobile);
export const useSidebarIsMobile = () =>
  useSidebarStore((state) => state.isMobile);
export const useSidebarState = () =>
  useSidebarStore((state) => (state.open ? "expanded" : "collapsed"));

// Legacy-compatible hook that returns all sidebar state and actions
export function useSidebar() {
  const store = useSidebarStore();
  return {
    ...store,
    state: store.open ? ("expanded" as const) : ("collapsed" as const),
  };
}
