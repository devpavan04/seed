import { Layers } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/empty";

export default function AllSketchesPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Layers className="size-6" />
        </EmptyMedia>
        <EmptyTitle>No Sketches Yet</EmptyTitle>
        <EmptyDescription>
          Your sketches will appear here once you create them.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
