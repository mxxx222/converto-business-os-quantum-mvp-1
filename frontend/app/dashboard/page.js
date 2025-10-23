export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Converto Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to your Business OS Control Center
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Analytics</h3>
              <p className="text-gray-600">Business insights and reporting</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">💳 Billing</h3>
              <p className="text-gray-600">Subscription and payment management</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">⚙️ Settings</h3>
              <p className="text-gray-600">Account and system configuration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
