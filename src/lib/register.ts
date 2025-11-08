const API_URL = "https://v2.api.noroff.dev/auth";

export interface AuthUser {
  name: string;
  email: string;
  avatar?: { url?: string; alt?: string };
}
export interface RegisterResponse {
  data: AuthUser;
  meta: {
    token: string;
  };
}

export async function registerUser(
  payload: { name: string; email: string; password: string },
  opts?: { signal?: AbortSignal },
): Promise<RegisterResponse> {
  const body = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password.trim(),
  };

  let res: Response;
  try {
    res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: opts?.signal,
    });
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request cancelled");
    }
    throw new Error(`Network error: ${error.message}`);
  }
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Failed to parse JSON response.`);
  }
  if (!res.ok) {
    const apiMsg =
      data?.errors?.[0]?.message ??
      (res.status === 409 ? "User already exists." : undefined) ??
      `Registration failed: (${res.status})`;
    throw new Error(apiMsg);
  }

  return data as RegisterResponse;
}
