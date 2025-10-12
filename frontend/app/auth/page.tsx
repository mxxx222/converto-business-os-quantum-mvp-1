/**
 * Authentication Page
 * Unified login with WebAuthn, Magic Link, and TOTP
 */

import MagicLinkForm from "./components/MagicLinkForm";
import { TotpEnroll, TotpVerify } from "./components/TotpForm";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kirjaudu Convertoon
          </h1>
          <p className="text-gray-600">
            Valitse kirjautumistapa
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Magic Link (Primary) */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                📧 Kirjaudu sähköpostilla
              </h2>
              <p className="text-sm text-gray-600">
                Suositelluin tapa - saat linkin sähköpostiisi
              </p>
            </div>
            <MagicLinkForm />
          </div>

          {/* TOTP (Optional) */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                🔒 2FA (valinnainen)
              </h2>
              <p className="text-sm text-gray-600">
                Google Authenticator / Authy
              </p>
            </div>

            <div className="space-y-6">
              {/* Enroll */}
              <div className="pb-6 border-b">
                <TotpEnroll />
              </div>

              {/* Verify */}
              <div>
                <TotpVerify />
              </div>
            </div>
          </div>
        </div>

        {/* WebAuthn Info (Coming Soon) */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🔐</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                Face ID / Touch ID - Tulossa pian!
              </h3>
              <p className="text-sm text-gray-700">
                Biometrinen kirjautuminen (WebAuthn/Passkeys) lisätään seuraavassa
                päivityksessä. Tällä hetkellä voit käyttää sähköpostilinkki tai
                TOTP-koodia.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Ongelmat kirjautumisessa?{" "}
            <a href="mailto:support@converto.fi" className="text-indigo-600 hover:underline">
              Ota yhteyttä tukeen
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

