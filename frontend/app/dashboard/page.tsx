import dynamic from "next/dynamic";

const OcrResults = dynamic(() => import("@/components/OcrResults"), { ssr: false });
const GamifyCard = dynamic(() => import("@/components/GamifyCard"), { ssr: false });
const WalletWidget = dynamic(() => import("@/components/WalletWidget"), { ssr: false });
const QuestList = dynamic(() => import("@/components/QuestList"), { ssr: false });
const RewardsList = dynamic(() => import("@/components/RewardsList"), { ssr: false });
const OCRDropzone = dynamic(() => import("@/components/OCRDropzone"), { ssr: false });
const OCRStatus = dynamic(() => import("@/components/OCRStatus"), { ssr: false });
const OCRHotkeys = dynamic(() => import("@/components/OCRHotkeys"), { ssr: false });

"use client";
import { useState } from "react";

export default function Dashboard() {
  const [showHotkeys, setShowHotkeys] = useState(true);

  const handleHotkeyAction = (action: string) => {
    console.log("Hotkey action:", action);
    if (action === "scan") {
      document.getElementById("ocr-dropzone")?.scrollIntoView({ behavior: "smooth" });
    }
    // TODO: implement other actions
  };

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Converto — OCR & AI Insights</h1>
        <button
          onClick={() => setShowHotkeys(!showHotkeys)}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          {showHotkeys ? "Piilota" : "Näytä"} hotkeys
        </button>
      </header>
      
      <div id="ocr-dropzone">
        <OCRDropzone onScanComplete={(r) => console.log("Scan complete:", r)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <OcrResults tenant="demo" />
          <OCRStatus tenant="demo" />
        </div>
        <div className="space-y-6">
          <GamifyCard tenant="demo" user="user_demo" />
          <WalletWidget tenant="demo" user="user_demo" />
          <QuestList tenant="demo" />
          <RewardsList tenant="demo" />
        </div>
      </div>
      
      {showHotkeys && <OCRHotkeys onAction={handleHotkeyAction} />}
    </main>
  );
}


