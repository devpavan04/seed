import { Plus } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/empty";

export default function NewSketchPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Plus className="size-6" />
        </EmptyMedia>
        <EmptyTitle>Create a New Sketch</EmptyTitle>
        <EmptyDescription>
          Start creating your next p5.js masterpiece.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
