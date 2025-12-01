import { Link } from "react-router-dom";
import { Mail, Globe, Instagram, Github } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

export default function Footer() {
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const profilePath = user?.name
    ? `/profile/${encodeURIComponent(user.name)}`
    : null;
  return (
    <footer className="mt-16 border-t border-black/10 bg-hz-text/80 footer-angled-bg">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src="/assets/images/logo.png"
                alt="Holidaze Retreats logo"
                className="h-14 w-14 rounded-lg bg-hz-surface p-1.5"
              />
              <span className="text-lg font-semibold text-white">
                Holidaze Retreats
              </span>
            </Link>

            <p className="text-sm text-slate-200 max-w-xs leading-relaxed">
              Discover unique stays around the world, curated retreats, coastal
              escapes, and unforgettable experiences.
            </p>

            <div className="flex gap-4 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-hz-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-hz-primary transition-colors"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="/"
                className="text-slate-200 hover:text-hz-primary transition-colors"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>
                <Link to="/venues" className="hover:text-hz-primary transition">
                  All Venues
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?mood=coastal"
                  className="hover:text-hz-primary transition"
                >
                  Coastal Stays
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?mood=mountain"
                  className="hover:text-hz-primary transition"
                >
                  Mountain Cabins
                </Link>
              </li>
              <li>
                <Link
                  to="/venues?mood=city"
                  className="hover:text-hz-primary transition"
                >
                  City Experiences
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-50 mb-3">Your Account</h3>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>
                {profilePath ? (
                  <Link
                    to={profilePath}
                    className="hover:text-hz-primary transition"
                  >
                    My Profile
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="hover:text-hz-primary transition"
                  >
                    My Profile
                  </button>
                )}
              </li>
              <li>
                {isAuthenticated ? (
                  <Link
                    to="/bookings"
                    className="hover:text-hz-primary transition"
                  >
                    My Bookings
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="hover:text-hz-primary transition"
                  >
                    My Bookings
                  </button>
                )}
              </li>
              <li>
                {isAuthenticated ? (
                  <Link
                    to="/manage-venues"
                    className="hover:text-hz-primary transition"
                  >
                    Manage Venues
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(true)}
                    className="hover:text-hz-primary transition"
                  >
                    Manage Venues
                  </button>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>
                <Link to="/about" className="hover:text-hz-primary transition">
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

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-200">
            © {new Date().getFullYear()} Holidaze Retreats. All rights
            reserved.
          </p>

          <div className="flex gap-4 text-xs text-slate-200 py-2">
            <Link to="/privacy" className="hover:text-hz-primary transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-hz-primary transition">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-hz-primary transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </footer>
  );
}
