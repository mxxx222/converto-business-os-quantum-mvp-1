/**
 * Magic Link Login Form
 * Email-based passwordless authentication
 */

"use client";
import { useState } from "react";

export default function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState("");

  async function sendMagicLink() {
    if (!email) {
      setStatus("❌ Syötä sähköpostiosoite");
      return;
    }

    setLoading(true);
    setStatus("📧 Lähetetään...");
    setDevLink("");

    try {
      const response = await fetch("/api/v1/auth/magic/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.email_sent) {
        setStatus("✅ Kirjautumislinkki lähetetty sähköpostiisi!");
      } else if (data.dev_link) {
        setStatus("🔧 DEV MODE: Klikkaa linkkiä alta");
        setDevLink(data.dev_link);
      } else {
        setStatus("⚠️ Lähetys epäonnistui");
      }
    } catch (error) {
      setStatus("❌ Virhe lähetyksessä");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Sähköpostiosoite
        </label>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="nimi@yritys.fi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMagicLink()}
        />
      </div>

      <button
        onClick={sendMagicLink}
        disabled={loading}
        className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "Lähetetään..." : "📧 Lähetä kirjautumislinkki"}
      </button>

      {status && (
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          {status}
        </p>
      )}

      {devLink && (
        <div className="mt-4 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
          <p className="text-sm font-medium mb-2">DEV-linkki (klikattava):</p>
          <a
            href={devLink}
            className="text-indigo-700 underline break-all text-sm"
          >
            {devLink}
          </a>
        </div>
      )}
    </div>
  );
}
