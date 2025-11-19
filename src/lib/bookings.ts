import { apiFetch } from "@/lib/apiFetch";
import type { Venue } from "@/types/holidaze";

export type CreateBookingBody = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export type BookingCustomer = {
  name: string;
  email: string;
  avatar?: { url: string; alt?: string | null } | null;
  banner?: { url: string; alt?: string | null } | null;
  bio?: string | null;
};

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue;
  customer: BookingCustomer;
};

export async function createBooking(
  body: CreateBookingBody,
  opts?: { signal?: AbortSignal },
): Promise<Booking> {
  const json = await apiFetch<{ data: Booking }>("/holidaze/bookings", {
    method: "POST",
    body,
    signal: opts?.signal,
  });
  return json.data;
}

export async function getBookingsForProfile(
  profileName: string,
  opts?: { signal?: AbortSignal },
): Promise<Booking[]> {
  const encodeName = encodeURIComponent(profileName);

  const json = await apiFetch<{ data: Booking[] }>(
    `/holidaze/profiles/${encodeName}/bookings?_venue=true`,
    {
      method: "GET",
      signal: opts?.signal,
    },
  );
  return json.data ?? [];
}

export async function cancelBooking(
  bookingId: string,
  opts?: { signal?: AbortSignal },
): Promise<void> {
  await apiFetch<unknown>(`/holidaze/bookings/${bookingId}`, {
    method: "DELETE",
    signal: opts?.signal,
  });
}
