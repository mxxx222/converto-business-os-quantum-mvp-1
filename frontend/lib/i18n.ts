/**
 * Internationalization (i18n) Utilities
 * Finnish (FI) default, English (EN) optional
 */

type Locale = "fi" | "en";

const translations = {
  // Common
  common: {
    loading: { fi: "Ladataan...", en: "Loading..." },
    error: { fi: "Virhe", en: "Error" },
    success: { fi: "Onnistui!", en: "Success!" },
    cancel: { fi: "Peruuta", en: "Cancel" },
    save: { fi: "Tallenna", en: "Save" },
    delete: { fi: "Poista", en: "Delete" },
    edit: { fi: "Muokkaa", en: "Edit" },
    close: { fi: "Sulje", en: "Close" },
    back: { fi: "Takaisin", en: "Back" },
    next: { fi: "Seuraava", en: "Next" },
    search: { fi: "Hae...", en: "Search..." },
    noResults: { fi: "Ei tuloksia", en: "No results" }
  },

  // Dashboard
  dashboard: {
    title: { fi: "Dashboard", en: "Dashboard" },
    welcome: { fi: "Tervetuloa", en: "Welcome" },
    quickActions: { fi: "Pikatoiminnot", en: "Quick Actions" },
    recentActivity: { fi: "Viimeisimmät tapahtumat", en: "Recent Activity" }
  },

  // Receipts
  receipts: {
    title: { fi: "Kuitit", en: "Receipts" },
    scan: { fi: "Skannaa kuitti", en: "Scan Receipt" },
    upload: { fi: "Lataa kuva", en: "Upload Image" },
    dropHere: { fi: "Pudota kuitti tähän", en: "Drop receipt here" },
    processing: { fi: "Käsitellään...", en: "Processing..." },
    noReceipts: { fi: "Ei vielä kuitteja", en: "No receipts yet" },
    vendor: { fi: "Kauppias", en: "Vendor" },
    date: { fi: "Päivämäärä", en: "Date" },
    total: { fi: "Yhteensä", en: "Total" },
    vat: { fi: "ALV", en: "VAT" }
  },

  // AI & Providers
  ai: {
    provider: { fi: "AI-palveluntarjoaja", en: "AI Provider" },
    local: { fi: "Paikallinen", en: "Local" },
    cloud: { fi: "Pilvi", en: "Cloud" },
    processing: { fi: "AI käsittelee...", en: "AI processing..." },
    confidence: { fi: "Luottamus", en: "Confidence" },
    switchTo: { fi: "Vaihda", en: "Switch to" }
  },

  // Billing
  billing: {
    title: { fi: "Laskutus", en: "Billing" },
    subscription: { fi: "Tilaus", en: "Subscription" },
    plan: { fi: "Paketti", en: "Plan" },
    invoices: { fi: "Laskut", en: "Invoices" },
    paymentMethod: { fi: "Maksutapa", en: "Payment Method" },
    changePlan: { fi: "Vaihda pakettia", en: "Change Plan" }
  },

  // Settings
  settings: {
    title: { fi: "Asetukset", en: "Settings" },
    profile: { fi: "Profiili", en: "Profile" },
    privacy: { fi: "Tietosuoja", en: "Privacy" },
    language: { fi: "Kieli", en: "Language" },
    notifications: { fi: "Ilmoitukset", en: "Notifications" },
    keepDataLocal: { fi: "Pidä data paikallisena", en: "Keep data local" },
    enableSounds: { fi: "Äänitehosteet", en: "Sound effects" }
  },

  // Data Health
  health: {
    title: { fi: "Datan terveys", en: "Data Health" },
    status: { fi: "Tila", en: "Status" },
    lastBackup: { fi: "Viimeisin varmuuskopio", en: "Last Backup" },
    createBackup: { fi: "Ota varmuuskopio", en: "Create Backup" },
    noBackups: { fi: "Ei varmuuskopioita", en: "No backups" }
  },

  // Command Palette
  commands: {
    search: { fi: "Hae komentoa...", en: "Search commands..." },
    noResults: { fi: "Ei tuloksia haulle", en: "No results for" },
    categories: {
      actions: { fi: "Toiminnot", en: "Actions" },
      navigation: { fi: "Navigointi", en: "Navigation" },
      settings: { fi: "Asetukset", en: "Settings" },
      reports: { fi: "Raportit", en: "Reports" },
      system: { fi: "Järjestelmä", en: "System" }
    }
  },

  // Privacy & Local
  privacy: {
    localIntelligence: { fi: "Local Intelligence", en: "Local Intelligence" },
    dataStaysLocal: { fi: "Data ei poistu Suomesta", en: "Data stays in Finland" },
    gdprCompliant: { fi: "GDPR-yhteensopiva", en: "GDPR Compliant" },
    offlineCapable: { fi: "Toimii offline", en: "Works Offline" }
  },

  // Risk & Confidence
  risk: {
    low: { fi: "Matala riski", en: "Low Risk" },
    medium: { fi: "Keskitaso", en: "Medium Risk" },
    high: { fi: "Korkea riski", en: "High Risk" },
    confidence: { fi: "Luottamus", en: "Confidence" }
  }
};

/**
 * Get translation
 */
export function t(key: string, locale: Locale = "fi"): string {
  const keys = key.split(".");
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }

  if (typeof value === "object" && value[locale]) {
    return value[locale];
  }

  return key; // Fallback to key if not found
}

/**
 * Get current locale from browser
 */
export function getLocale(): Locale {
  if (typeof window === "undefined") return "fi";

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith("fi")) return "fi";
  if (browserLang.startsWith("en")) return "en";

  return "fi"; // Default
}

/**
 * Set locale (store in localStorage)
 */
export function setLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  localStorage.setItem("converto_locale", locale);
}

/**
 * Format number
 */
export function formatNumber(num: number, locale: Locale = "fi"): string {
  return new Intl.NumberFormat(locale === "fi" ? "fi-FI" : "en-US").format(num);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, locale: Locale = "fi"): string {
  return new Intl.NumberFormat(locale === "fi" ? "fi-FI" : "en-US", {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date | string, locale: Locale = "fi"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateFormat(locale === "fi" ? "fi-FI" : "en-US").format(d);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string, locale: Locale = "fi"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale === "fi" ? "fi-FI" : "en-US", { numeric: "auto" });

  if (diffDay > 0) return rtf.format(-diffDay, "day");
  if (diffHour > 0) return rtf.format(-diffHour, "hour");
  if (diffMin > 0) return rtf.format(-diffMin, "minute");
  return rtf.format(-diffSec, "second");
}
