"use client";
import { useState } from "react";
import { ArrowLeft, CheckCircle, Clock, CreditCard } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    plan: 'pro',
    terms: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    { id: 'lite', name: 'Lite', price: '29', features: ['Kuittiskannaus', 'Perusraportit'] },
    { id: 'pro', name: 'Pro', price: '99', features: ['Myynnin seuranta', 'AI-ehdotukset', 'Viikkoraportit'], popular: true },
    { id: 'insights', name: 'Insights', price: '199', features: ['Ennusteet', 'Kustannusvahti', 'PDF-raportit johdolle'] }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mockPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: formData.plan,
          amount: plans.find(p => p.id === formData.plan)?.price,
          email: formData.email,
          company: formData.company
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Ilmoittautuminen epäonnistui');
      }
    } catch (err) {
      setError('Verkkovirhe. Yritä uudelleen.');
    } finally {
      setLoading(false);
    }
  };

  const registrationOpen = process.env.NEXT_PUBLIC_REGISTRATION_OPEN === 'true';

  if (!registrationOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center">
            <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Ilmoittautuminen alkaa pian!
            </h1>
            <p className="text-gray-600 mb-6">
              Converto Business OS tulee pian saataville. 
              Ilmoittautuminen alkaa 5-6 päivän kuluttua.
            </p>
            <Link href="/qr">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                Takaisin etusivulle
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Ilmoittautuminen onnistui!
            </h1>
            <p className="text-gray-600 mb-6">
              Kiitos ilmoittautumisesta! Lähetämme sinulle sähköpostitse 
              lisätiedot kun palvelu käynnistyy.
            </p>
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Ilmoittautumistiedot</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Sähköposti: {formData.email}</div>
                <div>Yritys: {formData.company}</div>
                <div>Paketti: {plans.find(p => p.id === formData.plan)?.name}</div>
              </div>
            </div>
            <Link href="/qr">
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
                Jatka etusivulle
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/qr" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Ilmoittaudu</h1>
              <p className="text-sm text-gray-500">Valitse sopiva paketti</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Yritystiedot</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sähköposti *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="yritys@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yrityksen nimi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Yritys Oy"
                />
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Valitse paketti</h2>
            <div className="space-y-3">
              {plans.map((plan) => (
                <label key={plan.id} className="block">
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={formData.plan === plan.id}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.plan === plan.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-blue-200' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{plan.name}</span>
                        {plan.popular && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Suosittu
                          </span>
                        )}
                      </div>
                      <span className="text-lg font-bold text-gray-900">{plan.price}€/kk</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.checked})}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Hyväksyn <Link href="/terms" className="text-blue-600 hover:underline">käyttöehdot</Link> ja 
              <Link href="/privacy" className="text-blue-600 hover:underline"> tietosuojakäytännön</Link>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.terms}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Käsitellään...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Ilmoittaudu nyt
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Maksu käsitellään mock-tilassa. Oikea maksujärjestelmä tulee myöhemmin.
          </p>
        </form>
      </div>
    </div>
  );
}
