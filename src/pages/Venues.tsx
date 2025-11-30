import { useEffect, useState, useRef } from "react";
import { getVenues, searchVenues } from "@/lib/fetchVenues";
import type { Venue } from "@/types/holidaze";
import VenueCard, { VenueSkeletonCard } from "@/components/VenueCard";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Wifi,
  ParkingCircle,
  Coffee,
  PawPrint,
  SlidersHorizontal,
} from "lucide-react";

type SortKey = "created" | "price" | "rating" | "maxGuests";

type Filters = {
  country: string;
  city: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

function filterVenues(venues: Venue[], filters: Filters): Venue[] {
  const {
    country,
    city,
    minPrice,
    maxPrice,
    minRating,
    wifi,
    parking,
    breakfast,
    pets,
  } = filters;

  return venues.filter((venue) => {
    if (country) {
      const venueCountry = venue.location?.country?.toLowerCase() ?? "";
      if (!venueCountry.includes(country.toLowerCase())) return false;
    }
    if (city) {
      const venueCity = venue.location?.city?.toLowerCase() ?? "";
      if (!venueCity.includes(city.toLowerCase())) return false;
    }
    if (typeof minPrice === "number" && venue.price < minPrice) {
      return false;
    }
    if (typeof maxPrice === "number" && venue.price > maxPrice) {
      return false;
    }
    if (typeof minRating === "number") {
      const rating = typeof venue.rating === "number" ? venue.rating : 0;
      if (rating < minRating) return false;
    }
    const m = venue.meta ?? {};
    if (wifi && !m.wifi) return false;
    if (parking && !m.parking) return false;
    if (breakfast && !m.breakfast) return false;
    if (pets && !m.pets) return false;

    return true;
  });
}

export default function Venues() {
  const [data, setData] = useState<Venue[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ctrlRef = useRef<AbortController | null>(null);
  const LIMIT = 12;
  const isSearching = searchTerm.trim().length > 0;
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    country: "",
    city: "",
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

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
        setError("Something went wrong, please try again");
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

  useEffect(() => {
    setSearchTerm(debouncedQuery.trim());
  }, [debouncedQuery]);

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

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="py-10 text-red-500">Error: {error}</p>
      </section>
    );
  }

  const prices = data.map((v) => v.price);
  const globalMinPrice = prices.length ? Math.min(...prices) : 0;
  const globalMaxPrice = prices.length ? Math.max(...prices) : 5000;

  const currentMinPrice = filters.minPrice ?? globalMinPrice;
  const currentMaxPrice = filters.maxPrice ?? globalMaxPrice;

  const filteredData = filterVenues(data, filters);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4 text-hz-text">
        {isSearching ? "Search results" : "Venues available"}
      </h1>
      <div className="flex flex-col gap-4 mb-8">
        {/* Top row: search + sort + filter toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <label htmlFor="venue-search" className="sr-only">
              Search venues
            </label>
            <input
              id="venue-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search venues, cities, or locations..."
              className="w-full rounded-md border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-hz-muted hover:text-hz-text"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort + filter toggle */}
          <div className="flex items-center gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              aria-label="Sort by price, rating, or max guests"
            >
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="maxGuests">Max Guests</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="rounded border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm hover:bg-hz-primary-soft/60 transition-all"
              aria-label="Toggle sort order"
            >
              {sortOrder === "asc" ? "Low to High" : "High to Low"}
            </button>

            {/* Filters toggle */}
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm hover:bg-hz-primary-soft/60 transition-colors"
              aria-expanded={showFilters}
              aria-controls="venue-filters-panel"
            >
              <SlidersHorizontal className="h-4 w-4 text-hz-primary" />
              <span>{showFilters ? "Hide filters" : "Show filters"}</span>
            </button>
          </div>
        </div>

        {/* Collapsible filter panel */}
        {showFilters && (
          <section
            id="venue-filters-panel"
            className="rounded-2xl border border-hz-border bg-hz-surface-soft p-4 md:p-5 shadow-hz-card space-y-4"
            aria-label="Filter venues"
          >
            {/* Row 1: Location */}
            <div className="grid gap-3 md:grid-cols-3">
              {/* Country */}
              <div>
                <label
                  htmlFor="filter-country"
                  className="block text-sm font-medium text-hz-text mb-1"
                >
                  Country
                </label>
                <input
                  id="filter-country"
                  type="text"
                  value={filters.country}
                  onChange={(e) => updateFilter("country", e.target.value)}
                  placeholder="e.g. Norway"
                  className="w-full rounded border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="filter-city"
                  className="block text-sm font-medium text-hz-text mb-1"
                >
                  City
                </label>
                <input
                  id="filter-city"
                  type="text"
                  value={filters.city}
                  onChange={(e) => updateFilter("city", e.target.value)}
                  placeholder="e.g. Oslo"
                  className="w-full rounded border border-hz-border bg-hz-surface px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
                />
              </div>

              {/* Price range sliders */}
              <div>
                <span className="block text-sm font-medium text-hz-text mb-1">
                  Price range (NOK)
                </span>

                <div className="space-y-3">
                  {/* Min slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="filter-min-price-range"
                        className="text-xs font-medium text-hz-muted"
                      >
                        Minimum
                      </label>
                      <span className="text-xs text-hz-text font-medium">
                        {currentMinPrice} NOK
                      </span>
                    </div>
                    <input
                      id="filter-min-price-range"
                      type="range"
                      min={globalMinPrice}
                      max={globalMaxPrice}
                      value={currentMinPrice}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        // don’t let min go above current max
                        const clamped = Math.min(value, currentMaxPrice);
                        updateFilter("minPrice", clamped);
                      }}
                      className="w-full accent-hz-primary"
                      aria-label="Minimum price"
                    />
                  </div>

                  {/* Max slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="filter-max-price-range"
                        className="text-xs font-medium text-hz-muted"
                      >
                        Maximum
                      </label>
                      <span className="text-xs text-hz-text font-medium">
                        {currentMaxPrice} NOK
                      </span>
                    </div>
                    <input
                      id="filter-max-price-range"
                      type="range"
                      min={globalMinPrice}
                      max={globalMaxPrice}
                      value={currentMaxPrice}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        // don’t let max go below current min
                        const clamped = Math.max(value, currentMinPrice);
                        updateFilter("maxPrice", clamped);
                      }}
                      className="w-full accent-hz-primary"
                      aria-label="Maximum price"
                    />
                  </div>

                  {/* Summary row */}
                  <div className="flex justify-between text-xs text-hz-muted">
                    <span>
                      From{" "}
                      <span className="font-medium text-hz-text">
                        {currentMinPrice} NOK
                      </span>
                    </span>
                    <span>
                      To{" "}
                      <span className="font-medium text-hz-text">
                        {currentMaxPrice} NOK
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Amenities + rating */}
            <div className="flex flex-wrap items-center gap-4">
              <fieldset className="flex flex-wrap items-center gap-4">
                <legend className="text-sm font-medium text-hz-text sr-only">
                  Amenities
                </legend>

                <label className="inline-flex items-center gap-2 text-sm text-hz-text">
                  <input
                    type="checkbox"
                    checked={filters.wifi}
                    onChange={(e) => updateFilter("wifi", e.target.checked)}
                    className="h-4 w-4 rounded border-hz-border text-hz-primary focus:ring-hz-primary"
                  />
                  Wifi <Wifi className="text-hz-primary w-5 h-5" />
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-hz-text">
                  <input
                    type="checkbox"
                    checked={filters.parking}
                    onChange={(e) => updateFilter("parking", e.target.checked)}
                    className="h-4 w-4 rounded border-hz-border text-hz-primary focus:ring-hz-primary"
                  />
                  Parking <ParkingCircle className="text-hz-primary w-5 h-5" />
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-hz-text">
                  <input
                    type="checkbox"
                    checked={filters.breakfast}
                    onChange={(e) =>
                      updateFilter("breakfast", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-hz-border text-hz-primary focus:ring-hz-primary"
                  />
                  Breakfast <Coffee className="text-hz-primary w-5 h-5" />
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-hz-text">
                  <input
                    type="checkbox"
                    checked={filters.pets}
                    onChange={(e) => updateFilter("pets", e.target.checked)}
                    className="h-4 w-4 rounded border-hz-border text-hz-primary focus:ring-hz-primary"
                  />
                  Pets <PawPrint className="text-hz-primary w-5 h-5" />
                </label>
              </fieldset>

              <div className="ml-auto flex items-center gap-2 text-sm">
                <label htmlFor="filter-min-rating" className="text-hz-muted">
                  Min rating
                </label>
                <select
                  id="filter-min-rating"
                  value={filters.minRating ?? ""}
                  onChange={(e) =>
                    updateFilter(
                      "minRating",
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="w-24 rounded border border-hz-border bg-hz-surface px-2 py-1 text-sm text-hz-text shadow-sm focus:border-hz-primary focus:ring-2 focus:ring-hz-primary-soft focus:ring-offset-1 transition-all"
                >
                  <option value="">Any</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="4.5">4.5+</option>
                </select>
              </div>
            </div>
          </section>
        )}
      </div>

      {!loadingInitial &&
        !isSearching &&
        data.length > 0 &&
        filteredData.length === 0 && (
          <p className="mb-4 text-sm text-hz-muted">
            No venues match your current filters. Try clearing some filters.
          </p>
        )}

      {isSearching && !loadingInitial && filteredData.length === 0 && (
        <p className="mb-4 text-sm text-hz-muted">
          No venues match your search.
        </p>
      )}

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {loadingInitial && data.length === 0
          ? Array.from({ length: LIMIT }).map((_, i) => (
              <VenueSkeletonCard key={`skeleton-${i}`} />
            ))
          : filteredData.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
      </div>

      {!isSearching && (
        <button
          className="flex mx-auto mt-10 py-2 px-4 btn-primary"
          disabled={loadMore || !hasMore}
          onClick={() => setPage((p) => p + 1)}
        >
          {hasMore ? (loadMore ? "Loading…" : "Load more") : "No more venues"}
        </button>
      )}
    </section>
  );
}
