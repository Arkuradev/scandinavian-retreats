export type LoginBody = { email: string; password: string };
export type LoginResult = { accessToken: string; name: string; email: string };
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
  const res = await fetch(`https://v2.api.noroff.dev/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: opts?.signal,
  });
  const data = await res.json();
  const payLoad = data?.data;

  if (!res.ok) {
    const msg =
      data?.errors[0]?.message ??
      data?.message ??
      `Request failed (${res.status})`;
    const err = new Error(msg);
    throw err;
  }
  return {
    accessToken: payLoad?.accessToken,
    name: payLoad?.name,
    email: payLoad?.email,
    avatar: payLoad?.avatar ?? null,
    // ...other user fields
  } as LoginResult;
}
