"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/app/hooks/useSignup";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loading, error } = useSignup();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ name, email, password });
      router.push("/login");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur opacity-30"></div>

        {/* Card */}
        <form
          onSubmit={handleSignup}
          className="relative bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl"
        >
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Join us and start managing your dashboard
          </p>

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              required
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
