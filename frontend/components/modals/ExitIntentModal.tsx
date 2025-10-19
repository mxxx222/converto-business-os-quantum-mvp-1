"use client";
import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";

export default function ExitIntentModal({
  onAccept,
  onDismiss,
}: {
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let triggered = false;
    const handler = (e: MouseEvent) => {
      if (e.clientY < 10 && !triggered) {
        triggered = true;
        setOpen(true);
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl relative">
        <button
          onClick={() => {
            onDismiss();
            setOpen(false);
          }}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <Gift className="w-16 h-16 mx-auto mb-4 text-converto-blue" />
          <h3 className="text-2xl font-bold mb-2">Vielä hetki! 🎁</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Saat <strong className="text-converto-blue">-30% alennuksen 3 kuukaudeksi</strong>{" "}
            tai <strong className="text-converto-blue">ilmaisen käyttöönoton</strong>!
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onAccept();
              setOpen(false);
            }}
            className="w-full rounded-xl bg-emerald-500 text-white py-3 font-semibold hover:bg-emerald-600 active:scale-95 transition-all"
          >
            ✨ Kyllä, haluan -30% alennuksen!
          </button>
          <button
            onClick={() => {
              onDismiss();
              setOpen(false);
            }}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            Ei kiitos, jatkan selailua
          </button>
        </div>
      </div>
    </div>
  );
}
