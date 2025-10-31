import { useEffect, useState } from "react";
import { getVenues } from "@/lib/api";
import type { Venue, VenuesResponse } from "@/types/holidaze";
import VenueCard from "@/components/VenueCard";

export default function Venues() {
  const [data, setData] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res: VenuesResponse = await getVenues({
          signal: ctrl.signal,
          params: { _limit: 12, sort: "created", sortOrder: "desc" },
        });
        setData(res.data ?? []);
      } catch (e: any) {
        if (e.name === "AbortError") return; // Ignore abort errors
        setError(e.message ?? "Uknown error");
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
    </section>
  );
}
