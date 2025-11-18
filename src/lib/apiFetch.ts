const BASE_URL = import.meta.env.VITE_BASE_API_URL as string;
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY as string | undefined;

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export async function apiFetch<T>(
  url: string,
  opts: ApiOptions = {},
): Promise<T> {
  const method = opts.method ?? "GET";
  const isFormData =
    typeof FormData !== "undefined" && opts.body instanceof FormData;

  let token: string | null = null;
  try {
    const raw = localStorage.getItem("auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      token = parsed?.token ?? null;
    }
  } catch {
    // ignore bad JSON
  }

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Accept: "application/json",
    ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers ?? {}),
  };

  const body =
    opts.body === undefined
      ? undefined
      : isFormData
        ? (opts.body as FormData)
        : JSON.stringify(opts.body);

  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  const res = await fetch(fullUrl, {
    method,
    headers,
    body,
    signal: opts.signal,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // Swallow JSON parse errors (e.g., 204 No Content). 'data' stays null.
  }

  if (!res.ok) {
    const msg =
      data?.errors?.[0]?.message ??
      data?.message ??
      `Request failed (${res.status})`;
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return data as T;
}
