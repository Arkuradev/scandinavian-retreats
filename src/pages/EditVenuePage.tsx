import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import type { CreateVenueBody } from "@/lib/fetchVenues";
import type { Venue } from "@/types/holidaze";
import VenueForm from "@/components/venues/VenueForm";
import { getVenueById, updateVenue } from "@/lib/fetchVenues";

export default function EditVenuePage() {
  const { user, isAuthenticated } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const ctrlRef = useRef<AbortController | null>(null);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No venue ID provided.");
      setLoading(false);
      return;
    }

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    async function load() {
      try {
        if (!id) return;
        setLoading(true);
        setError(null);
        const data = await getVenueById(id, { signal: ctrl.signal });
        setVenue(data);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message || "Failed to load venue details.");
      } finally {
        if (ctrlRef.current === ctrl) setLoading(false);
      }
    }
    load();
    return () => ctrl.abort();
  }, [id]);

  if (!isAuthenticated || !user) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">
          You need to be logged in to edit venues.
        </p>
      </main>
    );
  }

  if (!user.venueManager) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">
          You need to be logged in as a venue manager to edit venues.
        </p>
      </main>
    );
  }

  async function handleEditSubmit(body: CreateVenueBody) {
    if (!id) return;
    setApiError(null);
    setSaving(true);
    try {
      await updateVenue(id, body);
      success("Venue has been updated!");
      navigate(`/venues/${id}`);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setApiError(err.message || "Failed to fetch edit data");
      toastError("Could not update venue, please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-hz-muted">Loading venue details…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  const initialForForm = venue
    ? {
        name: venue.name,
        description: venue.description ?? "",
        price: venue.price,
        maxGuests: venue.maxGuests,
        city: venue.location?.city ?? "",
        country: venue.location?.country ?? "",

        imageUrl: venue.media?.[0]?.url ?? "",
        media:
          venue.media?.map((m) => ({
            url: m.url ?? "",
            alt: m.alt ?? "",
          })) ?? [],

        rating: venue.rating,
        wifi: venue.meta?.wifi ?? false,
        parking: venue.meta?.parking ?? false,
        breakfast: venue.meta?.breakfast ?? false,
        pets: venue.meta?.pets ?? false,
      }
    : undefined;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <VenueForm
        mode="edit"
        initial={initialForForm}
        onSubmit={handleEditSubmit}
        submitting={saving}
        apiError={apiError}
        onCancel={() => navigate("/manage-venues")}
      />
    </main>
  );
}
