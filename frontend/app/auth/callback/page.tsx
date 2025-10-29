/**
 * Magic Link Callback Page
 * Handles magic link verification and session creation
 */

"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("🔄 Kirjaudutaan...");

  useEffect(() => {
    const token = searchParams?.get("token");
    const next = searchParams?.get("next") || "/dashboard";

    if (!token) {
      setMessage("❌ Virhe: puuttuva token");
      setTimeout(() => router.push("/auth"), 2000);
      return;
    }

    // Verify magic link token
    fetch("/api/v1/auth/magic/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token })
    })
      .then((response) => {
        if (response.ok) {
          setMessage("✅ Kirjautuminen onnistui!");
          setTimeout(() => router.push(next), 500);
        } else {
          setMessage("❌ Virheellinen tai vanhentunut linkki");
          setTimeout(() => router.push("/auth"), 2000);
        }
      })
      .catch((error) => {
        console.error("Auth error:", error);
        setMessage("❌ Virhe kirjautumisessa");
        setTimeout(() => router.push("/auth"), 2000);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="text-center">
        <div className="text-6xl mb-4">
          {message.startsWith("✅") ? "🎉" : message.startsWith("❌") ? "⚠️" : "⏳"}
        </div>
        <p className="text-xl font-medium text-gray-800">{message}</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-medium text-gray-800">🔄 Kirjaudutaan...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
