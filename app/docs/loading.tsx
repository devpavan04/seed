import { Skeleton } from "@/components/ui/skeleton";

export default function DocsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-2xl" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <div className="mt-4 space-y-4">
        <Skeleton className="h-32 w-full max-w-3xl rounded-xl" />
        <Skeleton className="h-32 w-full max-w-3xl rounded-xl" />
      </div>
    </div>
  );
}
