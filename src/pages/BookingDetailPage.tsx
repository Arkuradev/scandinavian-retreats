import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Booking } from "@/lib/bookings";
import { getBookingById } from "@/lib/bookings";
import { MapPin, Users } from "lucide-react";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No booking ID provided.");
      setLoading(false);
      return;
    }

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    async function load() {
      if (!id) return;
      const bookingId = id;
      try {
        setLoading(true);
        setError(null);
        const data = await getBookingById(bookingId, { signal: ctrl.signal });
        setBooking(data);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load booking.");
      } finally {
        if (ctrlRef.current === ctrl) {
          setLoading(false);
        }
      }
    }

    load();

    return () => ctrl.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <BookingDetailSkeleton />
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-red-500">{error ?? "Booking not found"}</p>
      </main>
    );
  }

  const venue = booking.venue;
  const from = new Date(booking.dateFrom);
  const to = new Date(booking.dateTo);
  const range = `${from.toLocaleDateString()} → ${to.toLocaleDateString()}`;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-hz-muted">
          Booking confirmation
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-hz-text">
          {venue?.name ?? "Your stay"}
        </h1>
        <p className="text-sm text-hz-muted">
          {range} · {booking.guests} guest{booking.guests > 1 ? "s" : ""}
        </p>
        <p className="text-xs text-hz-muted">
          Booking ID: <span className="font-mono">{booking.id}</span>
        </p>
      </header>

      {/* Main card */}
      <section className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card overflow-hidden">
        {venue && (
          <div className="w-full h-48 md:h-56 bg-hz-surface-soft">
            <img
              loading="lazy"
              src={
                venue.media?.[0]?.url || "https://picsum.photos/800/500?blur=2"
              }
              alt={venue.media?.[0]?.alt || venue.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 md:p-6 space-y-4">
          {venue && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-hz-muted">
                <MapPin className="h-4 w-4 text-hz-primary" />
                <span>
                  {venue.location?.city || "Unknown city"},{" "}
                  {venue.location?.country ||
                    venue.location?.continent ||
                    "Unknown"}
                </span>
              </div>
              <p className="text-sm text-hz-muted">
                {venue.description || "Enjoy your stay with Holidaze."}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3 bg-hz-surface-soft rounded-xl border border-hz-border p-4">
            <div>
              <p className="text-xs uppercase text-hz-muted">Check-in</p>
              <p className="text-sm font-medium text-hz-text">
                {from.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-hz-muted">Check-out</p>
              <p className="text-sm font-medium text-hz-text">
                {to.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-hz-muted">Guests</p>
              <p className="text-sm font-medium text-hz-text flex items-center gap-1">
                <Users className="h-4 w-4" />
                {booking.guests} guest{booking.guests > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {venue && (
            <div className="flex flex-wrap gap-3 pt-2 text-sm">
              <Link
                to={`/venues/${venue.id}`}
                className="text-hz-text hover:text-hz-primary"
              >
                View venue details
              </Link>
            </div>
          )}
        </div>
      </section>

      <p className="text-xs text-hz-muted">
        This page serves as your booking confirmation. You&apos;ll also find
        this booking under <span className="font-medium">My bookings</span>.
      </p>
    </main>
  );
}

/* -------- Skeleton component to mirror the layout -------- */

function BookingDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-40 bg-hz-primary-soft rounded" />
        <div className="h-6 w-64 bg-hz-primary-soft rounded" />
        <div className="h-3 w-56 bg-hz-primary-soft rounded" />
        <div className="h-3 w-44 bg-hz-primary-soft rounded" />
      </div>

      {/* Card skeleton */}
      <section className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card overflow-hidden">
        <div className="w-full h-48 md:h-56 bg-hz-primary-soft" />

        <div className="p-4 md:p-6 space-y-4">
          {/* Location + description skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-52 bg-hz-primary-soft rounded" />
            <div className="h-3 w-full bg-hz-primary-soft rounded" />
            <div className="h-3 w-4/5 bg-hz-primary-soft rounded" />
          </div>

          {/* Date / guests skeleton */}
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

          {/* Link row skeleton */}
          <div className="h-3 w-32 bg-hz-primary-soft rounded" />
        </div>
      </section>

      {/* tiny note skeleton */}
      <div className="h-3 w-72 bg-hz-primary-soft rounded" />
    </div>
  );
}
