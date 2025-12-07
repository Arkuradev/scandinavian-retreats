import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { MapPin, Users, Tag, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getVenuesForProfile, deleteVenue } from "@/lib/fetchVenues";
import type { Venue } from "@/types/holidaze";
import { useToast } from "@/hooks/useToast";
import ManageVenuesSkeletonList from "@/components/skeletons/ManageVenuesSkeleton";

function getUpcomingBookings(venue: Venue) {
  const bookings = venue.bookings ?? [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return bookings
    .filter((b) => {
      const end = new Date(b.dateTo);
      end.setHours(0, 0, 0, 0);
      return end >= today;
    })
    .sort(
      (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
    );
}

export default function ManageVenuesPage() {
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    async function load() {
      try {
        if (!user) return;
        setLoading(true);
        setError(null);
        const data = await getVenuesForProfile(user.name, {
          signal: ctrl.signal,
        });
        setVenues(data);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load your venues.");
      } finally {
        if (ctrlRef.current === ctrl) {
          setLoading(false);
        }
      }
    }
    load();
    return () => ctrl.abort();
  }, [isAuthenticated, user?.name, user?.venueManager]);

  async function handleDelete(venueId: string) {
    const ok = window.confirm(
      "Are you sure you want to delete this venue? This cannot be undone.",
    );
    if (!ok) return;
    setVenues((prev) => prev.filter((v) => v.id !== venueId));

    try {
      await deleteVenue(venueId);
      success("Venue has been deleted.");
    } catch (err) {
      console.error(err);
      toastError("Could not delete venue, please try again.");
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4 animate-pulse">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-hz-primary-soft rounded" />
            <div className="h-3 w-64 bg-hz-primary-soft rounded" />
          </div>
          <div className="h-9 w-32 bg-hz-primary-soft rounded-lg" />
        </div>
        <ManageVenuesSkeletonList />
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (!user.venueManager) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">
          You need a venue manager account to access this page.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-hz-text">
            Manage venues
          </h1>
          <p className="text-sm text-hz-muted">
            Create, update, and keep track of the retreats you&apos;re hosting.
          </p>
        </div>
        <Link className="btn-primary" to="/manage-venues/new">
          <Plus className="h-5 w-5 mr-1" /> New
        </Link>
      </header>

      {venues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hz-border bg-hz-surface-soft px-4 py-6 text-sm text-hz-muted">
          You don&apos;t have any venues yet. Click{" "}
          <span className="font-medium text-hz-text">+ New</span> to add your
          first retreat.
        </div>
      ) : (
        <section className="space-y-3">
          {venues.map((venue) => {
            const cover =
              venue.media?.[0]?.url || "https://picsum.photos/400/300?blur=2";

            const coverAlt = venue.media?.[0]?.alt || venue.name;
            const city = venue.location?.city;
            const country = venue.location?.country;
            const locationLabel =
              city && country
                ? `${city}, ${country}`
                : city || country || "Location unknown";

            const upcomingBookings = getUpcomingBookings(venue);

            return (
              <article
                key={venue.id}
                className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card p-4 md:p-5"
              >
                <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-hz-surface-soft border border-hz-border flex-shrink-0">
                  <img
                    src={cover}
                    alt={coverAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="space-y-1">
                    <h2 className="text-base md:text-lg font-semibold text-hz-text line-clamp-1">
                      {venue.name}
                    </h2>
                    <p className="text-xs text-hz-muted line-clamp-2">
                      {venue.description || "No description provided yet."}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-hz-muted">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-hz-primary" />
                        <span>{locationLabel}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Tag className="h-4 w-4 text-hz-primary" />
                        <span>{venue.price} kr / night</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-4 w-4 text-hz-primary" />
                        <span>
                          Max {venue.maxGuests} guest
                          {venue.maxGuests > 1 ? "s" : ""}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                    <span className="text-hz-muted">
                      ID:{" "}
                      <span className="font-mono text-[11px]">
                        {venue.id.slice(0, 8)}…
                      </span>
                    </span>
                    <div className="flex gap-3">
                      <Link
                        to={`/venues/${venue.id}`}
                        className="text-hz-text hover:text-hz-primary"
                      >
                        View
                      </Link>
                      <Link
                        to={`/manage-venues/edit/${venue.id}`}
                        className="text-hz-text hover:text-hz-primary"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(venue.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {upcomingBookings.length > 0 && (
                    <div className="mt-2 border-t border-hz-border pt-2">
                      <p className="text-[11px] font-medium text-hz-text mb-1">
                        Upcoming bookings ({upcomingBookings.length})
                      </p>
                      <ul className="space-y-1 max-h-24 overflow-y-auto text-[11px] text-hz-muted">
                        {upcomingBookings.map((b) => {
                          const from = new Date(b.dateFrom);
                          const to = new Date(b.dateTo);
                          const range = `${from.toLocaleDateString()} → ${to.toLocaleDateString()}`;
                          const customerName =
                            b.customer?.name ?? "Unknown guest";

                          return (
                            <li key={b.id}>
                              • {range} · {b.guests} guest
                              {b.guests > 1 ? "s" : ""} · {customerName}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
