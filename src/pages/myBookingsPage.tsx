import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { getBookingsForProfile, cancelBooking } from "@/lib/bookings"; // we’ll make this
import type { Booking } from "@/lib/bookings";

export default function MyBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      setError("You need to be logged in to view your bookings.");
      return;
    }

    if (!user.name) {
      setLoading(false);
      setError("You need to be logged in to view your bookings.");
      return;
    }

    const profileName = user.name;

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookingsForProfile(profileName, {
          signal: ctrl.signal,
        });
        setBookings(data);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load bookings.");
      } finally {
        if (ctrlRef.current === ctrl) setLoading(false);
      }
    }

    load();

    return () => ctrl.abort();
  }, [isAuthenticated, user?.name]);

  async function handleCancelBooking(id: string) {
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      success("Booking cancelled.");
    } catch (err: any) {
      console.error(err);
      toastError("Could not cancel booking, please try again.");
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">Loading your bookings…</p>
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

  if (bookings.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">You don&apos;t have any bookings yet.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold text-hz-text mb-4">My bookings</h1>

      <div className="space-y-4">
        {bookings.map((booking) => {
          const from = new Date(booking.dateFrom);
          const to = new Date(booking.dateTo);
          const range = `${from.toLocaleDateString()} → ${to.toLocaleDateString()}`;

          const venue = booking.venue; // might be undefined
          const venueName = venue?.name ?? "View venue";
          const venueId = venue?.id ?? (booking as any).venueId;
          // ^ if you have venueId in the booking type, replace this with booking.venueId

          return (
            <article
              key={booking.id}
              className="rounded-xl border border-hz-border bg-hz-surface shadow-hz-card p-4 flex flex-col gap-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  {venueId ? (
                    <a
                      href={`/venues/${venueId}`}
                      className="text-lg font-semibold text-hz-primary hover:underline"
                    >
                      {venueName}
                    </a>
                  ) : (
                    <p className="text-lg font-semibold text-hz-text">
                      {venueName}
                    </p>
                  )}
                  <p className="text-xs text-hz-muted">
                    {range} · {booking.guests} guest
                    {booking.guests > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Cancel booking
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
