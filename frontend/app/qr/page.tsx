"use client";
import { useState } from "react";
import { Camera, Receipt, Calculator, FileText, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function QRLandingPage() {
  const [scanned, setScanned] = useState(false);

  const quickActions = [
    {
      icon: Camera,
      label: "Skannaa kuitti",
      href: "/receipts/new",
      color: "from-blue-500 to-cyan-500",
      description: "Lataa kuitti ja käsittele automaattisesti"
    },
    {
      icon: Calculator,
      label: "ALV-laskuri",
      href: "/vat",
      color: "from-purple-500 to-pink-500",
      description: "Laske ALV automaattisesti"
    },
    {
      icon: FileText,
      label: "Raportit",
      href: "/reports",
      color: "from-emerald-500 to-teal-500",
      description: "Tarkastele raportteja"
    }
  ];

  const stats = [
    { label: "Kuitteja käsitelty", value: "1,247", change: "+23%" },
    { label: "Aikaa säästetty", value: "156h", change: "+45%" },
    { label: "ALV-virheet", value: "0", change: "-100%" },
    { label: "Tyytyväisiä", value: "98%", change: "+12%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-gray-900">Converto</span>
            </div>
            <div className="text-sm text-gray-500">Business OS</div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tervetuloa Convertoon!
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Automaattinen kuittien käsittely ja ALV-laskenta yrittäjille. 
            Säästä aikaa ja vähennä virheitä.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-green-600 mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pikatoiminnot</h2>
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{action.label}</div>
                      <div className="text-sm text-gray-500">{action.description}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center mb-6">
          <h3 className="text-lg font-bold mb-2">Aloita heti</h3>
          <p className="text-blue-100 text-sm mb-4">
            {process.env.NEXT_PUBLIC_REGISTRATION_OPEN === 'true' 
              ? 'Rekisteröidy ja käsittele ensimmäinen kuitti ilmaiseksi'
              : 'Ilmoittautuminen alkaa 5-6 päivän kuluttua'
            }
          </p>
          <Link href="/register">
            <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              {process.env.NEXT_PUBLIC_REGISTRATION_OPEN === 'true' 
                ? 'Ilmoittaudu nyt'
                : 'Ilmoittautuminen alkaa pian'
              }
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900">Miksi Converto?</h2>
          <div className="space-y-3">
            {[
              "🤖 AI-käyttöinen OCR-kuittien lukeminen",
              "📊 Automaattinen ALV-laskenta ja raportointi",
              "📱 Mobiilioptimoitu käyttöliittymä",
              "🔒 Turvallinen ja GDPR-yhteensopiva",
              "⚡ Reaaliaikainen käsittely",
              "📈 Kustannussäästöjen seuranta"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-2">
          <div>© 2024 Converto Business OS</div>
          <div className="flex justify-center gap-4">
            <Link href="/privacy" className="hover:text-gray-700">Tietosuoja</Link>
            <Link href="/terms" className="hover:text-gray-700">Käyttöehdot</Link>
            <Link href="/contact" className="hover:text-gray-700">Yhteystiedot</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
