const BASE_URL = "https://v2.api.noroff.dev";

const API_KEY = import.meta.env.VITE_NOROFF_API_KEY as string;
type HttpOptions = {
  signal?: AbortSignal;
  params?: Record<string, string | number | boolean>;
};

function buildQUery(params?: Record<string, string | number | boolean>) {
  if (!params) return "";
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => qs.set(key, String(value)));
  return `?${qs.toString()}`;
}
export async function getVenues(opts: HttpOptions = {}) {
  const { signal, params } = opts;
  const res = await fetch(`${BASE_URL}/holidaze/venues${buildQUery(params)}`, {
    signal,
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch venues: ${res.status} ${res.statusText}`);
  return res.json();
}
