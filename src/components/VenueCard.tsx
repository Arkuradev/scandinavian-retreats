import type { Venue } from "@/types/holidaze";
import  { Wifi, ParkingCircle, Coffee, PawPrint } from "lucide-react";

export default function VenueCard({ venue }: { venue: Venue }) {
    return (
      <div className="rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow">
      <img
        src={venue.media?.[0]?.url || "https://picsum.photos/600/400?blur=2"}
        alt={venue.media?.[0]?.alt || venue.name}
        className="h-40 w-full object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-lg">{venue.name}</h3>
        <p className="text-sm text-gray-600">{venue.location?.city || "—"}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">${venue.price}</span>
          <span className="text-xs text-gray-500">
            Max {venue.maxGuests} guests
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-gray-500">
          {venue.meta?.wifi && <Wifi className="h-5 w-5" />}
          {venue.meta?.parking && <ParkingCircle className="h-5 w-5" />}
          {venue.meta?.breakfast && <Coffee className="h-5 w-5" />}
          {venue.meta?.pets && <PawPrint className="h-5 w-5" />}
        </div>
      </div>
    </div>
  );
}