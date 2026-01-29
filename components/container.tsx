import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

interface Props {
  children?: React.ReactNode;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export default function Component({ children, className }: Props) {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
