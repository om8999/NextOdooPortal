"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur opacity-30"></div>

        {/* Glass Card */}
        <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome</h1>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
