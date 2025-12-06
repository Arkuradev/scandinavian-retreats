function ProfileHeroSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card animate-pulse"
    >
      {/* Banner area */}
      <div className="h-28 md:h-32 w-full bg-hz-primary-soft" />

      {/* Avatar + basic info */}
      <div className="-mt-8 px-4 pb-4 md:px-6 md:pb-6 flex items-end gap-4">
        <div className="h-20 w-20 rounded-full border-4 border-hz-surface bg-hz-primary-soft" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-hz-primary-soft rounded" />
          <div className="h-3 w-56 bg-hz-primary-soft rounded" />
        </div>
      </div>

      {/* Bio lines */}
      <div className="px-4 pb-4 md:px-6 md:pb-6 space-y-2">
        <div className="h-3 w-full bg-hz-primary-soft rounded" />
        <div className="h-3 w-5/6 bg-hz-primary-soft rounded" />
      </div>
    </section>
  );
}
export default ProfileHeroSkeleton;
