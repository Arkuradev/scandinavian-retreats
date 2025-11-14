import { useEffect, useState, useRef } from "react";
import { getVenues, searchVenues } from "@/lib/fetchVenues";
import type { Venue } from "@/types/holidaze";
import VenueCard from "@/components/VenueCard";
// Come back here with a skeleton loader.
type SortKey = "created" | "price" | "rating" | "maxGuests";

export default function Venues() {
  const [data, setData] = useState<Venue[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ctrlRef = useRef<AbortController | null>(null);
  const LIMIT = 12;
  const isSearching = searchTerm.trim().length > 0;

  function buildParams() {
    return {
      limit: LIMIT,
      page,
      sort: sortKey,
      sortOrder,
    };
  }

  async function fetchPage({ replace }: { replace: boolean }) {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    setError(null);
    if (replace) setLoadingInitial(true);
    else setLoadMore(true);

    try {
      const currentQuery = searchTerm.trim();
      if (currentQuery) {
        const res = await searchVenues({
          q: currentQuery,
          signal: ctrl.signal,
        });
        const data = res.data ?? [];
        setData(data);
        setHasMore(false);
        return;
      } else {
        const res = await getVenues({
          params: buildParams(),
          signal: ctrl.signal,
        });
        const data = res.data ?? [];

        if (replace) setData(data);
        else setData((prev) => [...prev, ...data]);

        setHasMore(data.length === LIMIT);
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setError("Something went wrong please try again");
      }
    } finally {
      if (ctrlRef.current === ctrl) {
        if (replace) {
          setLoadingInitial(false);
        } else {
          setLoadMore(false);
        }
      }
    }
  }
  // Fetch on filters/page
  useEffect(() => {
    if (page === 1) {
      fetchPage({ replace: true });
    } else {
      setPage(1);
    }
  }, [searchTerm, sortKey, sortOrder]);

  useEffect(() => {
    fetchPage({ replace: page === 1 });
  }, [page]);

  if (loadingInitial && data.length === 0) {
    return <p className="py-10">Loading venues...</p>;
  }
  if (error) return <p className="py-10 text-red-500">Error: {error}</p>;

  return (
    <section>
      <h1 className="text-3xl font-semibold mb-4">
        {isSearching ? "Search results" : "Venues available:"}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(query);
              }
            }}
            placeholder="Search venues, cities, or locations..."
            className="w-full rounded border border-gray-300 bg-white/80 px-4 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary focus:ring-offset-1 transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              X
            </button>
          )}
        </div>

        {/* Sort controls */}
        <button
          type="button"
          onClick={() => setSearchTerm(query)}
          className="rounded border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 transition-all"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setSearchTerm("");
          }}
          className="rounded border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 transition-all"
          aria-label="Reset Search"
        >
          Reset Search
        </button>

        <div className="flex items-center gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all"
          >
            <option value="created">Newest</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="maxGuests">Max Guests</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="rounded border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm hover:bg-gray-100 transition-all"
            aria-label="Toggle sort order"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isSearching && !loadingInitial && data.length === 0 && (
          <p className="py-6 text-gray-600">No venues match your search.</p>
        )}
        {data.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
      {!isSearching && (
        <button
          className="text-white flex mx-auto mt-10 py-2 px-4 rounded bg-scandi-gradient-hover hover:scale-105 transition-all duration-150"
          disabled={loadMore || !hasMore}
          onClick={() => setPage((p) => p + 1)}
        >
          {hasMore ? (loadMore ? "Loading…" : "Load more") : "No more venues"}
        </button>
      )}
    </section>
  );
}
