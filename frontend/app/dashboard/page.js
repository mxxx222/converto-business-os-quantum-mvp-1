// @ts-nocheck
import HealthStatus from "./components/HealthStatus";
import SignupStatsTile from "../../components/SignupStatsTile";
import HealthTile from "../../components/HealthTile";

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-8">
            <SignupStatsTile />
            <HealthTile />

            <a href="/receipts/new" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🧾 Receipts</h3>
              <p className="text-gray-600">Scan or upload a new receipt</p>
            </a>

            <a href="/billing" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">💳 Billing</h3>
              <p className="text-gray-600">Plans and subscriptions</p>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <HealthStatus />

            <a href="/receipts/new" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🧾 Receipts</h3>
              <p className="text-gray-600">Scan or upload a new receipt</p>
            </a>

            <a href="/billing" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">💳 Billing</h3>
              <p className="text-gray-600">Plans and subscriptions</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
