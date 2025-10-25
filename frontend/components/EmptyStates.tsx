"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function ReceiptsEmpty(): JSX.Element {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-64 h-64 mb-8 relative">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-9xl">📸</div>
        </motion.div>
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        Ei vielä kuitteja
      </h3>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Aloita skannaamalla ensimmäinen kuitti. Se on nopeaa ja helppoa!
      </p>

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/selko/ocr")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          📸 Skannaa kuitti
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Seed demo data
            fetch("/api/v1/demo/seed", { method: "POST" })
              .then(() => window.location.reload());
          }}
          className="px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-medium hover:border-indigo-300 hover:bg-indigo-50 transition-all"
        >
          🎭 Lataa demo-data
        </motion.button>
      </div>

      <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 max-w-lg">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Vinkki</h4>
        <p className="text-sm text-gray-700">
          Voit myös pudottaa kuitti-kuvan suoraan skannaus-sivulle tai käyttää
          Command Palette (⌘K) pikavalintaan.
        </p>
      </div>
    </motion.div>
  );
}

export function ChatEmpty(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-8xl mb-6">💬</div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        Aloita keskustelu
      </h3>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Kysy mitä vaan kuiteista, ALV:stä tai kirjanpidosta. AI auttaa!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
        {[
          { icon: "🧾", title: "ALV-ilmoitus", prompt: "Miten teen ALV-ilmoituksen?" },
          { icon: "📊", title: "Raportti", prompt: "Näytä kulujen yhteenveto tälle kuulle" },
          { icon: "💡", title: "Vinkki", prompt: "Miten voin säästää kirjanpidossa?" },
          { icon: "📈", title: "Ennuste", prompt: "Arvioi seuraavan kuukauden kulut" }
        ].map((example, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-left transition-all group"
          >
            <div className="text-2xl mb-2">{example.icon}</div>
            <div className="font-medium text-gray-900 mb-1">{example.title}</div>
            <div className="text-sm text-gray-600 group-hover:text-indigo-600">
              "{example.prompt}"
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export function DashboardEmpty(): JSX.Element {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-8xl mb-6">🚀</div>

      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
        Tervetuloa Converto™ Business OS:ään!
      </h3>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Aloita 3-vaiheisella pikaoppaalla tai sukella suoraan sisään.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-8">
        {[
          { step: "1", icon: "📸", title: "Skannaa kuitti", desc: "Ota kuva tai vedä tiedosto" },
          { step: "2", icon: "🤖", title: "AI analysoi", desc: "Automaattinen luokittelu ja ALV" },
          { step: "3", icon: "📊", title: "Seuraa tilannetta", desc: "Raportit ja ennusteet" }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg flex items-center justify-center mx-auto mb-4">
              {item.step}
            </div>
            <div className="text-3xl mb-3">{item.icon}</div>
            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/selko/ocr")}
        className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
      >
        Aloita nyt 🚀
      </motion.button>
    </motion.div>
  );
}
