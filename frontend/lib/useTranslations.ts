import fi from "@/locales/fi.json";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

const dict: Record<string, typeof fi> = { fi, en, ru };

export function useTranslations(lang: string): typeof fi {
  return dict[lang as keyof typeof dict] || fi;
}
