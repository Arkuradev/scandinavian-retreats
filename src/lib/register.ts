import { apiFetch } from "@/lib/apiFetch";

export interface AuthUser {
  name: string;
  email: string;
  avatar?: { url?: string; alt?: string };
  venueManager: boolean;
}
export interface RegisterResponse {
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

  const json = await apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body,
    signal: opts?.signal,
  });
  return json.data;
}
