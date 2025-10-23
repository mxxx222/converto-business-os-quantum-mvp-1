export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 Converto Business OS
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Quantum Edition - Frontend is Live!
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Dashboard
          </a>
          <a
            href="/api/health"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Health Check
          </a>
        </div>
      </div>
    </div>
  );
}
