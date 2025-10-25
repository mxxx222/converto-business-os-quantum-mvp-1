"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SignupFormData {
  email: string;
  name: string;
  company: string;
  phone: string;
  notes: string;
  honeypot: string; // For spam protection
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    name: "",
    company: "",
    phone: "",
    notes: "",
    honeypot: "",
  });

  // Extract UTM parameters from URL
  useEffect(() => {
    const utm_source = searchParams.get("utm_source");
    const utm_medium = searchParams.get("utm_medium");
    const utm_campaign = searchParams.get("utm_campaign");

    if (utm_source || utm_medium || utm_campaign) {
      // Store UTM params for submission
      localStorage.setItem("signup_utm", JSON.stringify({
        utm_source,
        utm_medium,
        utm_campaign,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Honeypot check
    if (formData.honeypot) {
      return; // Silently ignore spam
    }

    // Basic validation
    if (!formData.email || !formData.name) {
      setError("Sähköposti ja nimi ovat pakollisia");
      return;
    }

    setLoading(true);

    try {
      // Get stored UTM parameters
      const utmData = localStorage.getItem("signup_utm");
      const utm = utmData ? JSON.parse(utmData) : {};

      const response = await fetch("/api/v2/signups/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...utm,
        }),
      });

      if (!response.ok) {
        throw new Error("Rekisteröityminen epäonnistui");
      }

      setSubmitted(true);
      setResendCooldown(60); // 60 second cooldown

      // Start cooldown timer
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Tuntematon virhe");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v2/signups/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Uudelleenlähetys epäonnistui");
      }

      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Tuntematon virhe");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tarkista sähköpostisi
          </h3>
          <p className="text-gray-600 mb-6">
            Lähetimme vahvistuslinkin osoitteeseen <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Go-live 3–7 arkipäivässä käyttöönoton jälkeen.
          </p>
          {resendCooldown > 0 ? (
            <p className="text-sm text-gray-500">
              Uudelleenlähetys mahdollinen {resendCooldown} sekunnin kuluttua
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              {loading ? "Lähetetään..." : "Lähetä uudelleen"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Aloita Converto
        </h3>
        <p className="text-gray-600 text-sm">
          Täytä tiedot aloittaaksesi ilmaisen kokeilujakson
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Sähköposti *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="etunimi.sukunimi@yritys.fi"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nimi *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Etunimi Sukunimi"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Yritys
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Yrityksen nimi"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Puhelinnumero
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="+358 50 123 4567"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Lisätiedot (valinnainen)
          </label>
          <textarea