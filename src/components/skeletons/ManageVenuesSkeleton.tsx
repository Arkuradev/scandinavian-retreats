export function ManageVenuesSkeletonList() {
  return (
    <section aria-hidden="true" className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card p-4 md:p-5 animate-pulse"
        >
          <div className="w-full sm:w-40 h-28 rounded-xl bg-hz-primary-soft" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-2/3 bg-hz-primary-soft rounded" />
            <div className="h-3 w-full bg-hz-primary-soft rounded" />
            <div className="flex justify-between items-center gap-4 pt-2">
              <div className="h-3 w-32 bg-hz-primary-soft rounded" />
              <div className="h-3 w-24 bg-hz-primary-soft rounded" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default ManageVenuesSkeletonList;
