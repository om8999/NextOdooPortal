"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/app/lib/api";

type User = {
  uid: number;
  login: string;
  name: string;
  is_admin: boolean;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      getMe()
        .then((data) => {
          setUser(data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("odoo_user");
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    }, []);

    return {
      user,
      loading,
      isAuthenticated,
    };
  }

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("odoo_user");
}
