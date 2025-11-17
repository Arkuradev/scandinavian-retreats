import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-hz-hero text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
        {/* LEFT: Text + CTAs */}
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            Holidaze
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Find your next
            <span className="block text-hz-surface">retreat, anywhere.</span>
          </h1>

          <p className="text-base md:text-lg text-hz-surface-soft/90 max-w-xl">
            Unique stays, cosy cabins, and seaside hideaways around the world.
            Browse verified venues, compare prices, and book your next escape in
            just a few clicks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/venues"
              className="inline-flex justify-center items-center rounded-md bg-hz-primary px-6 py-3 text-sm font-medium text-hz-text shadow-md hover:bg-hz-accent hover:scale-[1.02] transition-transform duration-150"
            >
              Explore venues
            </Link>

            <a
              href="#venue-section" // make sure your venues section uses id="venue-section"
              className="inline-flex justify-center items-center rounded-md border border-white/70 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/20 transition-colors duration-150"
            >
              View latest stays
            </a>
          </div>

          {/* Reassurance row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs md:text-sm text-hz-surface pt-4">
            <p>✓ Verified hosts</p>
            <p>✓ Transparent pricing</p>
            <p>✓ Secure booking</p>
          </div>
        </div>

        {/* RIGHT: Visual / stats card */}
        <div className="relative">
          {/* Glow behind card */}
          <div className="absolute -inset-1 rounded-3xl bg-sky-300/40 blur-2xl opacity-80" />

          <div className="relative rounded-3xl bg-hz-surface border border-hz-border shadow-hz-card overflow-hidden">
            {/* Top image / gradient area – swap for a real image later if you want */}
            <div className="h-40 md:h-48 bg-gradient-to-tr from-sky-200 via-sky-300 to-blue-300 flex items-end p-4">
              <div className="space-y-1 text-hz-text">
                <p className="text-xs uppercase tracking-wide text-hz-text/80">
                  Featured retreat
                </p>
                <p className="text-lg font-semibold">Seaside Loft, Barcelona</p>
                <p className="text-xs text-hz-text/70">
                  Sleeps 2 · Balcony · Ocean view
                </p>
              </div>
            </div>

            {/* Stats / highlights */}
            <div className="grid grid-cols-3 divide-x divide-hz-border bg-hz-surface-soft">
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-hz-text">200+</p>
                <p className="text-[11px] text-hz-muted">Cities covered</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-hz-text">4.7</p>
                <p className="text-[11px] text-hz-muted">Avg. guest rating</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-hz-text">No fees</p>
                <p className="text-[11px] text-hz-muted">Transparent pricing</p>
              </div>
            </div>

            {/* Bottom little note */}
            <div className="px-4 py-3 border-t border-hz-border bg-hz-surface">
              <p className="text-[11px] text-hz-muted">
                “The booking process was super smooth and the place looked
                exactly like the photos. We&apos;ll definitely use Holidaze
                again.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
