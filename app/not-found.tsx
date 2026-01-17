import Link from "next/link";

import { FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
        <FileQuestion className="size-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium tracking-tight">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/studio">Go to Studio</Link>
        </Button>
      </div>
    </div>
  );
}
