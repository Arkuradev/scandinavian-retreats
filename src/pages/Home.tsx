import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Venue } from "@/types/holidaze";
import VenueCard, { VenueSkeletonCard } from "@/components/VenueCard";
import { getVenues } from "@/lib/fetchVenues";
import Hero from "@/components/Hero";
const LIMIT = 6;

export default function Home() {
  const [data, setData] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getVenues({
          params: {
            limit: LIMIT,
            sort: "created",
            sortOrder: "desc",
          },
        });
        setData(res.data ?? []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setError(
            "An error occured while loading venues, please refresh the page to try again.",
          );
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />

      {/* VENUE SECTION */}
      <section id="latest-venues" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-4">Latest venues</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            !error &&
            Array.from({ length: LIMIT }).map((_, i) => (
              <VenueSkeletonCard key={`skeleton-${i}`} />
            ))}
          {!loading &&
            !error &&
            data.map((v) => <VenueCard key={v.id} venue={v} />)}
          {!loading && !error && data.length === 0 && (
            <p className="col-span-full text-slate-500 text-sm">
              No venues found. Try again later.
            </p>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/venues"
            className="text-white inline-flex justify-center py-2 px-4 rounded bg-scandi-gradient-hover hover:scale-105 transition-all duration-150"
          >
            Explore Venues
          </Link>
        </div>
      </section>
    </main>
  );
}
