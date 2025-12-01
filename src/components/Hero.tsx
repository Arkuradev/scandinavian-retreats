import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative text-white overflow-hidden">
      {/* Angled blue background layer */}
      <div
        className="
          absolute inset-0 
          bg-hz-hero 
          hero-angled-bg
        "
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-16 lg:py-24 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
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
            <Link to="/venues" className="btn-primary">
              Explore venues
            </Link>

            <a href="#venue-section" className="btn-hero-ghost">
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
          {/* Glow */}
          <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-hz-primary/40 blur-3xl opacity-80 -z-10" />

          <div className="relative z-10 rounded-3xl bg-hz-surface border border-hz-border shadow-hz-card overflow-hidden">
            {/* Image + overlay */}
            <div className="relative h-40 md:h-48">
              <img
                src="/assets/images/herosectionimage.jpg"
                alt="Hero"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/40 via-black/10 to-transparent">
                <div className="space-y-1 text-white">
                  <p className="text-xs uppercase tracking-wide opacity-80">
                    Featured retreat
                  </p>
                  <p className="text-lg font-semibold">
                    Seaside Loft, Barcelona
                  </p>
                  <p className="text-xs opacity-80">
                    Sleeps 2 · Balcony · Ocean view
                  </p>
                </div>
              </div>
            </div>

            {/* Stats / highlights */}
            <div className="grid grid-cols-3 divide-x divide-hz-border bg-hz-surface-soft">
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-hz-text">200+</p>
                <p className="text-[11px] text-hz-text">Cities covered</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-hz-text">4.7</p>
                <p className="text-[11px] text-hz-text">Avg. guest rating</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-hz-text">No fees</p>
                <p className="text-[11px] text-hz-text">Transparent pricing</p>
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
