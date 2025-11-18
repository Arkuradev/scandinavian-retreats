import React from "react";
import { useState, useEffect, useRef } from "react";
import { loginUser } from "@/lib/login";
import { useToast } from "@/hooks/useToast";
import { getLoginErrorMessage } from "@/helper/getLoginErrorMessage";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
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
    setErrors({}); // Clear previous errors
    const emailNorm = email.trim().toLowerCase();
    const passNorm = password.trim();
    if (!emailNorm.includes("@"))
      return setErrors({ email: "Please enter a valid email adress." });
    else if (!emailNorm.endsWith("@stud.noroff.no"))
      return setErrors({ email: "Email must end with @stud.noroff.no" });
    if (passNorm.length < 6)
      return setErrors({
        password: "Password must be at least 6 characters long.",
      });
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
      if (!result?.accessToken) throw new Error("No access token returned.");
      login(result);
      console.log("LOGIN RESULT FROM API:", result); // REMOVE THIS LATER
      const displayName = result.name ?? result.email?.split("@")[0] ?? "there";
      success(`Welcome ${displayName}.`);
      setTimeout(() => onSuccess?.(), 150);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setApiError(err.message || "Something went wrong, please try again");
      toastError(getLoginErrorMessage(err?.status));
    } finally {
      if (ctrlRef.current === ctrl) setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        disabled={loading}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500" : "focus:ring-primary"}`}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors({ ...errors, email: undefined });
        }}
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      <input
        type="password"
        placeholder="Password"
        disabled={loading}
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.password ? "border-red-500" : "focus:ring-primary"}`}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors({ ...errors, password: undefined });
        }}
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password}</p>
      )}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
        disabled={!email || !password || loading}
      >
        Log In
      </button>
      {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}
    </form>
  );
}
