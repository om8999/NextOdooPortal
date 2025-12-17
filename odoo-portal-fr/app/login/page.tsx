'use client';

import { useState } from "react";
import { useLogin } from "@/app/hooks/useLogin";

export default function LoginPage() {
  const { handleLogin, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await handleLogin(email, password);
    if (!ok) {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur opacity-30"></div>

        {/* Glassmorphic Card */}
        <form
          onSubmit={onSubmit}
          className="relative bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl"
        >
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
            Login
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Welcome back! Please enter your credentials.
          </p>

          <div className="space-y-5">
            <input
              type="email"
              placeholder="Email"
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
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <span
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                onClick={() => window.location.href = "/signup"}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
