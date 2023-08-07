import { BaseUser, GDPRConsent, GDPRConsentLevel } from "@slashid/slashid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isBrowser } from "../browser/is-browser";
import { useSlashID } from "./use-slash-id";

export const STORAGE_GDPR_CONSENT_KEY = "@slashid/GDPR_CONSENT";

interface GDPRConsentStorage {
  getConsentLevels: () => Promise<GDPRConsent[]>;
  setConsentLevels: (
    consentLevels: GDPRConsentLevel[]
  ) => Promise<GDPRConsent[]>;
  deleteConsentLevels: () => Promise<void>;
}

export const createLocalGDPRConsentStorage = (): GDPRConsentStorage => ({
  getConsentLevels: async () => {
    const storedConsents = window.localStorage.getItem(
      STORAGE_GDPR_CONSENT_KEY
    );
    if (storedConsents === null) {
      return [];
    }

    return JSON.parse(storedConsents);
  },
  setConsentLevels: async (consentLevels) => {
    const consentsToStore = consentLevels.map((consentLevel) => ({
      consent_level: consentLevel,
      created_at: new Date(),
    })) as GDPRConsent[];

    window.localStorage.setItem(
      STORAGE_GDPR_CONSENT_KEY,
      JSON.stringify(consentsToStore)
    );
    return consentsToStore;
  },
  deleteConsentLevels: async () => {
    window.localStorage.removeItem(STORAGE_GDPR_CONSENT_KEY);
  },
});

export const createApiGDPRConsentStorage = (
  user: BaseUser
): GDPRConsentStorage => ({
  getConsentLevels: async () => {
    const { consents } = await user.getGDPRConsent();
    const localStorage = createLocalGDPRConsentStorage();
    const localStorageConsents = await localStorage.getConsentLevels();

    if (localStorageConsents.length > 0) {
      const { consents } = await user.setGDPRConsent({
        consentLevels: localStorageConsents.map((c) => c.consent_level),
      });
      localStorage.deleteConsentLevels();
      return consents;
    }
    return consents;
  },
  setConsentLevels: async (consentLevels) => {
    const { consents } = await user.setGDPRConsent({
      consentLevels,
    });
    return consents;
  },
  deleteConsentLevels: async () => {
    return user.removeGDPRConsentAll();
  },
});

type UseGdprConsent = () => {
  consents: GDPRConsent[];
  updateGdprConsent: (consentLevels: GDPRConsentLevel[]) => Promise<void>;
  deleteGdprConsent: () => Promise<void>;
};

export const useGdprConsent: UseGdprConsent = () => {
  const { user, sid } = useSlashID();
  const [consents, setConsents] = useState<GDPRConsent[]>([]);

  const storage = useMemo(() => {
    if (user) {
      return createApiGDPRConsentStorage(user);
    }
    if (!isBrowser()) {
      return;
    }
    return createLocalGDPRConsentStorage();
  }, [user]);

  useEffect(() => {
    const fetchAndSyncGDPRConsent = async () => {
      if (!storage) {
        return;
      }
      const consents = await storage.getConsentLevels();
      setConsents(consents);
    };

    fetchAndSyncGDPRConsent();

    if (sid) {
      sid.subscribe("idFlowSucceeded", fetchAndSyncGDPRConsent);
      return () => sid.unsubscribe("idFlowSucceeded", fetchAndSyncGDPRConsent);
    }
  }, [sid, storage]);

  const updateGdprConsent = useCallback(
    async (consentLevels: GDPRConsentLevel[]) => {
      if (!storage) {
        return;
      }
      const consents = await storage.setConsentLevels(consentLevels);
      setConsents(consents);
    },
    [storage]
  );

  const deleteGdprConsent = useCallback(async () => {
    if (!storage) {
      return;
    }
    await storage.deleteConsentLevels();
    setConsents([]);
  }, [storage]);

  return { consents, updateGdprConsent, deleteGdprConsent };
};
