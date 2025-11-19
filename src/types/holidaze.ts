export type Media = { url: string; alt?: string };

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: string;
  // Add more if applicable e.g customer, created etc. Just need to see what feels right.
};

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
