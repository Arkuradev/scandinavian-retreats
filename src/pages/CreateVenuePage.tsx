import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { createVenue, type CreateVenueBody } from "@/lib/fetchVenues";
import { Wifi, ParkingCircle, Coffee, PawPrint, Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  max?: number;
  onChange: (value: number) => void;
};

function StarRating({ rating, max = 5, onChange }: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      {stars.map((value) => {
        const isActive = value <= rating;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className="p-0.5"
            aria-label={`Set rating to ${value} star${value > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                isActive ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              }`}
            />
          </button>
        );
      })}

      {rating > 0 && (
        <span className="text-sm text-hz-muted">{rating} Star Venue</span>
      )}
    </div>
  );
}

export default function CreateVenuePage() {
  const { user, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const ctrlRef = useRef<AbortController | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [maxGuests, setMaxGuests] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  // Media – single URL for now
  const [imageUrl, setImageUrl] = useState("");
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);
  const [rating, setRating] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError(null);

    // Basic validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      setApiError("Name is required.");
      return;
    }
    if (price === "" || Number(price) <= 0) {
      setApiError("Please provide a valid price above 0.");
      return;
    }
    if (maxGuests === "" || Number(maxGuests) < 1) {
      setApiError("Max guests must be at least 1.");
      return;
    }

    const body: CreateVenueBody = {
      name: trimmedName,
      description: description.trim() || undefined,
      price: Number(price),
      maxGuests: Number(maxGuests),
      rating: rating,
      meta: {
        wifi,
        parking,
        breakfast,
        pets,
      },
      location: {
        city: city.trim() || undefined,
        country: country.trim() || undefined,
      },
    };

    if (imageUrl.trim()) {
      body.media = [
        {
          url: imageUrl.trim(),
          alt: `${trimmedName} photo`,
        },
      ];
    }

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      setSubmitting(true);
      const created = await createVenue(body, { signal: ctrl.signal });

      success(`Venue "${created.name}" created.`);
      // Option A: go to manage venues
      navigate("/manage-venues");
      // Option B: go directly to venue:
      // navigate(`/venues/${created.id}`);
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
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-hz-text">
          Create a new venue
        </h1>
        <p className="text-sm text-hz-muted">
          Add a new stay to Holidaze. You can edit details later if needed.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-hz-border bg-hz-surface p-4 md:p-6 shadow-hz-card"
      >
        {/* Name + Description */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-hz-text mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              placeholder="Cozy cabin by the lake"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hz-text mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              placeholder="Describe what makes this place special..."
            />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-hz-text">Rating</p>
          <StarRating rating={rating} onChange={setRating} />
        </div>
        {/* Price + Max guests */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-hz-text mb-1">
              Price per night (USD)<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-hz-text mb-1">
              Max guests<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={maxGuests}
              onChange={(e) =>
                setMaxGuests(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-hz-text mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              placeholder="Oslo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-hz-text mb-1">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              placeholder="Norway"
            />
          </div>
        </div>

        {/* Media */}
        <div>
          <label className="block text-sm font-medium text-hz-text mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
            placeholder="https://images.unsplash.com/..."
          />
          <p className="mt-1 text-xs text-hz-muted">
            Use a valid image URL (Unsplash works great for testing).
          </p>
        </div>

        {/* Amenities */}
        <div>
          <p className="text-sm font-medium text-hz-text mb-2">Amenities</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={wifi}
                onChange={(e) => setWifi(e.target.checked)}
              />
              <span className="inline-flex gap-2">
                <Wifi className="h-4 w-4 text-hz-primary" />
                Wi-Fi
              </span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
              />
              <span className="inline-flex gap-2">
                <ParkingCircle className="h-4 w-4 text-hz-primary" />
                Parking
              </span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={breakfast}
                onChange={(e) => setBreakfast(e.target.checked)}
              />
              <span className="inline-flex gap-2">
                <Coffee className="h-4 w-4 text-hz-primary" />
                Breakfast
              </span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={pets}
                onChange={(e) => setPets(e.target.checked)}
              />
              <span className="inline-flex gap-2">
                <PawPrint className="h-4 w-4 text-hz-primary" />
                Pets
              </span>
            </label>
          </div>
        </div>

        {apiError && <p className="text-sm text-red-500">{apiError}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Creating venue..." : "Create venue"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/manage-venues")}
            className="text-sm text-hz-muted hover:text-hz-primary"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
