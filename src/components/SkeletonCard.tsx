export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-base-800 bg-base-900">
      <div className="skeleton aspect-[2/3]" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-3.5 w-4/5 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
