import { useState, useEffect, useRef } from "react";
import { registerUser } from "@/lib/register";
import { useToast } from "@/hooks/useToast";

type RegisterFormProps = {
  onSuccess?: () => void;
};

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();
  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => ctrlRef.current?.abort();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const nextErrors: typeof errors = {};

    if (!name) nextErrors.name = "Please enter a username.";
    else if (name.trim().length < 3)
      nextErrors.name = "Username must be at least 3 characters long.";
    if (!email.includes("@"))
      nextErrors.email = "Please enter a valid email address.";
    else if (!email.toLowerCase().endsWith("@stud.noroff.no"))
      nextErrors.email = "Email must end with @stud.noroff.no.";
    if (password.trim().length < 6)
      nextErrors.password = "Password must be at least 6 characters long.";
    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setApiError(null);
    setLoading(true);

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      const result = await registerUser(
        { name, email, password, venueManager },
        { signal: ctrl.signal },
      );

      success(`Welcome aboard, ${result.name}! You can now log in.`);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setVenueManager(false);

      setTimeout(() => onSuccess?.(), 150);
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      setApiError(error.message || "Something went wrong during registration.");
      toastError("Registration failed, please try again.");
    } finally {
      if (ctrlRef.current === ctrl) setLoading(false);
    }
  }

  const isSubmitDisabled =
    !name || !email || !password || !confirmPassword || loading;

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-hz-text mb-1"
        >
          Username
        </label>
        <input
          id="name"
          type="text"
          placeholder="Choose a username"
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-hz-surface text-hz-text shadow-sm focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-red-500 focus:ring-red-400"
              : "border-hz-border focus:ring-hz-primary"
          }`}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name)
              setErrors((prev) => ({ ...prev, name: undefined }));
          }}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-hz-text mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="yourname@stud.noroff.no"
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-hz-surface text-hz-text shadow-sm focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-400"
              : "border-hz-border focus:ring-hz-primary"
          }`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email)
              setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        <p className="mt-1 text-xs text-hz-muted">
          You must register with your{" "}
          <span className="font-medium">@stud.noroff.no</span> email.
        </p>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-hz-text mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-hz-surface text-hz-text shadow-sm focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-500 focus:ring-red-400"
              : "border-hz-border focus:ring-hz-primary"
          }`}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: undefined }));
          }}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-hz-text mb-1"
        >
          Confirm password
        </label>
        <input
          id="confirm-password"
          type="password"
          placeholder="Type your password again"
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-hz-surface text-hz-text shadow-sm focus:outline-none focus:ring-2 ${
            errors.confirmPassword
              ? "border-red-500 focus:ring-red-400"
              : "border-hz-border focus:ring-hz-primary"
          }`}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
              }));
          }}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      <div className="mt-3 rounded-xl border border-hz-border bg-hz-surface px-3 py-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-hz-text">
              Register as venue manager
            </p>
            <p className="text-xs text-hz-muted">
              Turn this on if you want to list and manage your own retreats.
              Leave it off if you&apos;re just booking stays as a guest.
            </p>
          </div>
          <button
            type="button"
            onClick={() => !loading && setVenueManager((v) => !v)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-hz-primary flex-shrink-0"
            aria-pressed={venueManager}
            aria-label="Toggle venue manager registration"
          >
            <span
              className={`absolute inset-0 rounded-full transition-colors ${
                venueManager ? "bg-hz-primary" : "bg-hz-primary-soft"
              }`}
            />
            <span
              className={`relative h-5 w-5 rounded-full bg-hz-surface shadow-sm transition-transform ${
                venueManager ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <p className="text-[11px] text-hz-muted">
          You can still browse and book venues as a{" "}
          <span className="font-medium text-hz-text">guest</span>. Venue
          managers can create, edit, and manage their own retreats.
        </p>
      </div>
      <button
        type="submit"
        className="w-full btn-primary py-2 rounded-lg text-sm font-medium"
        disabled={isSubmitDisabled}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {apiError && (
        <p className="text-sm text-red-500 text-center mt-2">{apiError}</p>
      )}
    </form>
  );
}
