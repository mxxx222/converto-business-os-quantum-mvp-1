/**
 * Logout Button Component
 * Clears session and redirects to auth page
 */

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogout(): Promise<void> {
    setLoading(true);

    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      // Redirect to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Kirjaudutaan ulos..." : "Kirjaudu ulos"}
    </button>
  );
}
