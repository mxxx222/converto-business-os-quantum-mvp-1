"use client";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function ChurnDeflectModal({
  onKeep,
  onDowngrade,
  onCancel,
}: {
  onKeep: () => void;
  onDowngrade: () => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
      >
        Peruuta tilaus
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Ennen kuin lähdet...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vaihda mieluummin alennukseen tai alempaan pakettiin?
              </p>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 text-center">
              Tarjoamme <strong className="text-emerald-600">-30% alennuksen 3 kuukaudeksi</strong>{" "}
              tai voit vaihtaa kevyempään pakettiin yhdellä klikkauksella.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onKeep();
                  setOpen(false);
                }}
                className="w-full rounded-xl bg-emerald-500 text-white py-3 font-semibold hover:bg-emerald-600 active:scale-95 transition-all"
              >
                💚 Pidä & saa -30% alennus 3 kk
              </button>
              <button
                onClick={() => {
                  onDowngrade();
                  setOpen(false);
                }}
                className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 py-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
              >
                ⬇️ Vaihda Starter-pakettiin
              </button>
              <button
                onClick={() => {
                  onCancel();
                  setOpen(false);
                }}
                className="w-full rounded-xl border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 py-3 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all"
              >
                ❌ Peru lopullisesti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

