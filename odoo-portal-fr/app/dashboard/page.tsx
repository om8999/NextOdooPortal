"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { logout } from "@/app/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-white text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Header Card */}
      <div className="relative w-full max-w-6xl mx-auto p-6 rounded-2xl bg-white/20 backdrop-blur-xl shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-white/80 mt-1">
            Logged in as: <b>{user.name}</b> ({user.login})
          </p>
        </div>

        <div className="flex gap-3">
          {user.is_admin && (
            <button
              onClick={() => router.push("/admin/users")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition"
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Cards */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Partners", "Sales Orders", "Invoices"].map((card) => (
          <div
            key={card}
            className="relative bg-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-3xl transform transition-all hover:-translate-y-1 cursor-pointer"
          >
            <h2 className="text-xl font-bold text-white">{card}</h2>
            <p className="text-white/80 mt-2">View and manage {card.toLowerCase()}.</p>
          </div>
        ))}
      </main>
    </div>
  );
}
