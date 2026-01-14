import { History } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function HistoryPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <History className="size-6" />
        </EmptyMedia>
        <EmptyTitle>No history yet</EmptyTitle>
        <EmptyDescription>
          Your generation history will appear here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
