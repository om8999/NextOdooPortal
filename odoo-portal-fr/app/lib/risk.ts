export type InvoiceRiskResponse = {
  late_payment_risk: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
};

export async function getInvoiceRisk(
  amountTotal: number,
  expectedDays: number
): Promise<InvoiceRiskResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `http://127.0.0.1:9000/risk/invoice?amount_total=${amountTotal}&expected_days=${expectedDays}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch invoice risk");
  }

  return res.json();
}
