'use client';

import { motion } from 'framer-motion';
import data from '../../content/mapping.json';

export default function Hero(): JSX.Element {
  const hero = data.hero;

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold gradient-text mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.a
              href={hero.primaryCta.href}
              className="btn-primary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {hero.primaryCta.label}
            </motion.a>

            <motion.a
              href={hero.secondaryCta.href}
              className="btn-secondary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {hero.secondaryCta.label}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Floating elements for visual appeal */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-accent-200 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  );
}
