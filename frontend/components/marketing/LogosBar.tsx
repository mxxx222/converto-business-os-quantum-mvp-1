"use client";

export default function LogosBar() {
  // Placeholder logos - replace with actual client logos
  const logos = [
    { name: "Fixu™", color: "#39FF14" },
    { name: "HerbSpot™", color: "#2ECC71" },
    { name: "Fiksukasvu™", color: "#0047FF" },
    { name: "LegalEngine™", color: "#444B5A" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 bg-gray-50 dark:bg-gray-800/50">
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
        Luotettu partneri yli 150+ suomalaiselle yritykselle
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="flex items-center justify-center h-16 px-4 opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="text-center">
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: logo.color }}
              >
                {logo.name.charAt(0)}
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {logo.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

