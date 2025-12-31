"use client";

import { useEffect , useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { logout } from "@/app/lib/auth";
import Card from "./components/Card";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [avgReconcileDays, setAvgReconcileDays] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:9000/kpi/avg-reconcile-time", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setAvgReconcileDays(data.average_days))
      .catch(() => setAvgReconcileDays(null));
  }, [isAuthenticated]);

  const cards = [
  {
    key: "unreconciled",
    title: "Unreconciled Items",
    description: "Move lines pending reconciliation",
    route: "/accounting/unreconciled",
    gradient: "from-red-500 to-purple-600",
  },
  {
    key: "invoice_risk",
    title: "Invoice Risk Predictor",
    description: "Predict late payment risk using AI",
    route: "/dashboard/risk",
    gradient: "from-orange-500 to-red-600",
  },
  {
    key: "avg_reconcile",
    title: "Avg Reconcile Time",
    description: "Average days to reconcile entries",
    route: "/accounting/kpis/avg-reconcile-time",
    gradient: "from-yellow-500 to-purple-600",
    value:
    typeof avgReconcileDays === "number"
      ? `${avgReconcileDays} days`
      : "—",
  },
  {
    key: "open_invoices",
    title: "Open Invoices",
    description: "Outstanding AR / AP amounts",
    route: "/accounting/invoices/open",
    gradient: "from-emerald-500 to-purple-600",
  },
];

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

      {/* Accounting Dashboard Cards */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card
            key={card.key}
            title={card.title}
            description={card.description}
            value={card.value}
            gradient={card.gradient}
            onClick={() => router.push(card.route)}
          />
        ))}
      </main>

    </div>
  );
}
