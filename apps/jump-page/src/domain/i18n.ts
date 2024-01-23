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
  "recover.password.title": "Reset password",
  "recover.password.details": "Enter your new password.",
  "recover.password.input.password.label": "Password",
  "recover.password.input.confirmPassword.label": "Confirm password",
  "recover.password.input.placeholder": "Type your new password",
  "recover.password.submit": "Reset password",
  "recover.password.validation.length": "Password is too short",
  "recover.password.validation.password_variants": "Contains word 'password'",
  "recover.password.validation.admin_variants": "Contains word 'admin'",
  "recover.password.validation.user_variants": "Contains word 'user'",
  "recover.password.validation.alphanumeric_sequences_1":
    "Sequence of alphanumeric characters",
  "recover.password.validation.alphanumeric_sequences_2":
    "Sequence of alphanumeric characters",
  "recover.password.validation.numeric_sequences_ascending":
    "Sequence of alphanumeric characters",
  "recover.password.validation.numeric_subsequences_ascending":
    "Sequence of alphanumeric characters",
  "recover.password.validation.numeric_sequences_descending":
    "Sequence of alphanumeric characters",
  "recover.password.validation.numeric_subsequences_descending":
    "Sequence of alphanumeric characters",
  "recover.password.validation.common_password_xkcd": "Common password",
  "success.title": "Thank you, you're signed in!",
  "success.details": "You can now close this page.",
  "error.title": "Something went wrong...",
  "error.detail": "Please log in again.",
};

export type TranslationKeys = keyof typeof defaultStrings;
export type Translations = {
  [key in Language]: {
    [key in TranslationKeys]: string;
  };
};

// TODO add translations for password validation errors
export const I18N: Translations = {
  en: defaultStrings,
  ja: {
    "footer.text": defaultStrings["footer.text"],
    "initial.title": "ログイン処理を行っています。",
    "initial.details": "処理完了後、画面は自動で切り替わります。",
    "success.title": "認証が完了しました！",
    "success.details": "このページを閉じて、元のページへ戻ってください。",
    "recover.password.title": defaultStrings["recover.password.title"],
    "recover.password.details": defaultStrings["recover.password.details"],
    "recover.password.input.password.label":
      defaultStrings["recover.password.input.password.label"],
    "recover.password.input.confirmPassword.label":
      defaultStrings["recover.password.input.confirmPassword.label"],
    "recover.password.input.placeholder":
      defaultStrings["recover.password.input.placeholder"],
    "recover.password.submit": defaultStrings["recover.password.submit"],
    "recover.password.validation.length":
      defaultStrings["recover.password.validation.length"],
    "recover.password.validation.password_variants":
      defaultStrings["recover.password.validation.password_variants"],
    "recover.password.validation.admin_variants":
      defaultStrings["recover.password.validation.admin_variants"],
    "recover.password.validation.user_variants":
      defaultStrings["recover.password.validation.user_variants"],
    "recover.password.validation.alphanumeric_sequences_1":
      defaultStrings["recover.password.validation.alphanumeric_sequences_1"],
    "recover.password.validation.alphanumeric_sequences_2":
      defaultStrings["recover.password.validation.alphanumeric_sequences_2"],
    "recover.password.validation.numeric_sequences_ascending":
      defaultStrings["recover.password.validation.numeric_sequences_ascending"],
    "recover.password.validation.numeric_subsequences_ascending":
      defaultStrings[
        "recover.password.validation.numeric_subsequences_ascending"
      ],
    "recover.password.validation.numeric_sequences_descending":
      defaultStrings[
        "recover.password.validation.numeric_sequences_descending"
      ],
    "recover.password.validation.numeric_subsequences_descending":
      defaultStrings[
        "recover.password.validation.numeric_subsequences_descending"
      ],
    "recover.password.validation.common_password_xkcd":
      defaultStrings["recover.password.validation.common_password_xkcd"],
    "error.title": defaultStrings["error.title"],
    "error.detail": "再度ログインをしてください。",
  },
} as const;

export type TranslationKey = keyof Translations[Language];

export type Translate = (
  key: TranslationKey
) => (typeof I18N)[Language][TranslationKey];

export const createI18n = (language: Language) => (key: TranslationKey) =>
  I18N[language][key];
