/**
 * TOTP 2FA Components
 * Google Authenticator / Authy enrollment and verification
 */

"use client";
import { useState } from "react";

export function TotpEnroll() {
  const [email, setEmail] = useState("");
  const [uri, setUri] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);

  async function enrollTotp() {
    if (!email) return;

    setLoading(true);

    try {
      const response = await fetch("/api/v1/auth/totp/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setUri(data.uri);
      setSecret(data.secret);
    } catch (error) {
      console.error("TOTP enrollment failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Luo TOTP-avain</h3>
      <input
        type="email"
        className="w-full border rounded-lg px-3 py-2 text-sm"
        placeholder="sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={enrollTotp}
        disabled={loading}
        className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-900 disabled:opacity-50"
      >
        Luo avain
      </button>

      {uri && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs font-medium mb-2">
            Skannaa QR-koodi Google Authenticatorilla:
          </p>
          <div className="bg-white p-2 rounded inline-block">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`}
              alt="TOTP QR Code"
              className="w-40 h-40"
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 break-all">
            <strong>Secret:</strong> {secret}
          </p>
        </div>
      )}
    </div>
  );
}

export function TotpVerify() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function verifyTotp() {
    if (!email || !code) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/v1/auth/totp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });

      if (response.ok) {
        setMessage("✅ Kirjautuminen onnistui!");
        // Redirect to dashboard after 1s
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        const data = await response.json();
        setMessage(`❌ ${data.detail || "Virheellinen koodi"}`);
      }
    } catch (error) {
      setMessage("❌ Verkkovirhe");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Kirjaudu TOTP-koodilla</h3>
      <input
        type="email"
        className="w-full border rounded-lg px-3 py-2 text-sm"
        placeholder="sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        className="w-full border rounded-lg px-3 py-2 text-sm font-mono"
        placeholder="6-numeroinen koodi"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        maxLength={6}
      />
      <button
        onClick={verifyTotp}
        disabled={loading || code.length !== 6}
        className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-50"
      >
        Vahvista
      </button>

      {message && (
        <p className="text-sm mt-2">
          {message}
        </p>
      )}
    </div>
  );
}
