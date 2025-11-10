import { apiFetch } from "@/lib/apiFetch";
import type { AuthUser } from "@/types/auth";

export interface RegisterApiResponse {
  data: AuthUser;
}

export async function registerUser(
  payload: {
    name: string;
    email: string;
    password: string;
    venueManager: boolean;
  },
  opts?: { signal?: AbortSignal },
): Promise<AuthUser> {
  const body = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    venueManager: payload.venueManager ?? false,
  };

  const json = await apiFetch<RegisterApiResponse>("/auth/register", {
    method: "POST",
    body,
    signal: opts?.signal,
  });
  return json.data;
}
