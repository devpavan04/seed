"use client";

import { useChat } from "@ai-sdk/react";
import { type CodeHighlighterPlugin, createCodePlugin } from "@streamdown/code";
import { DefaultChatTransport } from "ai";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  CodeIcon,
  CopyIcon,
  ExternalLinkIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, {
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { ConversationEmptyState } from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMacOS } from "@/hooks/use-ismacos";
import { type SeedAgentUIMessage } from "@/lib/seed-agent";
import { cn } from "@/lib/utils";
import {
  useSplitPanelShortcuts,
  useSplitPanelStore,
} from "@/stores/split-panel-store";

// =============================================================================
// Code Plugin (Syntax Highlighting)
// =============================================================================

const baseCodePlugin = createCodePlugin({
  themes: ["vitesse-light", "vitesse-dark"],
});

const codePlugin: CodeHighlighterPlugin = {
  ...baseCodePlugin,
  highlight: (options, callback) => {
    const normalizedLang = options.language.replace(/_+$/, "");
    const language = baseCodePlugin.supportsLanguage(
      normalizedLang as typeof options.language
    )
      ? normalizedLang
      : "plaintext";
    return baseCodePlugin.highlight(
      { ...options, language: language as typeof options.language },
      callback
    );
  },
};

// =============================================================================
// Example Prompts
// =============================================================================

const examplePrompts = [
  "Flow field of particles following Perlin noise currents, leaving trailing paths like wind through tall grass",
  "Recursive tree using L-systems that grows and sways, with leaves that change color through the seasons",
  "Reaction-diffusion pattern morphing between animal print textures — leopard spots dissolving into zebra stripes",
  "Voronoi diagram of glowing cells that pulse and divide like organisms under a microscope",
];

// =============================================================================
// Streaming Context (for auto-collapse behavior)
// =============================================================================

const StreamingContext = React.createContext<boolean>(false);

// =============================================================================
// Collapsible Code Block
// =============================================================================

const AUTO_COLLAPSE_DELAY = 1000;

function CollapsibleCodeBlock({
  children,
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  const [isOpen, setIsOpen] = useState(true);
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);
  const isStreaming = React.useContext(StreamingContext);

  useEffect(() => {
    if (!isStreaming && isOpen && !hasAutoCollapsed) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        setHasAutoCollapsed(true);
      }, AUTO_COLLAPSE_DELAY);

      return () => clearTimeout(timer);
    }
  }, [isStreaming, isOpen, hasAutoCollapsed]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full overflow-hidden rounded-md border"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 p-3">
        <div className="flex items-center gap-2">
          <CodeIcon className="text-muted-foreground size-4" />
          <span className="text-sm font-medium">Code</span>
        </div>
        <ChevronDownIcon
          className={cn(
            "text-muted-foreground size-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden border-t **:rounded-none **:border-0">
        <pre {...props}>{children}</pre>
      </CollapsibleContent>
    </Collapsible>
  );
}

const streamdownComponents = {
  pre: CollapsibleCodeBlock,
};

// =============================================================================
// Link Safety Modal
// =============================================================================

interface LinkSafetyModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function LinkSafetyModal({
  url,
  isOpen,
  onClose,
  onConfirm,
}: LinkSafetyModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={onClose}
    >
      <div className="bg-background/80 fixed inset-0 backdrop-blur-sm" />
      <div
        className="bg-card border-border relative w-full max-w-md rounded-t-lg border p-6 shadow-lg sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4"
        >
          <XIcon className="size-5" />
        </button>
        <div className="mb-4 flex items-center gap-2">
          <ExternalLinkIcon className="size-5" />
          <h2 className="text-lg font-semibold">Open external link?</h2>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">
          You&apos;re about to visit an external website.
        </p>
        <div className="bg-muted mb-4 overflow-hidden rounded-md p-3">
          <p className="truncate font-mono text-sm">{url}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleCopy}>
            <CopyIcon className="mr-2 size-4" />
            {copied ? "Copied!" : "Copy link"}
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            <ExternalLinkIcon className="mr-2 size-4" />
            Open link
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const renderLinkSafetyModal = (props: LinkSafetyModalProps) => (
  <LinkSafetyModal {...props} />
);

// =============================================================================
// Panel Tab
// =============================================================================

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
            "bg-primary/50 hover:bg-primary absolute top-1/2 z-10 flex h-8 w-1 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors",
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

