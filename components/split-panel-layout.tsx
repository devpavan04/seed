"use client";

import { Code, SlidersHorizontal, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UnderlineTabs,
  UnderlineTabsContent,
  UnderlineTabsList,
  UnderlineTabsTrigger,
} from "@/components/underline-tabs";
import { useIsMacOS } from "@/hooks/use-ismacos";
import { cn } from "@/lib/utils";
import {
  useSplitPanelShortcuts,
  useSplitPanelStore,
} from "@/stores/split-panel-store";

function PanelTab({
  position,
  action,
  onClick,
  tooltipSide,
  shortcutKey,
}: {
  position: "left" | "right";
  action: "collapse" | "expand";
  onClick: () => void;
  tooltipSide: "left" | "right";
  shortcutKey: "[" | "]";
}) {
  const isMacOS = useIsMacOS();
  const label = action === "collapse" ? "Close" : "Open";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "bg-border/50 hover:bg-muted-foreground/30 absolute top-1/2 z-10 flex h-8 w-1 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors",
            position === "right" ? "right-0" : "left-0"
          )}
        >
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        {label} {isMacOS ? "⌘" : "Ctrl+"}
        {shortcutKey}
      </TooltipContent>
    </Tooltip>
  );
}

function LeftContainer() {
  const { view, toggleRightPanel } = useSplitPanelStore();
  const showCollapseTab = view === "split";

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-hidden p-3">
        <UnderlineTabs defaultValue="chat" className="flex h-full flex-col">
          <UnderlineTabsList>
            <Tooltip>
              <TooltipTrigger asChild>
                <UnderlineTabsTrigger value="chat">
                  <Sparkles />
                </UnderlineTabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Chat</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <UnderlineTabsTrigger value="controls">
                  <SlidersHorizontal />
                </UnderlineTabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Controls</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <UnderlineTabsTrigger value="code">
                  <Code />
                </UnderlineTabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Code</TooltipContent>
            </Tooltip>
          </UnderlineTabsList>
          <UnderlineTabsContent
            value="chat"
            className="mt-4 flex-1"
          ></UnderlineTabsContent>
          <UnderlineTabsContent
            value="controls"
            className="mt-4 flex-1"
          ></UnderlineTabsContent>
          <UnderlineTabsContent
            value="code"
            className="mt-4 flex-1"
          ></UnderlineTabsContent>
        </UnderlineTabs>
      </div>
      {showCollapseTab && (
        <PanelTab
          position="right"
          action="collapse"
          onClick={toggleRightPanel}
          tooltipSide="left"
          shortcutKey="["
        />
      )}
    </div>
  );
}

function RightContainer() {
  const { view, toggleLeftPanel } = useSplitPanelStore();
  const showCollapseTab = view === "split";

  return (
    <div className="relative flex h-full flex-1 items-center justify-center p-3">
      {showCollapseTab && (
        <PanelTab
          position="left"
          action="collapse"
          onClick={toggleLeftPanel}
          tooltipSide="right"
          shortcutKey="]"
        />
      )}
    </div>
  );
}

export function SplitPanelLayout() {
  const { view, setView } = useSplitPanelStore();

  // Register keyboard shortcuts
  useSplitPanelShortcuts();

  const restoreSplit = () => setView("split");

  const isLeftVisible = view !== "right-expanded";
  const isRightVisible = view !== "left-expanded";

  // Account for gap-2 (0.5rem = 8px) in width calculation
  const splitWidth = "calc(50% - 4px)";

  return (
    <div className="relative flex h-full gap-2">
      <AnimatePresence initial={false} mode="popLayout">
        {isLeftVisible && (
          <motion.div
            key="left-panel"
            layout
            initial={{ opacity: 0, x: -40 }}
            animate={{
              opacity: 1,
              x: 0,
              width: view === "left-expanded" ? "100%" : splitWidth,
            }}
            exit={{ opacity: 0, x: -40 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
              layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
            }}
            className="border-border bg-card h-full shrink-0 overflow-hidden rounded-lg border"
          >
            <LeftContainer />
          </motion.div>
        )}

        {isRightVisible && (
          <motion.div
            key="right-panel"
            layout
            initial={{ opacity: 0, x: 40 }}
            animate={{
              opacity: 1,
              x: 0,
              width: view === "right-expanded" ? "100%" : splitWidth,
            }}
            exit={{ opacity: 0, x: 40 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
              layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
            }}
            className="border-border bg-card h-full shrink-0 overflow-hidden rounded-lg border"
          >
            <RightContainer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand tabs when a panel is collapsed */}
      {view === "right-expanded" && (
        <PanelTab
          position="left"
          action="expand"
          onClick={restoreSplit}
          tooltipSide="right"
          shortcutKey="["
        />
      )}

      {view === "left-expanded" && (
        <PanelTab
          position="right"
          action="expand"
          onClick={restoreSplit}
          tooltipSide="left"
          shortcutKey="]"
        />
      )}
    </div>
  );
}
