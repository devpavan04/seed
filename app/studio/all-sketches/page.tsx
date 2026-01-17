import Link from "next/link";

import { FolderOpen, Plus } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/empty";
import { Button } from "@/components/ui/button";

export default function AllSketchesPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle>No Sketches Yet</EmptyTitle>
        <EmptyDescription>
          Your sketches will appear here once you create them.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/studio/new-sketch">
            <Plus />
            Create Your First Sketch
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
