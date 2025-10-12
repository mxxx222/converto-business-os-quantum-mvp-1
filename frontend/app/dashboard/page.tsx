import dynamic from "next/dynamic";

const OcrResults = dynamic(() => import("@/components/OcrResults"), { ssr: false });
const GamifyCard = dynamic(() => import("@/components/GamifyCard"), { ssr: false });
const WalletWidget = dynamic(() => import("@/components/WalletWidget"), { ssr: false });
const QuestList = dynamic(() => import("@/components/QuestList"), { ssr: false });

export default function Dashboard() {
  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Converto — OCR & AI Insights</h1>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <OcrResults tenant="demo" />
        <div className="space-y-6">
          <GamifyCard tenant="demo" user="user_demo" />
          <WalletWidget tenant="demo" user="user_demo" />
          <QuestList tenant="demo" />
        </div>
      </div>
    </main>
  );
}


