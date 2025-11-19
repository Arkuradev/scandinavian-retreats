import type { Booking } from "@/lib/bookings";

export type Media = { url: string; alt?: string };

export type Venue = {
  id: string;
  name: string;
  description?: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: { city?: string; country?: string; continent?: string };
  bookings?: Booking[];
};

export type VenuesResponse = { data: Venue[]; meta: unknown };
