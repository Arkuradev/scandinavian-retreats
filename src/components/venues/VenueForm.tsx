import { useState, useEffect } from "react";
import type { CreateVenueBody } from "@/lib/fetchVenues";
import { Star } from "lucide-react";

type VenueFormMode = "create" | "edit";

export type VenueFormInitial = {
  name?: string;
  description?: string;
  price?: number;
  maxGuests?: number;
  city?: string;
  country?: string;
  imageUrl?: string;
  media?: { url?: string; alt?: string }[];
  rating?: number;
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
};

type VenueFormProps = {
  mode?: VenueFormMode;
  initial?: VenueFormInitial;
  submitting?: boolean;
  apiError?: string | null;
  onSubmit: (body: CreateVenueBody) => void;
  onCancel?: () => void;
};

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

type MediaField = { url: string; alt: string };

export default function VenueForm({
  mode = "create",
  initial,
  submitting = false,
  apiError,
  onSubmit,
  onCancel,
}: VenueFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<number | "">(initial?.price ?? "");
  const [maxGuests, setMaxGuests] = useState<number | "">(
    initial?.maxGuests ?? "",
  );

  const [city, setCity] = useState(initial?.city ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");

  const [wifi, setWifi] = useState(initial?.wifi ?? false);
  const [parking, setParking] = useState(initial?.parking ?? false);
  const [breakfast, setBreakfast] = useState(initial?.breakfast ?? false);
  const [pets, setPets] = useState(initial?.pets ?? false);

  const [rating, setRating] = useState(initial?.rating ?? 1);

  const [localError, setLocalError] = useState<string | null>(null);

  // 🔹 NEW: multi-image state
  const [mediaFields, setMediaFields] = useState<MediaField[]>(() => {
    if (initial?.media && initial.media.length > 0) {
      return initial.media.map((m) => ({
        url: m.url ?? "",
        alt: m.alt ?? "",
      }));
    }
    if (initial?.imageUrl) {
      return [{ url: initial.imageUrl, alt: "" }];
    }
    return [{ url: "", alt: "" }];
  });

  useEffect(() => {
    if (!initial) return;
    setName(initial.name ?? "");
    setDescription(initial.description ?? "");
    setPrice(initial.price ?? "");
    setMaxGuests(initial.maxGuests ?? "");
    setCity(initial.city ?? "");
    setCountry(initial.country ?? "");
    setWifi(initial.wifi ?? false);
    setParking(initial.parking ?? false);
    setBreakfast(initial.breakfast ?? false);
    setPets(initial.pets ?? false);
    setRating(initial.rating ?? 0);

    // sync media when editing existing venue
    if (initial.media && initial.media.length > 0) {
      setMediaFields(
        initial.media.map((m) => ({
          url: m.url ?? "",
          alt: m.alt ?? "",
        })),
      );
    } else if (initial.imageUrl) {
      setMediaFields([{ url: initial.imageUrl, alt: "" }]);
    } else {
      setMediaFields([{ url: "", alt: "" }]);
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setLocalError("Name is required.");
      return;
    }
    if (price === "" || Number(price) <= 0) {
      setLocalError("Please provide a valid price above 0.");
      return;
    }
    if (maxGuests === "" || Number(maxGuests) < 1) {
      setLocalError("Max guests must be at least 1.");
      return;
    }

    const body: CreateVenueBody = {
      name: trimmedName,
      description: description.trim() || undefined,
      price: Number(price),
      maxGuests: Number(maxGuests),
      rating,
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

    // 🔹 Collect media from all non-empty URLs
    const cleanedMedia = mediaFields
      .map((field) => ({
        url: field.url.trim(),
        alt: field.alt.trim(),
      }))
      .filter((m) => m.url.length > 0)
      .map((m) => ({
        url: m.url,
        alt: m.alt || `${trimmedName} photo`,
      }));

    if (cleanedMedia.length > 0) {
      body.media = cleanedMedia;
    }

    onSubmit(body);
  }

  function updateMediaField(
    index: number,
    key: keyof MediaField,
    value: string,
  ) {
    setMediaFields((prev) =>
      prev.map((field, i) =>
        i === index
          ? {
              ...field,
              [key]: value,
            }
          : field,
      ),
    );
  }

  function addMediaField() {
    setMediaFields((prev) => [...prev, { url: "", alt: "" }]);
  }

  function removeMediaField(index: number) {
    setMediaFields((prev) => {
      if (prev.length === 1) return prev; // keep at least one row
      return prev.filter((_, i) => i !== index);
    });
  }

  const title = mode === "create" ? "Create a new venue" : "Edit venue details";
  const subtitle =
    mode === "create"
      ? "Add a new stay to Holidaze. You can edit details later if needed."
      : "Update this venue’s information. Changes will be visible to guests.";

  return (
    <section className="max-w-3xl mx-auto">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-hz-text">{title}</h1>
        <p className="text-sm text-hz-muted">{subtitle}</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-hz-border bg-hz-surface p-4 md:p-6 shadow-hz-card"
      >
        {/* Basic info */}
        <div className="space-y-3">
          <div>
            <label
              className="block text-sm font-medium text-hz-text mb-1"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              placeholder="Cozy cabin by the lake"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-hz-text mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              placeholder="Describe what makes this place special..."
            />
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-hz-text">Rating</p>
          <StarRating rating={rating} onChange={setRating} />
        </div>

        {/* Price & Guests */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              className="block text-sm font-medium text-hz-text mb-1"
              htmlFor="price"
            >
              Price per night (NOK)
            </label>
            <input
              id="price"
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
            <label
              className="block text-sm font-medium text-hz-text mb-1"
              htmlFor="maxGuests"
            >
              Max guests
            </label>
            <input
              id="maxGuests"
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
            <label
              className="block text-sm font-medium text-hz-text mb-1"
              htmlFor="city"
            >
              City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              placeholder="Oslo"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-hz-text mb-1"
              htmlFor="country"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
              placeholder="Norway"
            />
          </div>
        </div>

        {/* 🔹 Media: multiple images */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-hz-text">Images</p>
              <p className="text-xs text-hz-muted">
                Add one or more image URLs. The first image will be used as the
                main cover.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mediaFields.map((field, index) => (
              <div
                key={index}
                className="grid gap-2 sm:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_auto] items-start"
              >
                <div>
                  <label
                    className="block text-xs font-medium text-hz-text mb-1"
                    htmlFor={`media-url-${index}`}
                  >
                    Image URL {index + 1}
                  </label>
                  <input
                    id={`media-url-${index}`}
                    type="url"
                    value={field.url}
                    onChange={(e) =>
                      updateMediaField(index, "url", e.target.value)
                    }
                    className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-xs md:text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-medium text-hz-text mb-1"
                    htmlFor={`media-alt-${index}`}
                  >
                    Alt text (optional)
                  </label>
                  <input
                    id={`media-alt-${index}`}
                    type="text"
                    value={field.alt}
                    onChange={(e) =>
                      updateMediaField(index, "alt", e.target.value)
                    }
                    className="w-full rounded-md border border-hz-border bg-hz-surface-soft px-3 py-2 text-xs md:text-sm text-hz-text shadow-sm focus:outline-none focus:ring-2 focus:ring-hz-primary"
                    placeholder="Cozy living room with fireplace"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <button
                    type="button"
                    onClick={() => removeMediaField(index)}
                    disabled={mediaFields.length === 1}
                    className="text-xs font-semibold mt-2 text-red-500 hover:text-red-600 disabled:text-hz-muted disabled:cursor-not-allowed"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMediaField}
            className="mt-1 inline-flex items-center text-xs text-hz-primary hover:text-hz-accent"
          >
            + Add another image
          </button>
        </div>

        {/* Amenities */}
        <div>
          <p className="text-sm font-medium text-hz-text mb-2">Amenities</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="inline-flex items-center gap-2" htmlFor="wifi">
              <input
                id="wifi"
                type="checkbox"
                checked={wifi}
                onChange={(e) => setWifi(e.target.checked)}
              />
              <span>Wi-Fi</span>
            </label>
            <label className="inline-flex items-center gap-2" htmlFor="parking">
              <input
                id="parking"
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
              />
              <span>Parking</span>
            </label>
            <label
              className="inline-flex items-center gap-2"
              htmlFor="breakfast"
            >
              <input
                id="breakfast"
                type="checkbox"
                checked={breakfast}
                onChange={(e) => setBreakfast(e.target.checked)}
              />
              <span>Breakfast</span>
            </label>
            <label className="inline-flex items-center gap-2" htmlFor="pets">
              <input
                id="pets"
                type="checkbox"
                checked={pets}
                onChange={(e) => setPets(e.target.checked)}
              />
              <span>Pets allowed</span>
            </label>
          </div>
        </div>

        {(localError || apiError) && (
          <p className="text-sm text-red-500">{localError ?? apiError}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting
              ? mode === "create"
                ? "Creating venue..."
                : "Saving changes..."
              : mode === "create"
                ? "Create venue"
                : "Save changes"}
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
