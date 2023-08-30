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

type ConsentState = "initial" | "ready";

type UseGdprConsent = () => {
  consents: GDPRConsent[];
  consentState: ConsentState;
  updateGdprConsent: (
    consentLevels: GDPRConsentLevel[]
  ) => Promise<GDPRConsent[]>;
  deleteGdprConsent: () => Promise<void>;
};

/**
 * A stateful hook providing access to the current user's GDPR consent levels.
 * Use this hook to list the accepted levels and accept and reject additional levels.
 *
 * If there is no authenticated user, the consent levels will be stored in local storage.
 * Otherwise, the consent levels will be stored using the SlashID API.
 *
 *
 * @returns {UseGdprConsent} an object with the current consent levels and methods to update it
 */
export const useGdprConsent: UseGdprConsent = () => {
  const { user, sdkState, sid } = useSlashID();
  const [consents, setConsents] = useState<GDPRConsent[]>([]);
  const [consentState, setConsentState] = useState<ConsentState>("initial");

  const storage = useMemo(() => {
    if (user) {
      return createApiGDPRConsentStorage(user);
    }
    if (!isBrowser()) {
      return;
    }
    return createLocalGDPRConsentStorage();
  }, [user]);

  const fetchAndSyncGDPRConsent = useCallback(async () => {
    if (!storage || sdkState !== "ready") {
      return;
    }
    const consents = await storage.getConsentLevels();
    setConsents(consents);
    setConsentState("ready");
  }, [storage, sdkState]);

  useEffect(() => {
    fetchAndSyncGDPRConsent();
  }, [fetchAndSyncGDPRConsent]);

  useEffect(() => {
    if (sid) {
      sid.subscribe("idFlowSucceeded", fetchAndSyncGDPRConsent);
      return () => sid.unsubscribe("idFlowSucceeded", fetchAndSyncGDPRConsent);
    }
  }, [sid, fetchAndSyncGDPRConsent]);

  const updateGdprConsent = useCallback(
    async (consentLevels: GDPRConsentLevel[]) => {
      if (!storage) {
        return [];
      }
      const consents = await storage.setConsentLevels(consentLevels);
      setConsents(consents);
      return consents;
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

  return { consents, consentState, updateGdprConsent, deleteGdprConsent };
};
