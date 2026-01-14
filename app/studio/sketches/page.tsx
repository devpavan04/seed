import { Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function SketchesPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Layers className="size-6" />
        </EmptyMedia>
        <EmptyTitle>No sketches yet</EmptyTitle>
        <EmptyDescription>
          Your saved sketches will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <a href="/studio">Create Sketch</a>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
