"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const items = [
    {
      quote: "Kuittikaaos katosi viikossa. Säästämme 6h / kk manuaalista työtä.",
      name: "Sanna K.",
      role: "Kahvilayrittäjä",
      company: "HerbSpot™",
    },
    {
      quote: "ALV virheettömästi – ja raportti lähtee automaattisesti kirjanpitäjälle.",
      name: "Jere M.",
      role: "Toiminimi",
      company: "Fixu™",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
        Mitä asiakkaat sanovat
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((testimonial, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 relative"
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-converto-blue opacity-20" />
            <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300 italic">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-converto-blue to-converto-sky flex items-center justify-center text-white font-bold">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

