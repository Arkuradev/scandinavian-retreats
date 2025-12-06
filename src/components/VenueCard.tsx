import type { Venue } from "@/types/holidaze";
import { Link } from "react-router-dom";
import { Wifi, ParkingCircle, Coffee, PawPrint, Star } from "lucide-react";

export default function VenueCard({ venue }: { venue: Venue }) {
  const coverImage =
    venue.media?.[0]?.url || "https://picsum.photos/600/400?blur=2";
  const coverAlt = venue.media?.[0]?.alt || venue.name;

  const city = venue.location?.city?.trim();
  const country = venue.location?.country?.trim();
  const locationLabel =
    city && country
      ? `${city}, ${country}`
      : city || country || "Location unknown";

  const hasRating = typeof venue.rating === "number" && venue.rating > 0;

  return (
    <article className="relative group">
      <div
        className="
          pointer-events-none
          absolute -inset-2
          rounded-3xl
          bg-hz-primary/60
          blur-3xl
          opacity-0
          group-hover:opacity-80
          transition-opacity duration-300
          -z-10
        "
      />
      <Link
        to={`/venues/${venue.id}`}
        className="
          relative block
          overflow-hidden
          rounded-2xl
          border border-hz-border
          bg-hz-surface
          shadow-hz-card
          transition-transform duration-200
          hover:-translate-y-0.5
          hover:shadow-xl
        "
        aria-label={`View details for ${venue.name}`}
      >
        <div className="relative h-40 w-full overflow-hidden bg-hz-surface-soft">
          <img
            loading="lazy"
            src={coverImage}
            alt={coverAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {hasRating && (
            <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-[11px] font-medium text-white">
                {venue.rating}
              </span>
            </div>
          )}
        </div>

        <div className="p-3.5 space-y-1.5">
          <h3 className="font-semibold text-base md:text-lg text-hz-text line-clamp-1">
            {venue.name}
          </h3>
          <p className="text-xs md:text-sm text-hz-muted line-clamp-1">
            {locationLabel}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-hz-text">
                {venue.price} kr
              </span>
              <span className="text-[11px] text-hz-muted">per night</span>
            </div>
            <span className="text-xs text-hz-muted">
              Max {venue.maxGuests} guest{venue.maxGuests > 1 ? "s" : ""}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-hz-primary">
            {venue.meta?.wifi && (
              <span className="inline-flex items-center gap-1 text-[11px]">
                <Wifi className="h-4 w-4" />
                <span className="sr-only text-hz-text">Wi-Fi</span>
              </span>
            )}
            {venue.meta?.parking && (
              <span className="inline-flex items-center gap-1 text-[11px]">
                <ParkingCircle className="h-4 w-4" />
                <span className="sr-only text-hz-text">Parking</span>
              </span>
            )}
            {venue.meta?.breakfast && (
              <span className="inline-flex items-center gap-1 text-[11px]">
                <Coffee className="h-4 w-4" />
                <span className="sr-only text-hz-text">Breakfast included</span>
              </span>
            )}
            {venue.meta?.pets && (
              <span className="inline-flex items-center gap-1 text-[11px]">
                <PawPrint className="h-4 w-4" />
                <span className="sr-only text-hz-text">Pets allowed</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
