export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">© {new Date().getFullYear()} Converto Solutions Oy</p>
        <div className="flex items-center gap-4 text-sm">
          <a href="/terms" className="text-gray-600 hover:text-gray-900">Käyttöehdot</a>
          <a href="/privacy" className="text-gray-600 hover:text-gray-900">Tietosuoja</a>
          <a href="https://app.converto.fi/login" className="text-gray-600 hover:text-gray-900">Kirjaudu</a>
          <a href="https://app.converto.fi/signup" className="text-gray-600 hover:text-gray-900">Aloita</a>
        </div>
      </div>
    </footer>
  )
}