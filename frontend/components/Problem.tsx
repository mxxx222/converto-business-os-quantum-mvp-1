interface ProblemProps {
  title: string
  bullets: string[]
}

export default function Problem({ title, bullets }: ProblemProps) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">{title}</h2>
        <div className="space-y-6">
          {bullets.map((bullet, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                ✕
              </div>
              <p className="text-lg text-gray-700">{bullet}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}