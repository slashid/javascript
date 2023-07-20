import { useCallback } from "react";
import { isBrowser } from "../browser/is-browser";
import { useSlashID } from './use-slash-id';

export const STORAGE_GDPR_CONSENT_KEY = "@slashid/GDPR_CONSENT";

type UseGdprConsent = () => {
  fetchGdprConsent: () => Promise<boolean>;
  updateGdprConsent: (consent: boolean) => Promise<void>;
};

export const useGdprConsent: UseGdprConsent = () => {
  const { user } = useSlashID();

  const fetchGdprConsent = useCallback(async () => {
    if (user) {
      // TODO: When authenticated using SlashID, fetch the consent using the User instance
      return false;
    }

    if (!isBrowser()) {
      return false;
    }

    const storedGdprConsent = window.localStorage.getItem(
      STORAGE_GDPR_CONSENT_KEY
    );
    if (storedGdprConsent === null) {
      return false;
    }

    return !!JSON.parse(storedGdprConsent);
  }, [user]);

  const updateGdprConsent = useCallback(async (consent: boolean) => {
    if (user) {
      // TODO: When authenticated using SlashID, update the consent using the User instance
      return;
    }

    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_GDPR_CONSENT_KEY,
      JSON.stringify(consent)
    );
  }, [user]);

  return { fetchGdprConsent, updateGdprConsent };
};
