export default function TrustBadges() {
  const items = [
    { label: "GDPR-yhteensopiva", emoji: "🛡️" },
    { label: "EU-pilvi / FI-data", emoji: "🇪🇺" },
    { label: "Tehty Suomessa", emoji: "🇫🇮" },
    { label: "SSL / 2FA", emoji: "🔒" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {items.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span className="text-lg">{item.emoji}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
