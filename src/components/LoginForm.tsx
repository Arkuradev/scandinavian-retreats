import React from "react";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    if (!email.includes("@"))
      return setErrors({ email: "Please enter a valid email adress." });
    if (!email.endsWith("@stud.noroff.no"))
      return setErrors({ email: "Email must end with @stud.noroff.no" });
    if (password.length < 6)
      return setErrors({
        password: "Password must be at least 6 characters long.",
      });
    return; // Adjust when setting up API integration
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500" : "focus:ring-primary"}`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      <input
        type="password"
        placeholder="Password"
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${errors.password ? "border-red-500" : "focus:ring-primary"}`}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password}</p>
      )}
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
        disabled={!email || !password}
      >
        Log In
      </button>
    </form>
  );
}
