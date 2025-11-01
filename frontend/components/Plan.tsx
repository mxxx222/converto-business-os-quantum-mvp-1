interface Step {
  number: string
  text: string
}

interface PlanProps {
  title: string
  steps: Step[]
}

export default function Plan({ title, steps }: PlanProps) {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">{title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <p className="text-lg text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}