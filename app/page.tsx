import MagnetLines from "@/components/magnet-lines";

// =============================================================================
// Page
// =============================================================================

export default function Page() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      <main className="flex flex-col items-center gap-8 text-center">
        <span className="text-4xl">🌱</span>
        <MagnetLines
          rows={9}
          columns={9}
          containerSize="300px"
          lineColor="currentColor"
          lineWidth="2px"
          lineHeight="16px"
          baseAngle={0}
          className="text-foreground"
        />
      </main>
    </div>
  );
}
