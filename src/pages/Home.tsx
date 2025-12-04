import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Venue } from "@/types/holidaze";
import VenueCard, { VenueSkeletonCard } from "@/components/VenueCard";
import { getVenues } from "@/lib/fetchVenues";
import Hero from "@/components/Hero";
import {
  ShieldCheck,
  Sparkles,
  Globe2,
  Waves,
  Mountain,
  Building2,
  Trees,
} from "lucide-react";

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

      {/* Latest venues */}
      <section
        id="venue-section"
        aria-labelledby="latest-heading"
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <div className="flex items-end justify-between gap-2 mb-6">
          <div>
            <h2
              id="latest-heading"
              className="text-2xl md:text-3xl font-semibold text-hz-text"
            >
              Latest venues
            </h2>
            <p className="text-sm text-hz-muted">
              Freshly added retreats, cabins, and city escapes.
            </p>
          </div>

          <Link
            to="/venues"
            className="hidden sm:inline-flex btn-primary text-sm"
          >
            View all venues
          </Link>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

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
            <p className="col-span-full text-hz-muted text-sm">
              No venues found. Try again later.
            </p>
          )}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link to="/venues" className="btn-primary">
            View all venues
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="why-book-heading"
        className="border-t border-hz-border/60 bg-gradient-to-b from-hz-surface-soft via-hz-primary-body/60 to-hz-surface"
      >
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="max-w-2xl mb-8">
            <h2
              id="why-book-heading"
              className="text-2xl md:text-3xl font-semibold text-hz-text"
            >
              Why book with Holidaze?
            </h2>
            <p className="mt-2 text-sm md:text-base text-hz-muted">
              We focus on hand-picked retreats, clear pricing, and a booking
              flow that&apos;s built to feel calm, not chaotic.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-hz-border bg-hz-surface p-4 md:p-5 shadow-hz-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-hz-primary-soft mb-3">
                <ShieldCheck className="h-5 w-5 text-hz-primary" />
              </div>
              <h3 className="text-sm font-semibold text-hz-text mb-1.5">
                Verified hosts
              </h3>
              <p className="text-sm text-hz-muted">
                All venues are verified through the Holidaze platform so you can
                book with confidence.
              </p>
            </div>

            <div className="rounded-2xl border border-hz-border bg-hz-surface p-4 md:p-5 shadow-hz-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-hz-primary-soft mb-3">
                <Sparkles className="h-5 w-5 text-hz-primary" />
              </div>
              <h3 className="text-sm font-semibold text-hz-text mb-1.5">
                Curated retreats
              </h3>
              <p className="text-sm text-hz-muted">
                From cabins and lofts to seaside hideaways – no generic hotels,
                only characterful places to stay.
              </p>
            </div>

            <div className="rounded-2xl border border-hz-border bg-hz-surface p-4 md:p-5 shadow-hz-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-hz-primary-soft mb-3">
                <Globe2 className="h-5 w-5 text-hz-primary" />
              </div>
              <h3 className="text-sm font-semibold text-hz-text mb-1.5">
                Transparent pricing
              </h3>
              <p className="text-sm text-hz-muted">
                No hidden booking fees. See the total price up front before you
                confirm your stay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by mood */}
      <section
        aria-labelledby="mood-heading"
        className="bg-hz-primary-body/60 border-t border-hz-border/60"
      >
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2
                id="mood-heading"
                className="text-2xl md:text-3xl font-semibold text-hz-text"
              >
                Explore by mood
              </h2>
              <p className="mt-2 text-sm md:text-base text-hz-muted max-w-xl">
                Not sure where to go yet? Start with a vibe. Discover coastal
                getaways, city breaks, and cabins in the countryside.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/venues?mood=coastal"
              className="
                inline-flex items-center gap-2 rounded-full 
                bg-white/70 text-hz-text px-4 py-2 text-sm 
                border border-hz-border shadow-sm
                hover:bg-white hover:shadow-md hover:-translate-y-0.5
                transition-shadow duration-150
              "
            >
              <Waves className="h-4 w-4 text-hz-primary" />
              <span>Coastal escapes</span>
            </Link>

            <Link
              to="/venues?mood=mountain"
              className="
                inline-flex items-center gap-2 rounded-full 
                bg-white/70 text-hz-text px-4 py-2 text-sm 
                border border-hz-border shadow-sm
                hover:bg-white hover:shadow-md hover:-translate-y-0.5
                transition-shadow duration-150
              "
            >
              <Mountain className="h-4 w-4 text-hz-primary" />
              <span>Mountain cabins</span>
            </Link>

            <Link
              to="/venues?mood=city"
              className="
                inline-flex items-center gap-2 rounded-full 
                bg-white/70 text-hz-text px-4 py-2 text-sm 
                border border-hz-border shadow-sm
                hover:bg-white hover:shadow-md hover:-translate-y-0.5
                transition-shadow duration-150
              "
            >
              <Building2 className="h-4 w-4 text-hz-primary" />
              <span>City breaks</span>
            </Link>

            <Link
              to="/venues?mood=countryside"
              className="
                inline-flex items-center gap-2 rounded-full 
                bg-white/70 text-hz-text px-4 py-2 text-sm 
                border border-hz-border shadow-sm
                hover:bg-white hover:shadow-md hover:-translate-y-0.5
                transition-shadow duration-150
              "
            >
              <Trees className="h-4 w-4 text-hz-primary" />
              <span>Countryside stays</span>
            </Link>
          </div>
          <div className="mt-3 flex text-xs text-hz-muted">
            <span>
              Tip: you can refine your search further on the Venues page.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
