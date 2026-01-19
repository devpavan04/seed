import MagnetLines from "@/components/magnet-lines";

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
      {/* https://reactbits.dev/animations/magnet-lines */}
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
