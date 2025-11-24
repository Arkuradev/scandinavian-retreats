const BASE_URL = import.meta.env.VITE_BASE_API_URL as string;
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY as string;
import { apiFetch } from "@/lib/apiFetch";
import type { Venue } from "@/types/holidaze";

type HttpOptions = {
  signal?: AbortSignal;
  params?: Record<string, string | number | boolean>;
};

function buildQUery(params?: Record<string, string | number | boolean>) {
  if (!params) return "";
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => qs.set(key, String(value)));
  return `?${qs.toString()}`;
}
export async function getVenues(opts: HttpOptions = {}) {
  const { signal, params } = opts;
  const res = await fetch(`${BASE_URL}/holidaze/venues${buildQUery(params)}`, {
    signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch venues: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function searchVenues(opts: { q: string; signal?: AbortSignal }) {
  const { signal, q } = opts;
  const res = await fetch(
    `${BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(q)}`,
    {
      signal,
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    },
  );
  if (!res.ok)
    throw new Error(
      `Failed to fetch search result: ${res.status} ${res.statusText}`,
    );
  return res.json();
}

export async function getVenueById(
  id: string,
  opts?: { signal?: AbortSignal },
): Promise<Venue> {
  const json = await apiFetch<{ data: Venue }>(
    `/holidaze/venues/${id}?_bookings=true`,
    {
      method: "GET",
      signal: opts?.signal,
    },
  );

  return json.data;
}

// Edit Venue

export async function updateVenue(
  id: string,
  body: CreateVenueBody,
  opts?: { signal?: AbortSignal },
): Promise<Venue> {
  const json = await apiFetch<{ data: Venue }>(`/holidaze/venues/${id}`, {
    method: "PUT",
    body,
    signal: opts?.signal,
  });
  return json.data;
}

export async function getVenuesForProfile(
  profileName: string,
  opts?: { signal?: AbortSignal },
): Promise<Venue[]> {
  const encoded = encodeURIComponent(profileName);

  const json = await apiFetch<{ data: Venue[] }>(
    `/holidaze/profiles/${encoded}/venues`,
    {
      method: "GET",
      signal: opts?.signal,
    },
  );
  return json.data ?? [];
}

// Create Venue:

export type CreateVenueBody = {
  name: string;
  description?: string;
  price: number;
  maxGuests: number;
  media?: { url: string; alt?: string }[];
  rating?: number;
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
  };
};

export async function createVenue(
  body: CreateVenueBody,
  opts?: { signal?: AbortSignal },
): Promise<Venue> {
  const json = await apiFetch<{ data: Venue }>("/holidaze/venues", {
    method: "POST",
    body,
    signal: opts?.signal,
  });
  return json.data;
}
