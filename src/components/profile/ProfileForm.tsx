import { useEffect, useState } from "react";
import type { ProfileUpdateBody } from "@/lib/profile";

export type ProfileFormInitial = {
  avatarUrl?: string;
  avatarAlt?: string;
  bannerUrl?: string;
  bannerAlt?: string;
  bio?: string | null;
};

type ProfileFormProps = {
  initial?: ProfileFormInitial;
  submitting?: boolean;
  apiError?: string | null;
  onSubmit: (body: ProfileUpdateBody) => void;
  onCancel?: () => void;
};

export default function ProfileForm({
  initial,
  submitting = false,
  apiError,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl ?? "");
  const [avatarAlt, setAvatarAlt] = useState(initial?.avatarAlt ?? "");
  const [bannerUrl, setBannerUrl] = useState(initial?.bannerUrl ?? "");
  const [bannerAlt, setBannerAlt] = useState(initial?.bannerAlt ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    setAvatarUrl(initial.avatarUrl ?? "");
    setAvatarAlt(initial.avatarAlt ?? "");
    setBannerUrl(initial.bannerUrl ?? "");
    setBannerAlt(initial.bannerAlt ?? "");
    setBio(initial.bio ?? "");
  }, [initial]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);

    const trimmedAvatar = avatarUrl.trim();
    const trimmedBanner = bannerUrl.trim();

    // You can add stronger validation later if you want
    const body: ProfileUpdateBody = {
      bio: bio.trim() || null,
      avatar: trimmedAvatar
        ? {
            url: trimmedAvatar,
            alt: avatarAlt.trim() || null,
          }
        : null,
      banner: trimmedBanner
        ? {
            url: trimmedBanner,
            alt: bannerAlt.trim() || null,
          }
        : null,
    };

    onSubmit(body);
  }

  return (
    <section className="max-w-3xl mx-auto">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-hz-text">Edit profile</h1>
        <p className="text-sm text-hz-muted">
          Update your avatar, banner image, and bio.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-hz-border bg-hz-surface p-4 md:p-6 shadow-hz-card"
      >
        {/* Avatar */}
        <div>
          <label
            className="block text-sm font-medium text-hz-text mb-1"
            htmlFor="avatar"
          >
            Avatar URL
          </label>
          <input
            id="avatar"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            placeholder="https://images.unsplash.com/..."
          />
          <label
            className="mt-2 block text-xs font-medium text-hz-text mb-1"
            htmlFor="avatarAlt"
          >
            Avatar alt text
          </label>
          <input
            id="avatarAlt"
            type="text"
            value={avatarAlt}
            onChange={(e) => setAvatarAlt(e.target.value)}
            className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-xs text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            placeholder="Short description for screen readers"
          />
        </div>

        {/* Banner */}
        <div>
          <label
            className="block text-sm font-medium text-hz-text mb-1"
            htmlFor="bannerUrl"
          >
            Banner URL
          </label>
          <input
            id="bannerUrl"
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            placeholder="https://images.unsplash.com/..."
          />
          <label
            className="mt-2 block text-xs font-medium text-hz-text mb-1"
            htmlFor="bannerAlt"
          >
            Banner alt text
          </label>
          <input
            id="bannerAlt"
            type="text"
            value={bannerAlt}
            onChange={(e) => setBannerAlt(e.target.value)}
            className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-xs text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            placeholder="Short description for screen readers"
          />
        </div>

        {/* Bio */}
        <div>
          <label
            className="block text-sm font-medium text-hz-text mb-1"
            htmlFor="bio"
          >
            Bio
          </label>
          <textarea
            id="bio"
            value={bio ?? ""}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            placeholder="Tell guests a bit about yourself..."
          />
        </div>

        {(localError || apiError) && (
          <p className="text-sm text-red-500">{localError ?? apiError}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving changes..." : "Save changes"}
          </button>

          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
