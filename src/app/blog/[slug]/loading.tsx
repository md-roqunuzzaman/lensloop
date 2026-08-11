import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="container-page max-w-3xl py-16">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-6 h-8 w-3/4" />
      <Skeleton className="mt-3 h-4 w-40" />
      <Skeleton className="mt-8 aspect-video w-full rounded-lg" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
