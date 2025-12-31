"use client";

import { useState } from "react";
import { getInvoiceRisk } from "@/app/lib/risk";

export default function InvoiceRiskPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [days, setDays] = useState<number | "">("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function checkRisk() {
    if (amount === "" || days === "") return;

    try {
      setLoading(true);
      const data = await getInvoiceRisk(amount, days);
      setResult(data);
    } catch {
      alert("Error fetching risk");
    } finally {
      setLoading(false);
    }
  }

  const riskColor =
    result?.risk_level === "HIGH"
      ? "from-red-500 to-pink-600"
      : result?.risk_level === "MEDIUM"
      ? "from-yellow-400 to-orange-500"
      : "from-emerald-400 to-green-600";

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white/20 backdrop-blur-xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Invoice Risk Predictor
          </h1>
          <p className="text-white/80 text-sm mt-1">
            AI-based late payment prediction
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-1">
              Invoice Amount
            </label>
            <input
              type="number"
              autoComplete="off"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 25000"
              className="w-full rounded-lg px-3 py-2 bg-white/90 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">
              Expected Payment Days
            </label>
            <input
              type="number"
              autoComplete="off"
              value={days}
              onChange={(e) =>
                setDays(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 30"
              className="w-full rounded-lg px-3 py-2 bg-white/90 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Action */}
        <button
          onClick={checkRisk}
          disabled={loading || amount === "" || days === ""}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                     text-white py-2 rounded-lg font-semibold shadow
                     hover:shadow-lg hover:scale-[1.02] transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Check Risk"}
        </button>

        {/* Result */}
        {result && (
          <div className="rounded-xl bg-white/30 backdrop-blur p-4 space-y-2">
            <p className="text-white text-sm font-medium">
              Late Payment Probability
            </p>

            <p className="text-3xl font-extrabold text-white">
              {(result.late_payment_risk * 100).toFixed(1)}%
            </p>

            <span
              className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold bg-gradient-to-r ${riskColor}`}
            >
              {result.risk_level} RISK
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
