import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { Venue } from "@/types/holidaze";
import { getVenueById } from "@/lib/fetchVenues";
import {
  Wifi,
  ParkingCircle,
  Coffee,
  PawPrint,
  MapPin,
  Users,
} from "lucide-react";
import { createBooking } from "@/lib/bookings";
import { useToast } from "@/hooks/useToast";

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const { success, error: toastError } = useToast();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      setError("No venue ID provided");
      setLoading(false);
      return;
    }

    const venueId = id;
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getVenueById(venueId, { signal: ctrl.signal });
        setVenue(data);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load venue.");
      } finally {
        if (ctrlRef.current === ctrl) {
          setLoading(false);
        }
      }
    }

    load();

    return () => ctrl.abort();
  }, [id]);

  async function handleBookingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBookingError(null);
    if (!venue) return;

    if (!dateFrom || !dateTo) {
      return setBookingError(
        "Please select both check-in and check-out dates.",
      );
    }

    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (from >= to) {
      return setBookingError("Check-out date must be after check-in date.");
    }

    if (guests < 1) {
      return setBookingError("At least 1 guest is required to make a booking.");
    }

    if (guests > venue.maxGuests) {
      return setBookingError(
        `This venue allows up to ${venue.maxGuests} guests.`,
      );
    }

    setBookingLoading(true);

    try {
      const booking = await createBooking({
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        guests,
        venueId: venue.id,
      });

      success(`You have booked ${venue.name}.`);
      console.log("Booking created:", booking);
      console.log(venue.bookings);

      setDateFrom("");
      setDateTo("");
      setGuests(1);
    } catch (err: any) {
      if (err.status === 401) {
        setBookingError("You need to be logged in to make a booking.");
      } else {
        setBookingError(
          err.message || "Something went wrong while creating booking",
        );
      }
      toastError("Could not create booking, please try again.");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">Loading venue…</p>
      </main>
    );
  }

  if (error || !venue) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-red-500">{error ?? "Venue not found"}</p>
      </main>
    );
  }
  const media = venue.media ?? [];
  const mainImage = media[activeImageIndex] ?? media[0];
  const bookings = venue.bookings ?? [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Top: image + summary */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        {/* LEFT: big image */}
        {/* LEFT: image + gallery */}
        <div className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card overflow-hidden">
          {/* Main image */}
          <div className="w-full h-64 md:h-80 bg-hz-surface-soft">
            <img
              src={mainImage?.url || "https://picsum.photos/800/500?blur=2"}
              alt={mainImage?.alt || venue.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {media.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-hz-surface-soft border-t border-hz-border">
              {media.map((img, index) => (
                <button
                  key={img.url + index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`
            relative flex-shrink-0 h-16 w-20 shadow-lg rounded-md overflow-hidden border 
            ${
              index === activeImageIndex
                ? "border-hz-primary ring-2 ring-hz-primary/60"
                : "border-hz-border hover:border-hz-primary/60"
            }
          `}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || `${venue.name} photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: info + (later) booking card */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-hz-text">
              {venue.name}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-hz-muted">
              <MapPin className="h-4 w-4" />
              <span>
                {venue.location?.city || "Unknown city"},{" "}
                {venue.location?.country ||
                  venue.location?.continent ||
                  "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-hz-primary">
              <Users className="h-5 w-5" />
              <span className="text-sm text-hz-muted">
                Max {venue.maxGuests} guests
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-hz-muted">From</p>
              <p className="text-2xl font-semibold text-hz-text">
                ${venue.price}
                <span className="text-xs font-normal text-hz-muted">
                  {" "}
                  / night
                </span>
              </p>
            </div>
          </div>

          {/* Meta icons */}
          <div className="flex flex-wrap gap-3 text-hz-primary">
            {venue.meta?.wifi && (
              <span className="inline-flex items-center gap-1 text-sm">
                <Wifi className="h-4 w-4" /> Wi-Fi
              </span>
            )}
            {venue.meta?.parking && (
              <span className="inline-flex items-center gap-1 text-sm">
                <ParkingCircle className="h-4 w-4" /> Parking
              </span>
            )}
            {venue.meta?.breakfast && (
              <span className="inline-flex items-center gap-1 text-sm">
                <Coffee className="h-4 w-4" /> Breakfast
              </span>
            )}
            {venue.meta?.pets && (
              <span className="inline-flex items-center gap-1 text-sm">
                <PawPrint className="h-4 w-4" /> Pets allowed
              </span>
            )}
          </div>

          {/* Booking card placeholder – we hook into this next */}
          <section className="mt-4 p-4 rounded-xl border border-hz-border bg-hz-surface-soft">
            <h2 className="text-lg font-semibold text-hz-text mb-2">
              Book this stay
            </h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-hz-text mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full rounded-md border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-hz-text mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full rounded-md border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
                  />
                </div>
              </div>

              <div className="max-w-[200px]">
                <label className="block text-sm font-medium text-hz-text mb-1">
                  Guests
                </label>
                <input
                  type="number"
                  min={1}
                  max={venue.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full rounded-md border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
                />
                <p className="mt-1 text-xs text-hz-muted">
                  Max {venue.maxGuests} guests for this venue.
                </p>
              </div>

              {bookingError && (
                <p className="text-sm text-red-500">{bookingError}</p>
              )}

              <button
                type="submit"
                className="btn-primary w-full sm:w-auto"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Booking..." : "Book now"}
              </button>
            </form>

            {bookings.length > 0 && (
              <div className="mt-4 border-t border-hz-border pt-3">
                <h3 className="text-sm font-medium text-hz-text">
                  Unavailable dates
                </h3>
                <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto text-xs text-hz-muted">
                  {bookings.map((b) => {
                    const from = new Date(b.dateFrom);
                    const to = new Date(b.dateTo);
                    const range = `${from.toLocaleDateString()} → ${to.toLocaleDateString()}`;
                    return <li key={b.id}>• {range}</li>;
                  })}
                </ul>
              </div>
            )}
          </section>
        </div>
      </section>

      {/* Description + maybe more sections */}
      {venue.description && (
        <section className="rounded-xl border border-hz-border bg-hz-surface p-4 md:p-6">
          <h2 className="text-lg font-semibold text-hz-text mb-2">
            About this place
          </h2>
          <p className="text-sm md:text-base text-hz-muted leading-relaxed">
            {venue.description}
          </p>
        </section>
      )}
    </main>
  );
}
