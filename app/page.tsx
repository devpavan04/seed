import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <div className="text-6xl">🪴</div>
        {/* <h1 className="text-5xl font-bold tracking-tight">Seed</h1>
        <p className="text-muted-foreground max-w-md text-lg">
          Turn prompts into shippable p5.js sketches with deterministic outputs,
          parameter controls, and exports.
        </p> */}
        <Button asChild size="sm" variant="outline">
          <Link href="/studio">Open Studio</Link>
        </Button>
      </main>
    </div>
  );
}
