"use client";

import { useEffect } from "react";

import { create } from "zustand";

type PanelView = "split" | "left-expanded" | "right-expanded";

type SplitPanelState = {
  view: PanelView;
};

type SplitPanelActions = {
  setView: (view: PanelView) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
};

export type SplitPanelStore = SplitPanelState & SplitPanelActions;

export const useSplitPanelStore = create<SplitPanelStore>((set, get) => ({
  view: "split",

  setView: (view) => {
    set({ view });
  },

  toggleLeftPanel: () => {
    const { view } = get();
    if (view === "right-expanded") {
      // If right is expanded, go to split first
      set({ view: "split" });
    } else if (view === "left-expanded") {
      set({ view: "split" });
    } else {
      set({ view: "left-expanded" });
    }
  },

  toggleRightPanel: () => {
    const { view } = get();
    if (view === "left-expanded") {
      // If left is expanded, go to split first
      set({ view: "split" });
    } else if (view === "right-expanded") {
      set({ view: "split" });
    } else {
      set({ view: "right-expanded" });
    }
  },
}));

// Keyboard shortcut hook
export function useSplitPanelShortcuts() {
  const { toggleLeftPanel, toggleRightPanel } = useSplitPanelStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + [ to toggle left panel (closes left first)
      if ((event.metaKey || event.ctrlKey) && event.key === "[") {
        event.preventDefault();
        toggleRightPanel();
      }
      // Cmd/Ctrl + ] to toggle right panel (closes right first)
      if ((event.metaKey || event.ctrlKey) && event.key === "]") {
        event.preventDefault();
        toggleLeftPanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleLeftPanel, toggleRightPanel]);
}

// Selector hooks for optimized re-renders
export const useSplitPanelView = () =>
  useSplitPanelStore((state) => state.view);
export const useLeftExpanded = () =>
  useSplitPanelStore((state) => state.view === "left-expanded");
export const useRightExpanded = () =>
  useSplitPanelStore((state) => state.view === "right-expanded");
export const useIsSplitView = () =>
  useSplitPanelStore((state) => state.view === "split");

// Convenience hook for getting all state and actions
export function useSplitPanel() {
  return useSplitPanelStore();
}
