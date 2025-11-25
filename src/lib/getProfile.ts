import { apiFetch } from "@/lib/apiFetch";

export async function getProfile(name: string, token: string) {
  const json = await apiFetch<{ data: any }>(
    `/holidaze/profiles/${name}?_venue=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return json.data;
}

// GOT ANOTHER ONE IN PROFILE.TS, CHECK IF THIS CAN BE KEPT AND THE NEW ONE IN PROFILE.TS
// CAN BE REMOVED.
