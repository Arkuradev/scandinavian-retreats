import { apiFetch } from "@/lib/apiFetch";
import type { Venue } from "@/types/holidaze";

export type CreateBookingBody = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue;
  // Check what more the API returns if needed here...
  // Maybe add customer info for the Booking details.
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
    `/holidaze/profiles/${encodeName}/bookings?_venues=true`,
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
