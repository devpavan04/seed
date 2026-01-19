import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function StudioNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
        <FileQuestion className="size-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium tracking-tight">Page Not Found</h1>
        <p className="text-muted-foreground text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/studio/all-sketches">Go to All Sketches</Link>
      </Button>
    </div>
  );
}
