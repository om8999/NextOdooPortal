
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OdooUser = {
  uid: number;
  login: string;
  name: string;
};

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      // ✅ Call FastAPI instead of Odoo
      const res = await fetch("http://127.0.0.1:9000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: email,
          password: password,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("token", data.access_token);

        localStorage.setItem("odoo_user", JSON.stringify(data.user));

        router.push("/dashboard");
        return true;
      }

      setError(data.error || "Invalid email or password");
      return false;
    } catch (err) {
      setError("Unable to login. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
}


