import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProfileHero from "@/components/profile/ProfileHero";
import type { Venue } from "@/types/holidaze";
import { getProfileWithVenues, type ProfileWithVenues } from "@/lib/profile";

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
      <main className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-red-500">No profile specified.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-hz-muted">Loading host profile…</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-red-500">{error ?? "Profile not found."}</p>
      </main>
    );
  }

  const isOwnProfile = user?.name === profile.name;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* top section */}
      <ProfileHero profile={profile} isOwnProfile={isOwnProfile} />

      {/* venues */}
      <section>
        <header className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-hz-text">
            {profile.name}&apos;s venues
          </h2>
          <p className="text-xs text-hz-muted">
            {venues.length === 0
              ? "No venues published yet."
              : `${venues.length} venue${venues.length === 1 ? "" : "s"}`}
          </p>
        </header>

        {venues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-hz-border bg-hz-surface-soft p-4 text-sm text-hz-muted">
            This host hasn&apos;t published any venues yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Small, focused card component
type VenueCardProps = {
  venue: Venue;
};

function VenueCard({ venue }: VenueCardProps) {
  const mainImage = venue.media?.[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card">
      <div className="h-40 w-full bg-hz-surface-soft">
        {mainImage?.url ? (
          <img
            src={mainImage.url}
            alt={mainImage.alt || venue.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-hz-muted">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-hz-text">
          {venue.name}
        </h3>

        {venue.location && (venue.location.city || venue.location.country) && (
          <p className="text-xs text-hz-muted">
            {[venue.location.city, venue.location.country]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between text-xs text-hz-muted">
          <span className="font-semibold text-hz-text">
            {venue.price.toLocaleString()} NOK
          </span>
          <span>⭐ {venue.rating?.toFixed?.(1) ?? "0.0"}</span>
        </div>
      </div>
    </article>
  );
}
