"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:9000";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type SignupResponse = {
  token: string;
  user: {
    uid: number;
    login: string;
    name: string;
  };
};

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async ({
    name,
    email,
    password,
  }: SignupPayload): Promise<SignupResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Signup failed");
      }

      const data: SignupResponse = await res.json();

      // 🔐 Store token immediately
      localStorage.setItem("token", data.token);
      localStorage.setItem("odoo_user", JSON.stringify(data.user));

      return data;
    } catch (err: any) {
      setError(err.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    loading,
    error,
  };
}
