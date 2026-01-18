import { FolderOpen } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/empty";
import { PageContainer } from "@/components/page-container";

export default function AllSketchesPage() {
  return (
    <PageContainer>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>No Sketches Yet</EmptyTitle>
          <EmptyDescription>
            Your sketches will appear here once you create them
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageContainer>
  );
}
