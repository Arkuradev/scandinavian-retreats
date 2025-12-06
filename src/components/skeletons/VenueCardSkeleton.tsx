export function VenueSkeletonCard() {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-hz-border bg-hz-surface shadow-hz-card animate-pulse">
      <div className="h-40 w-full bg-hz-primary-soft" />

      <div className="p-3.5 space-y-2">
        <div className="h-4 w-2/3 bg-hz-primary-soft rounded" />

        <div className="h-3 w-1/3 bg-hz-primary-soft rounded" />

        <div className="mt-2 flex items-center justify-between">
          <div className="h-4 w-16 bg-hz-primary-soft rounded" />
          <div className="h-3 w-20 bg-hz-primary-soft rounded" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-5 w-5 bg-hz-primary-soft rounded-full" />
          <div className="h-5 w-5 bg-hz-primary-soft rounded-full" />
          <div className="h-5 w-5 bg-hz-primary-soft rounded-full" />
        </div>
      </div>
    </div>
  );
}
export default VenueSkeletonCard;
