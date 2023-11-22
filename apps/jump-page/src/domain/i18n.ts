// based on RFC 5646
export type Language = "en" | "ja";

/**
 * Check the language based on the browser settings.
 * Default to "en"
 */
export function detectLanguage(): Language {
  const language = navigator.language.toLowerCase();
  if (language === "ja" || language.startsWith("ja-")) {
    return "ja";
  }

  return "en";
}

export const defaultStrings = {
  "footer.text": "Top-tier security by SlashID",
  "initial.title": "Logging you in...",
  "initial.details": "Please follow the on-screen instructions.",
  "success.title": "Thank you, you're signed in!",
  "success.details": "You can now close this page.",
  "error.title": "Please log in again.",
};

export type TranslationKeys = keyof typeof defaultStrings;
export type Translations = {
  [key in Language]: {
    [key in TranslationKeys]: string;
  };
};

export const I18N: Translations = {
  en: defaultStrings,
  ja: {
    "footer.text": defaultStrings["footer.text"],
    "initial.title": "ログイン処理を行っています。",
    "initial.details": "処理完了後、画面は自動で切り替わります。",
    "success.title": "認証が完了しました！",
    "success.details": "このページを閉じて、元のページへ戻ってください。",
    "error.title": "再度ログインをしてください。",
  },
} as const;

export type TranslationKey = keyof Translations[Language];

export type Translate = (
  key: TranslationKey
) => (typeof I18N)[Language][TranslationKey];

export const createI18n = (language: Language) => (key: TranslationKey) =>
  I18N[language][key];
