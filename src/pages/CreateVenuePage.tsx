import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { createVenue, type CreateVenueBody } from "@/lib/fetchVenues";
import VenueForm from "@/components/venues/VenueForm";

export default function CreateVenuePage() {
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const ctrlRef = useRef<AbortController | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    return () => ctrlRef.current?.abort();
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">
          You need to be logged in as a venue manager to create venues.
        </p>
      </main>
    );
  }

  if (!user.venueManager) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-hz-muted">
          This account is not a venue manager. You can browse and book stays,
          but not create venues.
        </p>
      </main>
    );
  }

  async function handleSubmit(body: CreateVenueBody) {
    setApiError(null);
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      setSubmitting(true);
      const created = await createVenue(body, { signal: ctrl.signal });
      success(`Venue "${created.name}" created.`);
      navigate("/manage-venues");
      // or: navigate(`/venues/${created.id}`);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error(err);
      setApiError(
        err.message || "Something went wrong while creating the venue.",
      );
      toastError("Could not create venue, please try again.");
    } finally {
      if (ctrlRef.current === ctrl) {
        setSubmitting(false);
      }
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <VenueForm
        mode="create"
        onSubmit={handleSubmit}
        submitting={submitting}
        apiError={apiError}
        onCancel={() => navigate("/manage-venues")}
      />
    </main>
  );
}
