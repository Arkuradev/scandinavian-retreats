import { apiFetch } from "./apiFetch";

export async function getProfile(name: string, token: string) {
  const json = await apiFetch<{ data: any }>(
    `/holidaze/profiles/${name}?_venues=true`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return json.data;
}
