const BASE_URL = "https://v2.api.noroff.dev";

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
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Accept: "application/json",
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
