import type { Venue } from "@/types/holidaze";
import { Link } from "react-router-dom";
import { Wifi, ParkingCircle, Coffee, PawPrint } from "lucide-react";

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="relative group">
      {/* Glow effect behind card */}
      <div
        className="
          pointer-events-none
          absolute 
          -inset-2 
          rounded-2xl 
          bg-hz-primary/30 
          blur-3xl 
          opacity-0 
          group-hover:opacity-80 
          transition-opacity 
          duration-300
          -z-10
        "
      />

      {/* Actual card */}
      <Link
        to={`/venues/${venue.id}`}
        className="
          relative 
          block
          rounded-2xl 
          overflow-hidden 
          border 
          border-hz-border
          bg-hz-surface 
          shadow-hz-card
          transition-all 
          duration-300 
          group-hover:scale-[1.02] 
          group-hover:shadow-xl
        "
      >
        <div
          className="
          relative 
          rounded-2xl 
          overflow-hidden 
          border 
          border-hz-border
          bg-hz-surface 
          shadow-hz-card
          transition-all 
          duration-300 
          group-hover:scale-[1.02] 
          group-hover:shadow-xl
        "
        >
          <img
            src={
              venue.media?.[0]?.url || "https://picsum.photos/600/400?blur=2"
            }
            alt={venue.media?.[0]?.alt || venue.name}
            className="h-40 w-full object-cover"
          />

          <div className="p-3">
            <h3 className="font-semibold text-lg text-hz-text line-clamp-1">
              {venue.name}
            </h3>
            <p className="text-sm text-hz-muted">
              {venue.location?.city || "—"}
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold text-hz-text">${venue.price}</span>
              <span className="text-xs text-hz-muted">
                Max {venue.maxGuests} guests
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-hz-primary">
              {venue.meta?.wifi && <Wifi className="h-5 w-5" />}
              {venue.meta?.parking && <ParkingCircle className="h-5 w-5" />}
              {venue.meta?.breakfast && <Coffee className="h-5 w-5" />}
              {venue.meta?.pets && <PawPrint className="h-5 w-5" />}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function VenueSkeletonCard() {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-hz-border bg-hz-surface shadow-sm animate-pulse">
      {/* image area */}
      <div className="h-40 w-full bg-hz-primary-soft" />

      <div className="p-3 space-y-2">
        {/* title */}
        <div className="h-4 w-2/3 bg-hz-primary-soft rounded" />
        {/* location line */}
        <div className="h-3 w-1/3 bg-hz-primary-soft rounded" />

        {/* price + guests row */}
        <div className="mt-2 flex items-center justify-between">
          <div className="h-4 w-16 bg-hz-primary-soft rounded" />
          <div className="h-3 w-20 bg-hz-primary-soft rounded" />
        </div>

        {/* icons row */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-5 w-5 bg-hz-primary-soft rounded-full" />
          <div className="h-5 w-5 bg-hz-primary-soft rounded-full" />
          <div className="h-5 w-5 bg-hz-primary-soft rounded-full" />
        </div>
      </div>
    </div>
  );
}
