import { useState, useEffect, useRef } from "react";
import { loginUser } from "@/lib/login";
import { useToast } from "@/hooks/useToast";
import { getLoginErrorMessage } from "@/helper/getLoginErrorMessage";
import { useAuth } from "@/context/AuthContext";

type LoginFormProps = {
  onSuccess?: () => void;
};

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
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
    const emailNorm = email.trim().toLowerCase();
    const passNorm = password.trim();

    if (!emailNorm.includes("@")) {
      return setErrors({ email: "Please enter a valid email address." });
    } else if (!emailNorm.endsWith("@stud.noroff.no")) {
      return setErrors({ email: "Email must end with @stud.noroff.no." });
    }

    if (passNorm.length < 6) {
      return setErrors({
        password: "Password must be at least 6 characters long.",
      });
    }

    setApiError(null);
    setLoading(true);

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      const result = await loginUser(
        { email, password },
        { signal: ctrl.signal },
      );

      setEmail("");
      setPassword("");

      if (!result?.accessToken) {
        throw new Error("No access token returned.");
      }

      login(result);

      const displayName = result.name ?? result.email?.split("@")[0] ?? "there";
      success(`Welcome ${displayName}.`);

      setTimeout(() => onSuccess?.(), 150);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setApiError(err.message || "Something went wrong, please try again.");
      toastError(getLoginErrorMessage(err?.status));
    } finally {
      if (ctrlRef.current === ctrl) setLoading(false);
    }
  }

  const isSubmitDisabled = !email || !password || loading;

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-hz-text mb-1"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="yourname@stud.noroff.no"
          disabled={loading}
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-hz-surface text-hz-text shadow-sm focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-400"
              : "border-hz-border focus:ring-hz-primary"
          }`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
        />
        <p className="mt-1 text-xs text-hz-muted">
          Use the same <span className="font-medium">@stud.noroff.no</span>{" "}
          email you registered with.
        </p>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-hz-text mb-1"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          placeholder="Your password"
          disabled={loading}
          className={`w-full border rounded-lg px-3 py-2 text-sm bg-hz-surface text-hz-text shadow-sm focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-500 focus:ring-red-400"
              : "border-hz-border focus:ring-hz-primary"
          }`}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full btn-primary py-2 rounded-lg text-sm font-medium"
        disabled={isSubmitDisabled}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      {apiError && (
        <p className="text-sm text-red-500 text-center mt-2">{apiError}</p>
      )}
    </form>
  );
}
