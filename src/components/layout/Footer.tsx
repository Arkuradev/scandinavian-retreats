import { Link } from "react-router-dom";
import { Mail, Globe, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-hz-border bg-hz-surface mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* GRID */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND COLUMN */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="src/assets/logo.png"
                alt="Holidaze Retreats logo"
                className="h-14 w-14"
              />
              <span className="text-lg font-semibold text-hz-text">
                Holidaze Retreats
              </span>
            </Link>

            <p className="text-sm text-hz-muted max-w-xs leading-relaxed">
              Discover unique stays around the world, curated retreats, coastal
              escapes, and unforgettable experiences.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-hz-muted hover:text-hz-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-hz-muted hover:text-hz-accent transition-colors"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="/"
                className="text-hz-muted hover:text-hz-accent transition-colors"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="font-semibold text-hz-text mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-hz-muted">
              <li>
                <Link to="/venues" className="hover:text-hz-accent transition">
                  All Venues
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?mood=coastal"
                  className="hover:text-hz-accent transition"
                >
                  Coastal Stays
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?mood=mountain"
                  className="hover:text-hz-accent transition"
                >
                  Mountain Cabins
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?mood=city"
                  className="hover:text-hz-accent transition"
                >
                  City Experiences
                </Link>
              </li>
            </ul>
          </div>

          {/* USER LINKS */}
          <div>
            <h3 className="font-semibold text-hz-text mb-3">Your Account</h3>
            <ul className="space-y-2 text-sm text-hz-muted">
              <li>
                <Link
                  to="/profile/"
                  className="hover:text-hz-accent transition"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="hover:text-hz-accent transition"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/manage-venues"
                  className="hover:text-hz-accent transition"
                >
                  Manage Venues
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-semibold text-hz-text mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-hz-muted">
              <li>
                <Link to="/about" className="hover:text-hz-accent transition">
                  About Holidaze
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@holidaze.com"
                  className="inline-flex items-center gap-2 hover:text-hz-accent transition"
                >
                  <Mail className="h-4 w-4" /> support@holidaze.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 pt-6 border-t border-hz-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-hz-muted">
            © {new Date().getFullYear()} Holidaze Retreats. All rights
            reserved.
          </p>

          <div className="flex gap-4 text-xs text-hz-muted">
            <Link to="/privacy" className="hover:text-hz-accent transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-hz-accent transition">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-hz-accent transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
