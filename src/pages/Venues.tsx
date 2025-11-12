import { useEffect, useState, useRef } from "react";
import { getVenues } from "@/lib/fetchVenues";
import type { Venue, VenuesResponse } from "@/types/holidaze";
import VenueCard from "@/components/VenueCard";

type SortKey = "created" | "price" | "rating" | "maxGuests";

export default function Venues() {
  const [data, setData] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ctrlRef = useRef<AbortController | null>(null);
  const LIMIT = 12;

  function buildParams() {
    return {
      limit: LIMIT,
      page,
      sort: sortKey,
      sortOrder,
      ...(query.trim() && { q: query.trim() }),
    };
  }

  async function fetchPage({ replace }: { replace: boolean }) {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    setLoading(true);
    setError(null);

    try {
      const res = await getVenues({
        params: buildParams(),
        signal: ctrl.signal,
      });
      const data = res.data ?? [];

      if (replace) {
        setData(data);
      } else {
        setData((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === LIMIT);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setError("Something went wrong please try again");
      }
    } finally {
      if (ctrlRef.current === ctrl) setLoading(false);
    }
  }
  // Fetch on filters/page
  useEffect(() => {
    setPage(1);
  }, [sortKey, sortOrder, query]);

  useEffect(() => {
    fetchPage({ replace: page === 1 });
  }, [page, query, sortKey, sortOrder]);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res: VenuesResponse = await getVenues({
          signal: ctrl.signal,
          params: buildParams(),
        });
        setData(res.data ?? []);
      } catch (e: any) {
        if (e.name === "AbortError") return; // Ignore abort errors
        setError(e.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, []);

  if (loading) return <p className="py-10">Loading venues...</p>;
  if (error) return <p className="py-10 text-red-500">Error: {error}</p>;

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Latest Venues</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
      <button
        className="text-white flex mx-auto mt-10 py-2 px-4 rounded bg-scandi-gradient-hover hover:scale-105 transition-all duration-150"
        disabled={loading || !hasMore}
        onClick={() => setPage((p) => p + 1)}
      >
        {hasMore ? (loading ? "Loading…" : "Load more") : "No more venues"}
      </button>
    </section>
  );
}
