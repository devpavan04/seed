import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function StarredSketchesPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Star className="size-6" />
        </EmptyMedia>
        <EmptyTitle>No starred sketches yet</EmptyTitle>
        <EmptyDescription>Sketches you star will appear here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <a href="/studio/sketches">View All Sketches</a>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
