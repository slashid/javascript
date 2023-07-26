import { GDPRConsent, GDPRConsentLevel } from "@slashid/slashid";
import { useCallback, useEffect, useState } from "react";
import { isBrowser } from "../browser/is-browser";
import { useSlashID } from "./use-slash-id";

export const STORAGE_GDPR_CONSENT_KEY = "@slashid/GDPR_CONSENT";

type UseGdprConsent = () => {
  consents: GDPRConsent[];
  updateGdprConsent: (consent: GDPRConsentLevel[]) => Promise<void>;
};

const getStoredConsents = (): GDPRConsent[] => {
  if (!isBrowser()) {
    return [];
  }

  const storedConsents = window.localStorage.getItem(STORAGE_GDPR_CONSENT_KEY);

  if (storedConsents === null) {
    return [];
  }

  return JSON.parse(storedConsents);
};

export const useGdprConsent: UseGdprConsent = () => {
  const { user, sid } = useSlashID();
  const [consents, setConsents] = useState<GDPRConsent[]>([]);

  useEffect(() => {
    if (!sid || !user) {
      setConsents(getStoredConsents());
      return;
    }

    const fetchGDPRConsent = async () => {
      const { consents } = await user.getGDPRConsent();

      // TODO: compare the timestamps of consent levels and store the latest one using the API
      setConsents(consents);
      window.localStorage.removeItem(STORAGE_GDPR_CONSENT_KEY);
    };

    sid.subscribe("idFlowSucceeded", fetchGDPRConsent);
    return () => sid.unsubscribe("idFlowSucceeded", fetchGDPRConsent);
  }, [sid, user]);

  const updateGdprConsent = useCallback(
    async (consentLevels: GDPRConsentLevel[]) => {
      if (user) {
        const { consents } = await user.setGDPRConsent({
          consentLevels,
        });
        setConsents(consents);
        return;
      }

      if (!isBrowser()) {
        return;
      }

      const consentsToStore = consentLevels.map((consentLevel) => ({
        consent_level: consentLevel,
        created_at: new Date(),
      })) as GDPRConsent[];

      window.localStorage.setItem(
        STORAGE_GDPR_CONSENT_KEY,
        JSON.stringify(consentsToStore)
      );
      setConsents(consentsToStore);
    },
    [user]
  );

  return { consents, updateGdprConsent };
};
