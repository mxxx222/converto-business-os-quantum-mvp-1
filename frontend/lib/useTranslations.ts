import fi from "@/locales/fi.json";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

const dict = { fi, en, ru };

export function useTranslations(lang: string) {
  return dict[lang as keyof typeof dict] || fi;
}
