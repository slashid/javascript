import { useMemo } from "react";
import { createI18n } from "../../domain/i18n";
import { useAppContext } from "../app/app.context";

export function useI18n() {
  const { language } = useAppContext();

  const i18n = useMemo(() => {
    return createI18n(language);
  }, [language]);

  return i18n;
}
