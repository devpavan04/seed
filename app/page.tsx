import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <div className="text-6xl">🪴</div>
        <Button asChild size="sm" variant="outline">
          <Link href="/studio">Open Studio</Link>
        </Button>
      </main>
    </div>
  );
}
