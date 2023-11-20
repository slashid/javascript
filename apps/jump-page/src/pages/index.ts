import { SlashID } from "@slashid/slashid";

const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || "";

type SlashIDError = Error & {
  errors: Array<{ message: string }>;
};

function isSlashIDError(e: any): e is SlashIDError {
  if (Array.isArray(e.errors)) {
    return true;
  }

  return false;
}

type Language = "en" | "ja";

function detectLanguage(): Language {
  const language = navigator.language.toLowerCase();
  if (language === "ja" || language.startsWith("ja-")) {
    return "ja";
  }

  return "en";
}

const defaultStrings = {
  "initial.title": "Logging you in...",
  "initial.details": "Please follow the on-screen instructions.",
  "success.title": "Thank you, you're signed in!",
  "success.details": "You can now close this page.",
  "error.title": "Please log in again.",
};

type TranslationKeys = keyof typeof defaultStrings;
type Translations = {
  [key in Language]: {
    [key in TranslationKeys]: string;
  };
};

const I18N: Translations = {
  en: defaultStrings,
  ja: {
    "initial.title": "ログイン処理を行っています。",
    "initial.details": "処理完了後、画面は自動で切り替わります。",
    "success.title": "認証が完了しました！",
    "success.details": "このページを閉じて、元のページへ戻ってください。",
    "error.title": "再度ログインをしてください。",
  },
} as const;

type TranslationKey = keyof Translations[Language];

const createI18n = (language: Language) => (key: TranslationKey) =>
  I18N[language][key];

export async function main() {
  const spinner = document.getElementById("spinner")!;
  const spinnerParent = spinner.parentNode!;
  const openLockImg = document.getElementById("open_lock_img")!;
  const contentTitle = document.getElementById("title")!;
  const contentDetails = document.getElementById("details")!;
  const i18n = createI18n(detectLanguage());

  contentTitle.innerText = i18n("initial.title");
  contentDetails.innerText = i18n("initial.details");

  const sid = new SlashID({
    analyticsEnabled: false,
  });

  try {
    const user = await sid.getUserFromURL();

    if (!user) {
      return;
    }

    spinnerParent.removeChild(spinner);
    openLockImg.hidden = false;
    contentTitle.innerText = i18n("success.title");
    contentDetails.innerText = i18n("success.details");
  } catch (e) {
    contentTitle.innerText = i18n("error.title");

    if (isSlashIDError(e)) {
      contentDetails.innerText = capitalize(e.errors[0].message) + ".";
    } else {
      contentDetails.innerText = "";
    }

    spinnerParent.removeChild(spinner);
    return;
  }
}
