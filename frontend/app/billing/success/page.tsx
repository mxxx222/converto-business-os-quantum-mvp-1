"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-[80vh] text-center px-4"
    >
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold text-green-600 mb-2">Maksu onnistui!</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Tilaus on nyt aktiivinen ja pisteet lisätty Gamify-saldoosi. Tervetuloa Converto Business OS:n käyttäjäksi!
      </p>
      <Link href="/billing" className="text-blue-600 hover:underline font-medium">
        ← Palaa laskutukseen
      </Link>
    </motion.div>
  );
}

