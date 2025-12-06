import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { getBookingsForProfile, cancelBooking } from "@/lib/bookings";
import type { Booking } from "@/lib/bookings";
import { MapPin, CalendarDays } from "lucide-react";
import BookingSkeletonList from "@/components/skeletons/ManageBookingsSkeleton";

function normalizeDate(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function splitBookings(bookings: Booking[]) {
  const today = normalizeDate(new Date());

  const upcoming: Booking[] = [];
  const previous: Booking[] = [];

  for (const booking of bookings) {
    const end = normalizeDate(new Date(booking.dateTo));
    if (end < today) {
      previous.push(booking);
    } else {
      upcoming.push(booking);
    }
  }

  // Upcoming: soonest first
  upcoming.sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
  );

  // Previous: most recent first
  previous.sort(
    (a, b) => new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime(),
  );

  return { upcoming, previous };
}

export default function MyBookingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (!isAuthenticated || !user || !user.name) {
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
    const yes = window.confirm("Are you sure you want to cancel this booking?");
    if (!yes) return;
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
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="space-y-2 animate-pulse">
          <div className="h-5 w-40 bg-hz-primary-soft rounded" />
          <div className="h-3 w-64 bg-hz-primary-soft rounded" />
        </div>
        <BookingSkeletonList />
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
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-3">
        <h1 className="text-2xl font-semibold text-hz-text">My bookings</h1>
        <p className="text-sm text-hz-muted">
          You don&apos;t have any bookings yet. Once you book a retreat, it will
          appear here.
        </p>
      </main>
    );
  }

  const { upcoming, previous } = splitBookings(bookings);

  function renderBookingCard(booking: Booking, showCancel: boolean) {
    const from = new Date(booking.dateFrom);
    const to = new Date(booking.dateTo);
    const range = `${from.toLocaleDateString()} → ${to.toLocaleDateString()}`;

    const venue = booking.venue;
    const venueName = venue?.name ?? "View venue";
    const venueId = venue?.id ?? (booking as any).venueId;

    const city = venue?.location?.city;
    const country = venue?.location?.country;
    const locationLabel =
      city && country
        ? `${city}, ${country}`
        : city || country || "Location unknown";

    return (
      <article
        key={booking.id}
        className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card p-4 md:p-5 flex flex-col gap-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            {venueId ? (
              <Link
                to={`/bookings/${booking.id}`}
                className="text-base md:text-lg font-semibold text-hz-text hover:text-hz-primary"
              >
                {venueName}
              </Link>
            ) : (
              <p className="text-base md:text-lg font-semibold text-hz-text">
                {venueName}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-hz-muted">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4 text-hz-primary" />
                <span>{range}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-hz-primary" />
                <span>{locationLabel}</span>
              </span>
              <span>
                {booking.guests} guest{booking.guests > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2">
            {showCancel && (
              <button
                type="button"
                onClick={() => handleCancelBooking(booking.id)}
                className="btn-cancel px-3 py-1.5 text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-hz-text">
          My bookings
        </h1>
        <p className="text-sm text-hz-muted">
          View your upcoming stays and your previous trips in one place.
        </p>
      </header>

      {/* Upcoming */}
      <section className="space-y-3">
        <header className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-hz-text">
            Upcoming bookings
          </h2>
          {upcoming.length > 0 && (
            <p className="text-xs text-hz-muted">
              {upcoming.length} active booking
              {upcoming.length > 1 ? "s" : ""}
            </p>
          )}
        </header>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-hz-border bg-hz-surface-soft px-4 py-5 text-sm text-hz-muted">
            You don&apos;t have any upcoming bookings. Once you book a new stay,
            it will show up here.
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => renderBookingCard(b, true))}
          </div>
        )}
      </section>

      {/* Previous */}
      <section className="space-y-3">
        <header className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-hz-text">
            Previous bookings
          </h2>
          {previous.length > 0 && (
            <p className="text-xs text-hz-muted">
              {previous.length} completed stay
              {previous.length > 1 ? "s" : ""}
            </p>
          )}
        </header>
        {previous.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-hz-border bg-hz-surface-soft px-4 py-5 text-sm text-hz-muted">
            You haven&apos;t completed any stays yet. Once your trips are
            finished, they&apos;ll appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {previous.map((b) => renderBookingCard(b, false))}
          </div>
        )}
      </section>
    </main>
  );
}
