import type { Profile } from "@/lib/profile";
import { Link } from "react-router-dom";

type ProfileHeroProps = {
  profile: Profile;
  isOwnProfile?: boolean;
};

export default function ProfileHero({
  profile,
  isOwnProfile,
}: ProfileHeroProps) {
  const bannerUrl = profile.banner?.url;
  const avatarUrl = profile.avatar?.url;

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-hz-border bg-hz-surface shadow-hz-card">
      {/* Banner */}
      <div className="h-40 w-full bg-hz-surface-soft relative">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt={profile.banner?.alt || `${profile.name}'s banner`}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-4 md:flex-row md:items-center">
        {/* Avatar */}
        <div className="-mt-2 md:-mt-5">
          <div className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-hz-surface bg-hz-surface-soft overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile.avatar?.alt || `${profile.name}'s avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-hz-muted text-xl">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-hz-text">
              {profile.name}
            </h1>
            {profile.venueManager && (
              <span className="rounded-full bg-hz-primary/10 px-3 py-1 text-xs font-medium text-hz-primary">
                Venue manager
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-hz-muted">
            {profile.bio || "This host has not added a bio yet."}
          </p>

          {isOwnProfile && (
            <div className="mt-3">
              <Link
                to="/profile/edit"
                className="text-sm text-hz-primary hover:underline"
              >
                Edit profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
