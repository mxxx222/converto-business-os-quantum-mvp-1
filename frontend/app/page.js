"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-8">
          🚀 Coming Soon
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Converto Business OS
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quantum Edition
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The future of business automation is coming. AI-powered receipt scanning,
          VAT automation, and intelligent business insights - all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => window.open('mailto:hello@converto.fi?subject=Early Access Request', '_blank')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Get Early Access
          </button>
          <a
            href="/api/health"
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
          >
            System Status
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              📄
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Receipt Scanning</h3>
            <p className="text-gray-600">Automatic data extraction from receipts using advanced AI vision</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              💰
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">VAT Automation</h3>
            <p className="text-gray-600">Regulatory compliant VAT calculations and automated reporting</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              🧠
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Intelligence</h3>
            <p className="text-gray-600">AI-powered insights and predictive analytics for your business</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">Built with ❤️ in Finland 🇫🇮</p>
          <p className="text-sm text-gray-400">© 2025 Converto Solutions Oy. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
