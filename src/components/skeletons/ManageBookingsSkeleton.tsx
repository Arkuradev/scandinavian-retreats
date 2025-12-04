function BookingSkeletonList() {
  return (
    <section aria-hidden="true" className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card p-4 md:p-5 animate-pulse space-y-3"
        >
          <div className="h-4 w-40 bg-hz-primary-soft rounded" />
          <div className="h-3 w-64 bg-hz-primary-soft rounded" />
          <div className="h-3 w-32 bg-hz-primary-soft rounded" />
        </div>
      ))}
    </section>
  );
}
export default BookingSkeletonList;
