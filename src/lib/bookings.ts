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
    venue: Venue;
    // Check what more the API returns if needed here... 
}

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