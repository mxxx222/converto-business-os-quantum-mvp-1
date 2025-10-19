/**
 * Logout Page
 * Immediately logs out user and redirects to auth
 */

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function performLogout() {
      try {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          credentials: "include"
        });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Always redirect to auth, even if logout fails
        router.replace("/auth");
      }
    }

    performLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">👋</div>
        <p className="text-xl text-gray-700">Kirjaudutaan ulos...</p>
      </div>
    </div>
  );
}
