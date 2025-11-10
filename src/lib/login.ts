import { apiFetch } from "@/lib/apiFetch";

export type LoginBody = { email: string; password: string };
export type LoginResult = {
  accessToken: string;
  name: string;
  email: string;
  avatar?: { url: string; alt?: string } | null;
};
export interface AuthContextType {
  user: { name: string; email: string } | null;
  login: (res: LoginResult) => void;
  logout: () => void;
  getToken: () => string | null;
}

export async function loginUser(
  body: LoginBody,
  opts?: { signal?: AbortSignal },
): Promise<LoginResult> {
  const json = await apiFetch<{ data: LoginResult }>("/auth/login", {
    method: "POST",
    body,
    signal: opts?.signal,
  });
  return json.data;
}
