import { useState, useEffect, useRef } from "react";
import { registerUser } from "@/lib/register";
import { useToast } from "@/hooks/useToast";

export default function RegisterForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { success, error } = useToast();

  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => ctrlRef.current?.abort();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({}); // Clear previous errors
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
        { name, email, password },
        { signal: ctrl.signal },
      );
      console.log("Registration successful:", result);
      success("Registration successful! You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
      onSuccess?.();
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      setApiError(error.message || "Something went wrong during registration.");
      error("Registration failed. Please try again.");
    } finally {
      if (ctrlRef.current === ctrl) setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.name ? "border-red-500" : "focus:ring-primary"}`}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      <input
        type="email"
        placeholder="Email"
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
        disabled={!name || !email || !password || loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      {apiError && (
        <p className="text-sm text-red-500 text-center">{apiError}</p>
      )}
    </form>
  );
}
