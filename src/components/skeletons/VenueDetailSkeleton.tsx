function VenueDetailSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        <div className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card overflow-hidden animate-pulse">
          <div className="w-full h-64 md:h-80 bg-hz-primary-soft" />

          <div className="flex gap-2 p-3 bg-hz-surface-soft border-t border-hz-border">
            <div className="h-16 w-20 bg-hz-primary-soft rounded-md" />
            <div className="h-16 w-20 bg-hz-primary-soft rounded-md" />
            <div className="h-16 w-20 bg-hz-primary-soft rounded-md" />
          </div>
        </div>

        <div className="space-y-4 animate-pulse">
          <div className="space-y-3">
            <div className="h-6 w-2/3 bg-hz-primary-soft rounded" />
            <div className="h-3 w-1/3 bg-hz-primary-soft rounded" />
            <div className="h-3 w-1/2 bg-hz-primary-soft rounded" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-1/3 bg-hz-primary-soft rounded" />
            <div className="h-6 w-24 bg-hz-primary-soft rounded" />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 bg-hz-primary-soft rounded-full" />
            <div className="h-6 w-24 bg-hz-primary-soft rounded-full" />
            <div className="h-6 w-20 bg-hz-primary-soft rounded-full" />
          </div>
          <section className="mt-4 p-4 rounded-xl border border-hz-border bg-hz-surface-soft space-y-4">
            <div className="h-4 w-32 bg-hz-primary-soft rounded" />

            {/* Date picker skeleton */}
            <div className="h-10 w-full bg-hz-primary-soft rounded" />

            {/* Guests skeleton */}
            <div className="h-10 w-40 bg-hz-primary-soft rounded" />

            {/* Button skeleton */}
            <div className="h-10 w-full sm:w-40 bg-hz-primary-soft rounded-md" />
          </section>
        </div>
      </section>

      {/* Description section skeleton */}
      <section className="rounded-xl border border-hz-border bg-hz-surface p-4 md:p-6 space-y-3 animate-pulse">
        <div className="h-4 w-40 bg-hz-primary-soft rounded" />
        <div className="h-3 w-full bg-hz-primary-soft rounded" />
        <div className="h-3 w-5/6 bg-hz-primary-soft rounded" />
        <div className="h-3 w-4/6 bg-hz-primary-soft rounded" />
      </section>
    </main>
  );
}
export default VenueDetailSkeleton;
