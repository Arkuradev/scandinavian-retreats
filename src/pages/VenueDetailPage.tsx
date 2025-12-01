import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createBooking } from "@/lib/bookings";
import { useToast } from "@/hooks/useToast";

function VenueDetailSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Top grid: gallery + booking/info card */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        {/* Left: gallery skeleton */}
        <div className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card overflow-hidden animate-pulse">
          <div className="w-full h-64 md:h-80 bg-hz-primary-soft" />

          <div className="flex gap-2 p-3 bg-hz-surface-soft border-t border-hz-border">
            <div className="h-16 w-20 bg-hz-primary-soft rounded-md" />
            <div className="h-16 w-20 bg-hz-primary-soft rounded-md" />
            <div className="h-16 w-20 bg-hz-primary-soft rounded-md" />
          </div>
        </div>

        {/* Right: title/meta/booking skeleton */}
        <div className="space-y-4 animate-pulse">
          {/* Title + host + location */}
          <div className="space-y-3">
            <div className="h-6 w-2/3 bg-hz-primary-soft rounded" />
            <div className="h-3 w-1/3 bg-hz-primary-soft rounded" />
            <div className="h-3 w-1/2 bg-hz-primary-soft rounded" />
          </div>

          {/* Rating + guests + price row */}
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-1/3 bg-hz-primary-soft rounded" />
            <div className="h-6 w-24 bg-hz-primary-soft rounded" />
          </div>

          {/* Amenities row */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 bg-hz-primary-soft rounded-full" />
            <div className="h-6 w-24 bg-hz-primary-soft rounded-full" />
            <div className="h-6 w-20 bg-hz-primary-soft rounded-full" />
          </div>

          {/* Booking card skeleton */}
          <section className="mt-4 p-4 rounded-xl border border-hz-border bg-hz-surface-soft space-y-4">
            <div className="h-4 w-32 bg-hz-primary-soft rounded" />

            {/* Date picker skeleton */}
            <div className="h-10 w-full bg-hz-primary-soft rounded" />

            {/* Guests skeleton */}
            <div className="h-10 w-40 bg-hz-primary-soft rounded" />

            {/* Button skeleton */}
            <div className="h-10 w-full sm:w-40 bg-hz-primary-soft rounded-md" />
          </section>
        </div>
      </section>

      {/* Description section skeleton */}
      <section className="rounded-xl border border-hz-border bg-hz-surface p-4 md:p-6 space-y-3 animate-pulse">
        <div className="h-4 w-40 bg-hz-primary-soft rounded" />
        <div className="h-3 w-full bg-hz-primary-soft rounded" />
        <div className="h-3 w-5/6 bg-hz-primary-soft rounded" />
        <div className="h-3 w-4/6 bg-hz-primary-soft rounded" />
      </section>
    </main>
  );
}

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const { success, error: toastError } = useToast();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
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

    if (!startDate || !endDate) {
      return setBookingError(
        "Please select both check-in and check-out dates.",
      );
    }

    const from = new Date(startDate);
    const to = new Date(endDate);
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

    const existingBookings = venue.bookings ?? [];

    const normalizedFromStr = from.toISOString().slice(0, 10);
    const normalizedToStr = to.toISOString().slice(0, 10);

    const hasSameBooking = existingBookings.some((b) => {
      const bFrom = b.dateFrom?.slice(0, 10);
      const bTo = b.dateTo?.slice(0, 10);
      const sameRange = bFrom === normalizedFromStr && bTo === normalizedToStr;
      const sameUser = b.customer?.name === user.name;
      return sameRange && sameUser;
    });

    if (hasSameBooking) {
      return setBookingError(
        "You already have a booking for these dates at this venue.",
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

      success(`You have booked ${venue.name}.`);

      setDateRange([null, null]);
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
    return <VenueDetailSkeleton />;
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
  const hasMultipleImages = media.length > 1;
  const bookings = venue.bookings ?? [];
  const excludedIntervals =
    bookings.length > 0
      ? bookings.map((b) => ({
          start: new Date(b.dateFrom),
          end: new Date(b.dateTo),
        }))
      : [];
  const myBookings = user
    ? bookings.filter((b) => b.customer?.name === user.name)
    : [];

  function showPrevImage() {
    if (!hasMultipleImages) return;
    setActiveImageIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  }

  function showNextImage() {
    if (!hasMultipleImages) return;
    setActiveImageIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
        <div className="rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card overflow-hidden">
          <div className="relative w-full h-64 md:h-80 bg-hz-surface-soft">
            <img
              src={mainImage?.url || "https://picsum.photos/800/500?blur=2"}
              alt={mainImage?.alt || venue.name}
              className="w-full h-full object-cover"
            />

            {hasMultipleImages && (
              <>
                {/* Left arrow */}
                <button
                  type="button"
                  onClick={showPrevImage}
                  className="
          absolute left-3 top-1/2 -translate-y-1/2
          inline-flex items-center justify-center
          h-9 w-9 rounded-full
          bg-black/55 backdrop-blur-sm
          text-white
          border border-white/30
          shadow-md
          hover:bg-black/70
          focus:outline-none focus:ring-2 focus:ring-hz-primary
        "
                  aria-label="View previous photo"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Right arrow */}
                <button
                  type="button"
                  onClick={showNextImage}
                  className="
          absolute right-3 top-1/2 -translate-y-1/2
          inline-flex items-center justify-center
          h-9 w-9 rounded-full
          bg-black/55 backdrop-blur-sm
          text-white
          border border-white/30
          shadow-md
          hover:bg-black/70
          focus:outline-none focus:ring-2 focus:ring-hz-primary
        "
                  aria-label="View next photo"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Photo counter pill */}
                <div
                  className="
          absolute bottom-3 right-3
          inline-flex items-center gap-1
          rounded-full bg-black/60 backdrop-blur-sm
          px-3 py-1
          text-[11px] font-medium text-white
          border border-white/20
        "
                  aria-label={`Photo ${activeImageIndex + 1} of ${media.length}`}
                >
                  <span>{activeImageIndex + 1}</span>
                  <span className="opacity-70">/</span>
                  <span className="opacity-80">{media.length}</span>
                </div>
              </>
            )}
          </div>

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
                {venue.price} kr
                <span className="text-xs font-normal text-hz-muted">
                  {" "}
                  / night
                </span>
              </p>
            </div>
          </div>
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
                  <div>
                    <label className="block text-sm font-medium text-hz-text mb-1">
                      Dates
                    </label>
                    <DatePicker
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) =>
                        setDateRange(update as [Date | null, Date | null])
                      }
                      minDate={new Date()} // block today- and earlier
                      excludeDateIntervals={excludedIntervals}
                      dateFormat="dd-MM-yyyy"
                      className="w-full rounded-md border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
                      placeholderText="Choose date"
                    />
                    <p className="mt-1 text-xs text-hz-muted">
                      Greyed-out dates are unavailable for this retreat.
                    </p>
                  </div>
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
