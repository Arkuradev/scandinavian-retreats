import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import ProfileForm, {
  type ProfileFormInitial,
} from "@/components/profile/ProfileForm";
import { getUserProfile, updateProfile, type Profile } from "@/lib/profile";

export default function EditProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const ctrlRef = useRef<AbortController | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    async function load() {
      try {
        if (!user) return;
        setLoading(true);
        setError(null);
        const data = await getUserProfile(user.name, { signal: ctrl.signal });
        setProfile(data);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load profile.");
      } finally {
        if (ctrlRef.current === ctrl) setLoading(false);
      }
    }

    load();

    return () => ctrl.abort();
  }, [isAuthenticated, user?.name]);

  async function handleSubmit(
    bodyFromForm: Parameters<typeof updateProfile>[1],
  ) {
    setApiError(null);
    setSaving(true);

    try {
      if (!user) return;
      const updated = await updateProfile(user.name, bodyFromForm);
      setProfile(updated);
      success("Profile updated.");
      navigate(`/profile/${user.name}`);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setApiError(err.message || "Failed to update profile.");
      toastError("Could not update profile, please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-hz-muted">Loading profile…</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-red-500">{error ?? "Profile not found."}</p>
      </main>
    );
  }

  const initial: ProfileFormInitial = {
    avatarUrl: profile.avatar?.url ?? "",
    avatarAlt: profile.avatar?.alt ?? "",
    bannerUrl: profile.banner?.url ?? "",
    bannerAlt: profile.banner?.alt ?? "",
    bio: profile.bio ?? "",
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <ProfileForm
        initial={initial}
        submitting={saving}
        apiError={apiError}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/profile/${user.name}`)}
      />
    </main>
  );
}
