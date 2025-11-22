import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getVenuesForProfile } from "@/lib/fetchVenues";
import type { Venue } from "@/types/holidaze";

export default function ManageVenuesPage() {
  const { user, isAuthenticated } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

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
  }, [user.name]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">Loading your venues…</p>
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
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <header className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-hz-text">Manage venues</h1>
          <p className="text-sm text-hz-muted">
            Create, update, and view your listed stays.
          </p>
        </div>

        {/* FIX THIS LATER */}
        <Link className="btn-primary" to="/manage-venues/new">
          Create Venue
        </Link>
      </header>

      {venues.length === 0 ? (
        <p className="text-hz-muted text-sm">
          You don&apos;t have any venues yet. Click &quot;Create new venue&quot;
          to add one.
        </p>
      ) : (
        <div className="space-y-3">
          {venues.map((venue) => (
            <article
              key={venue.id}
              className="flex flex-col sm:flex-row gap-3 rounded-xl border border-hz-border bg-hz-surface shadow-hz-card p-3"
            >
              {/* Thumbnail */}
              <div className="w-full sm:w-40 h-28 rounded-lg overflow-hidden bg-hz-surface-soft border border-hz-border">
                <img
                  src={
                    venue.media?.[0]?.url ||
                    "https://picsum.photos/400/300?blur=2"
                  }
                  alt={venue.media?.[0]?.alt || venue.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-hz-text">
                    {venue.name}
                  </h2>
                  <p className="text-xs text-hz-muted line-clamp-2">
                    {venue.description || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-between items-center text-xs">
                  <span className="text-hz-muted">
                    {venue.location?.city || "Unknown city"},{" "}
                    {venue.location?.country ||
                      venue.location?.continent ||
                      "Unknown"}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      to={`/venues/${venue.id}`}
                      className="text-hz-primary hover:underline"
                    >
                      View
                    </Link>
                    {/* We'll hook these up later */}
                    <button
                      type="button"
                      className="text-hz-muted hover:text-hz-primary"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
