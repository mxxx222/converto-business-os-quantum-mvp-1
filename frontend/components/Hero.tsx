import Link from "next/link"

interface HeroProps {
  title: string
  subtitle: string
  ctaPrimary: { label: string; href: string }
  image?: string
}

export default function Hero({ title, subtitle, ctaPrimary, image }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href={ctaPrimary.href}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {ctaPrimary.label}
          </Link>
        </div>
        {image && (
          <div className="mt-12">
            <img src={image} alt="Hero" className="max-w-full h-auto rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </section>
  )
}