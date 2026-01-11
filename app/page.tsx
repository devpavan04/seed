import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8 text-center px-4">
        <div className="text-8xl">🪴</div>
        <h1 className="text-5xl font-bold tracking-tight">Seed</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Turn prompts into shippable p5.js sketches with deterministic outputs, parameter controls, and exports.
        </p>
        <Button asChild size="default" className="mt-4">
          <Link href="/studio">Open Studio</Link>
        </Button>
      </main>
    </div>
  )
}
