import { apiFetch } from "@/lib/apiFetch";
import type { Venue } from "@/types/holidaze";

export type ProfileAvatarOrBanner = {
  url: string;
  alt?: string | null;
};

export type Profile = {
  name: string;
  email: string;
  bio: string;
  avatar?: ProfileAvatarOrBanner | null;
  banner?: ProfileAvatarOrBanner | null;
  venueManager: boolean;
};

// Profile including venues when we ask for them
export type ProfileWithVenues = Profile & {
  venues?: Venue[] | null;
};

export type ProfileUpdateBody = {
  bio?: string | null;
  avatar?: ProfileAvatarOrBanner | null;
  banner?: ProfileAvatarOrBanner | null;
};

export async function updateProfile(
  name: string,
  body: ProfileUpdateBody,
  opts?: { signal?: AbortSignal },
): Promise<Profile> {
  const encoded = encodeURIComponent(name);

  const json = await apiFetch<{ data: Profile }>(
    `/holidaze/profiles/${encoded}`,
    {
      method: "PUT",
      body,
      signal: opts?.signal,
    },
  );
  return json.data;
}

// CHECK IF THIS IS TO BE REMOVED:

export async function getUserProfile(
  name: string,
  opts?: { signal?: AbortSignal },
): Promise<Profile> {
  const encoded = encodeURIComponent(name);
  const json = await apiFetch<{ data: Profile }>(
    `/holidaze/profiles/${encoded}`,
    {
      method: "GET",
      signal: opts?.signal,
    },
  );
  return json.data;
}

export async function getProfileWithVenues(
  name: string,
  opts?: { signal?: AbortSignal },
): Promise<ProfileWithVenues> {
  const encoded = encodeURIComponent(name);

  const json = await apiFetch<{ data: ProfileWithVenues }>(
    `/holidaze/profiles/${encoded}?_venues=true`,
    {
      method: "GET",
      signal: opts?.signal,
    },
  );
  return json.data;
}
