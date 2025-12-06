function BookingDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-40 bg-hz-primary-soft rounded" />
        <div className="h-6 w-64 bg-hz-primary-soft rounded" />
        <div className="h-3 w-56 bg-hz-primary-soft rounded" />
        <div className="h-3 w-44 bg-hz-primary-soft rounded" />
      </div>
      <section className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card overflow-hidden">
        <div className="w-full h-48 md:h-56 bg-hz-primary-soft" />

        <div className="p-4 md:p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-3 w-52 bg-hz-primary-soft rounded" />
            <div className="h-3 w-full bg-hz-primary-soft rounded" />
            <div className="h-3 w-4/5 bg-hz-primary-soft rounded" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3 bg-hz-surface-soft rounded-xl border border-hz-border p-4">
            <div className="space-y-2">
              <div className="h-2 w-16 bg-hz-primary-soft rounded" />
              <div className="h-4 w-28 bg-hz-primary-soft rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-16 bg-hz-primary-soft rounded" />
              <div className="h-4 w-28 bg-hz-primary-soft rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-16 bg-hz-primary-soft rounded" />
              <div className="h-4 w-20 bg-hz-primary-soft rounded" />
            </div>
          </div>
          <div className="h-3 w-32 bg-hz-primary-soft rounded" />
        </div>
      </section>
      <div className="h-3 w-72 bg-hz-primary-soft rounded" />
    </div>
  );
}
export default BookingDetailSkeleton;
