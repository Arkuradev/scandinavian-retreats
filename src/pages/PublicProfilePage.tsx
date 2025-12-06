import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProfileHero from "@/components/profile/ProfileHero";
import type { Venue } from "@/types/holidaze";
import { Star } from "lucide-react";
import { getProfileWithVenues, type ProfileWithVenues } from "@/lib/profile";
import VenueSkeletonCard from "@/components/skeletons/VenueCardSkeleton";
import ProfileHeroSkeleton from "@/components/skeletons/ProfileHeroSkeleton";

export default function PublicProfilePage() {
  const { name } = useParams<{ name: string }>();
  const { user } = useAuth();
  const ctrlRef = useRef<AbortController | null>(null);

  const [profile, setProfile] = useState<ProfileWithVenues | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    async function load() {
      try {
        if (!name) return;
        setLoading(true);
        setError(null);
        const data = await getProfileWithVenues(name, { signal: ctrl.signal });
        setProfile(data);
        setVenues(data.venues ?? []);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load host profile.");
      } finally {
        if (ctrlRef.current === ctrl) setLoading(false);
      }
    }

    load();

    return () => ctrl.abort();
  }, [name]);

  if (!name) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-red-500">No profile specified.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Hero skeleton */}
        <ProfileHeroSkeleton />

        {/* Venues skeleton section */}
        <section aria-hidden="true">
          <div className="rounded-2xl border border-hz-border bg-hz-surface p-4 md:p-6 shadow-hz-card">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-hz-primary-soft rounded animate-pulse" />
                <div className="h-3 w-64 bg-hz-primary-soft rounded animate-pulse" />
              </div>
              <div className="h-3 w-16 bg-hz-primary-soft rounded animate-pulse" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <VenueSkeletonCard key={`profile-venue-skeleton-${i}`} />
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-red-500">{error ?? "Profile not found."}</p>
      </main>
    );
  }

  const isOwnProfile = user?.name === profile.name;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <ProfileHero profile={profile} isOwnProfile={isOwnProfile} />

      <section aria-labelledby="host-venues-heading">
        <div className="rounded-2xl border border-hz-border bg-hz-surface p-4 md:p-6 shadow-hz-card">
          <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="host-venues-heading"
                className="text-lg md:text-xl font-semibold text-hz-text"
              >
                {profile.name}&apos;s retreats
              </h2>
              <p className="text-xs md:text-sm text-hz-muted">
                {venues.length === 0
                  ? "This host hasn’t listed any retreats yet."
                  : "Browse retreats hosted by this user and book your next stay."}
              </p>
            </div>

            <p className="text-xs text-hz-muted">
              {venues.length === 0
                ? "0 venues"
                : `${venues.length} venue${venues.length === 1 ? "" : "s"}`}
            </p>
          </header>

          {venues.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hz-border bg-hz-surface-soft px-4 py-6 text-sm text-hz-muted text-center">
              This host hasn&apos;t published any venues yet. Check back later
              or explore other retreats on the{" "}
              <Link to="/venues" className="text-hz-primary hover:underline">
                Venues page
              </Link>
              .
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <ProfileVenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

type ProfileVenueCardProps = {
  venue: Venue;
};

function ProfileVenueCard({ venue }: ProfileVenueCardProps) {
  const mainImage = venue.media?.[0];
  const city = venue.location?.city?.trim();
  const country = venue.location?.country?.trim();
  const locationLabel =
    city && country
      ? `${city}, ${country}`
      : city || country || "Location unknown";

  const hasRating = typeof venue.rating === "number" && venue.rating > 0;
  return (
    <article className="group relative">
      {/* subtle glow like main cards */}
      <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-hz-primary/50 blur-3xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 -z-10" />

      <Link
        to={`/venues/${venue.id}`}
        className="block overflow-hidden rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        aria-label={`View details for ${venue.name}`}
      >
        <div className="relative h-36 w-full bg-hz-surface-soft">
          {mainImage?.url ? (
            <img
              loading="lazy"
              src={mainImage.url}
              alt={mainImage.alt || venue.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-hz-muted">
              No image available
            </div>
          )}
          {hasRating && (
            <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-[11px] font-medium text-white">
                {venue.rating}
              </span>
            </div>
          )}
        </div>
        <div className="p-3.5 space-y-1.5">
          <h3 className="line-clamp-1 text-sm md:text-base font-semibold text-hz-text">
            {venue.name}
          </h3>
          <p className="text-xs text-hz-muted line-clamp-1">{locationLabel}</p>

          <div className="mt-2 flex items-center justify-between text-xs text-hz-muted">
            <span className="font-semibold text-hz-text">
              {venue.price.toLocaleString()} kr
            </span>
            <span>
              Max {venue.maxGuests} guest{venue.maxGuests > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