// =============================================================================
// Chat Panel
// =============================================================================

function ChatPanel() {
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const { messages, sendMessage, status, stop } = useChat<SeedAgentUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (error) => {
      if (error.message.includes("API key missing")) {
        setApiKeyError(error.message);
      }
    },
  });

  const [input, setInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";

  const handleSubmit = ({ text }: { text: string }) => {
    // If streaming and no text, just stop
    if (isStreaming && !text.trim()) {
      stop();
      return;
    }

    // If streaming with text, stop first then send
    if (isStreaming && text.trim()) {
      stop();
      // Small delay to ensure stop completes
      setTimeout(() => {
        setApiKeyError(null);
        sendMessage({ text });
        setInput("");
      }, 100);
      return;
    }

    // Normal submit
    if (!text.trim()) return;
    setApiKeyError(null);
    sendMessage({ text });
    setInput("");
  };

  // Handle stop button click (when no text in input)
  const handleStopClick = () => {
    if (isStreaming) {
      stop();
    }
  };

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const checkIfAtBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const threshold = 100;
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < threshold);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkIfAtBottom);
    const handleTransitionEnd = () => checkIfAtBottom();
    container.addEventListener("transitionend", handleTransitionEnd);
    checkIfAtBottom();

    return () => {
      container.removeEventListener("scroll", checkIfAtBottom);
      container.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [checkIfAtBottom]);

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
    const timer = setTimeout(checkIfAtBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isAtBottom, scrollToBottom, checkIfAtBottom]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {messages.length === 0 ? (
            <ConversationEmptyState className="h-full">
              <span className="text-2xl">🌱</span>
              <div className="space-y-1">
                <h3 className="text-sm font-medium">
                  Create something beautiful
                </h3>
                <p className="text-muted-foreground text-sm">
                  Describe the generative art you want to create
                </p>
              </div>
              <div className="mt-4 flex w-full max-w-sm flex-col gap-2">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg border px-3 py-2 text-left text-sm transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            <StreamingContext.Provider value={status === "streaming"}>
              <div className="flex flex-col gap-8 p-4">
                {messages.map((message, messageIndex) => {
                  const isLastAssistantMessage =
                    message.role === "assistant" &&
                    messageIndex ===
                      messages.findLastIndex((m) => m.role === "assistant");
                  const isThisMessageStreaming =
                    isLastAssistantMessage && status === "streaming";

                  return (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        {message.parts.map((part, index) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <MessageResponse
                                  key={index}
                                  plugins={{ code: codePlugin }}
                                  components={streamdownComponents}
                                  linkSafety={{
                                    enabled: true,
                                    renderModal: renderLinkSafetyModal,
                                  }}
                                >
                                  {part.text}
                                </MessageResponse>
                              );
                            case "tool-web_search":
                              return (
                                <Tool key={index}>
                                  <ToolHeader
                                    title="Web Search"
                                    type={part.type}
                                    state={part.state}
                                  />
                                  {part.state === "output-available" && (
                                    <ToolContent>
                                      <ToolOutput
                                        output={part.output}
                                        errorText={part.errorText}
                                      />
                                    </ToolContent>
                                  )}
                                </Tool>
                              );
                            case "tool-generate_sketch":
                              return (
                                <React.Fragment key={index}>
                                  <Tool>
                                    <ToolHeader
                                      title={
                                        part.state === "output-available"
                                          ? "Generated Sketch"
                                          : "Generating Sketch"
                                      }
                                      type={part.type}
                                      state={part.state}
                                    />
                                    {part.state === "output-available" &&
                                      part.output && (
                                        <ToolContent>
                                          <ToolOutput
                                            output={part.output}
                                            errorText={part.errorText}
                                          />
                                        </ToolContent>
                                      )}
                                  </Tool>
                                  {part.state === "output-available" &&
                                    part.output?.response && (
                                      <MessageResponse
                                        plugins={{ code: codePlugin }}
                                        components={streamdownComponents}
                                        linkSafety={{
                                          enabled: true,
                                          renderModal: renderLinkSafetyModal,
                                        }}
                                      >
                                        {part.output.response}
                                      </MessageResponse>
                                    )}
                                </React.Fragment>
                              );
                            case "reasoning":
                              if (!part.text || part.text.trim() === "") {
                                return null;
                              }
                              return (
                                <Reasoning
                                  key={index}
                                  className="w-full"
                                  isStreaming={isThisMessageStreaming}
                                >
                                  <ReasoningTrigger />
                                  <ReasoningContent>
                                    {part.text}
                                  </ReasoningContent>
                                </Reasoning>
                              );
                            case "step-start":
                              return null;
                            default:
                              return null;
                          }
                        })}
                      </MessageContent>
                    </Message>
                  );
                })}

                {status === "submitted" && (
                  <Message from="assistant">
                    <MessageContent>
                      <div className="text-muted-foreground flex items-center gap-2">
                        <Loader size={14} />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </MessageContent>
                  </Message>
                )}

                {apiKeyError && (
                  <Message from="assistant">
                    <MessageContent>
                      <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        <p className="font-medium">API Key Missing</p>
                        <p className="mt-1 text-red-700 dark:text-red-300">
                          {apiKeyError}
                        </p>
                      </div>
                    </MessageContent>
                  </Message>
                )}
              </div>
            </StreamingContext.Provider>
          )}
        </div>

        {!isAtBottom && messages.length > 0 && (
          <Button
            className="bg-background text-foreground border-border hover:bg-muted absolute bottom-4 left-1/2 -translate-x-1/2 rounded-none border shadow-md"
            onClick={scrollToBottom}
            size="icon"
            type="button"
          >
            <ArrowDownIcon className="size-4" />
          </Button>
        )}
      </div>

      {/* Clean, minimal input */}
      <div className="shrink-0 p-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isStreaming
                ? "Type to interrupt and ask something else..."
                : "Describe what you want to create..."
            }
            disabled={isSubmitted}
          />
          <PromptInputFooter>
            {/* Empty spacer to keep submit button on the right */}
            <div />
            {isStreaming && !input.trim() ? (
              // Stop button when streaming with no input
              <Button
                type="button"
                size="icon-sm"
                onClick={handleStopClick}
                aria-label="Stop generation"
              >
                <SquareIcon className="size-4" />
              </Button>
            ) : (
              // Normal submit button
              <PromptInputSubmit status={status} disabled={isSubmitted} />
            )}
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

