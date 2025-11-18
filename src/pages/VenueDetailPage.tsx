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

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

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

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Top: image + summary */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* LEFT: big image */}
        <div className="rounded-2xl overflow-hidden border border-hz-border bg-hz-surface shadow-hz-card">
          <img
            src={
              venue.media?.[0]?.url || "https://picsum.photos/800/500?blur=2"
            }
            alt={venue.media?.[0]?.alt || venue.name}
            className="w-full h-64 md:h-80 object-cover"
          />
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
            <p className="text-sm text-hz-muted">
              Booking form coming next – this is where date and guest selection
              will live.
            </p>
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
