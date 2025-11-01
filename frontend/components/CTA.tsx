import Link from "next/link"

interface CTAProps {
  title: string
  subtitle: string
  ctaLabel: string
  href: string
}

export default function CTA({ title, subtitle, ctaLabel, href }: CTAProps) {
  return (
    <section className="py-20 px-6 bg-blue-600 text-white">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-4xl font-bold">{title}</h2>
        <p className="text-xl opacity-90">{subtitle}</p>
        <Link
          href={href}
          className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  )
}