function LeftPanel() {
  const { view, toggleRightPanel } = useSplitPanelStore();
  const showCollapseTab = view === "split";

  return (
    <div className="relative flex h-full flex-col">
      <ChatPanel />
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

// =============================================================================
// Right Panel (Preview)
// =============================================================================

function RightPanel() {
  const { view, toggleLeftPanel } = useSplitPanelStore();
  const showCollapseTab = view === "split";

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-hidden p-3">
        {/* Preview panel content */}
      </div>
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

// =============================================================================
// Split Panel Layout
// =============================================================================

function SplitPanelLayout() {
  const { view, setView } = useSplitPanelStore();

  useSplitPanelShortcuts();

  const restoreSplit = () => setView("split");

  const isLeftVisible = view !== "right-expanded";
  const isRightVisible = view !== "left-expanded";

  const leftPanelWidth = "calc(50% - 4px)";
  const rightPanelWidth = "calc(50% - 4px)";

  return (
    <div className="relative flex h-full min-h-0 gap-2">
      <AnimatePresence initial={false} mode="popLayout">
        {isLeftVisible && (
          <motion.div
            key="left-panel"
            layout
            initial={{ opacity: 0, x: -40 }}
            animate={{
              opacity: 1,
              x: 0,
              width: view === "left-expanded" ? "100%" : leftPanelWidth,
            }}
            exit={{ opacity: 0, x: -40 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
              layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
            }}
            className="border-border bg-card h-full min-h-0 shrink-0 overflow-hidden rounded-lg border"
          >
            <LeftPanel />
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
              width: view === "right-expanded" ? "100%" : rightPanelWidth,
            }}
            exit={{ opacity: 0, x: 40 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
              layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
            }}
            className="border-border bg-card h-full min-h-0 shrink-0 overflow-hidden rounded-lg border"
          >
            <RightPanel />
          </motion.div>
        )}
      </AnimatePresence>

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

// =============================================================================
// Page
// =============================================================================

export default function NewSketchPage() {
  return (
    <PageContainer className="overflow-hidden">
      <SplitPanelLayout />
    </PageContainer>
  );
}
