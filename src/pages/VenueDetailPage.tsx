import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Venue } from "@/types/holidaze";
import { getVenueById } from "@/lib/fetchVenues";
import { useAuth } from "@/context/AuthContext";
// import type { Booking as VenueBooking } from "@/lib/bookings";
import {
  Wifi,
  ParkingCircle,
  Coffee,
  PawPrint,
  MapPin,
  Users,
  Star,
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
  const { user, isAuthenticated } = useAuth();

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (from < today) {
      return setBookingError("You can only make a booking for a future date.");
    }

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

    if (!isAuthenticated || !user) {
      return setBookingError("You need to be logged in to make a booking.");
    }

    setBookingLoading(true);

    try {
      const booking = await createBooking({
        dateFrom: from.toISOString(),
        dateTo: to.toISOString(),
        guests,
        venueId: venue.id,
      });

      // Prevent duplicate bookings on the same date for user.
      const bookingWithCustomer = {
        ...booking,
        customer: booking.customer ?? {
          name: user.name,
          email: user.email,
          avatar: user.avatar ?? null,
          banner: null,
          bio: null,
        },
      };

      setVenue((prev) =>
        prev
          ? {
              ...prev,
              bookings: [...(prev.bookings ?? []), bookingWithCustomer],
            }
          : prev,
      );

      const normalizedFrom = dateFrom;
      const normalizedTo = dateTo;

      const hasSameBooking = (venue.bookings ?? []).some((b) => {
        const bFrom = b.dateFrom?.slice(0, 10);
        const bTo = b.dateTo?.slice(0, 10);
        const sameRange = bFrom === normalizedFrom && bTo === normalizedTo;
        const sameUser = b.customer?.name === user.name;
        return sameRange && sameUser;
      });

      if (hasSameBooking) {
        return setBookingError(
          "You already have a booking for these dates at this venue.",
        );
      }

      success(`You have booked ${venue.name}.`);

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
  const myBookings = user
    ? bookings.filter((b) => b.customer?.name === user.name)
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Top: image + summary */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        <div className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card overflow-hidden">
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
            <div className="mt-1 mb-2 flex items-center gap-1 text-sm">
              {/* COME BACK TO STYLE THIS */}
              <p className="text-hz-muted">Venue listed by</p>
              {venue.owner?.name && (
                <Link
                  to={`/profile/${encodeURIComponent(venue.owner.name)}`}
                  className="text-sm font-medium text-hz-primary hover:underline"
                >
                  {venue.owner.name}
                </Link>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-hz-muted">
              <MapPin className="h-4 w-4 text-hz-primary" />
              <span>
                {venue.location?.city || "Unknown city"},{" "}
                {venue.location?.country ||
                  venue.location?.continent ||
                  "Unknown"}
              </span>
            </div>
          </div>

          {typeof venue.rating === "number" && venue.rating > 0 && (
            <div className="mt-2 flex items-center gap-1 text-sm text-hz-muted">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span>{venue.rating} / 5</span>
            </div>
          )}

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
          <div className="flex flex-wrap gap-3">
            {venue.meta?.wifi && (
              <span className="inline-flex items-center gap-1 text-sm">
                <Wifi className="h-4 w-4 text-hz-primary" /> Wi-Fi
              </span>
            )}
            {venue.meta?.parking && (
              <span className="inline-flex items-center gap-1 text-sm">
                <ParkingCircle className="h-4 w-4 text-hz-primary" /> Parking
              </span>
            )}
            {venue.meta?.breakfast && (
              <span className="inline-flex items-center gap-1 text-sm">
                <Coffee className="h-4 w-4 text-hz-primary" /> Breakfast
              </span>
            )}
            {venue.meta?.pets && (
              <span className="inline-flex items-center gap-1 text-sm">
                <PawPrint className="h-4 w-4 text-hz-primary" /> Pets allowed
              </span>
            )}
          </div>

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

            {isAuthenticated && myBookings.length > 0 && (
              <div className="mt-4 border-t border-hz-border pt-3">
                <h3 className="text-sm font-medium text-hz-text">
                  You have booked this stay from
                </h3>
                <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto text-xs text-hz-muted">
                  {myBookings.map((b) => {
                    const from = new Date(b.dateFrom);
                    const to = new Date(b.dateTo);
                    const range = `${from.toLocaleDateString()} → ${to.toLocaleDateString()}`;
                    return <li key={b.id}>• {range}</li>;
                  })}
                </ul>
              </div>
            )}
            {!isAuthenticated && (
              <p className="mt-3 text-xs text-hz-muted">
                Log in to see your bookings for this venue.
              </p>
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
