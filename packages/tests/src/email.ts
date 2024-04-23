import {
  MailinatorClient,
  GetInboxRequest,
  GetMessageRequest,
  Sort,
  Message,
  Part,
} from "mailinator-client";
import { load } from "cheerio";
import { v4 as generateUUID } from "uuid";

export type CreateTestInboxInput = {
  inboxName?: string;
};

export type TestInbox = {
  name: string;
  email: string;
  getLatestEmail: () => Promise<Message | null>;
  getOTP: (email: Message) => Promise<string | null | undefined>;
  getJumpPageURL: (email: Message) => Promise<string | null | undefined>;
  getEmailBySubject: (subject: string) => Promise<Message | null>;
};

export function createTestInbox({
  inboxName,
}: CreateTestInboxInput = {}): TestInbox {
  const config = {
    teamDomain: process.env.MAILINATOR_TEAM_DOMAIN || "",
    apiKey: process.env.MAILINATOR_API_KEY || "",
  };

  if (!config.teamDomain || !config.apiKey) {
    throw new Error("Mailinator configuration is missing");
  }

  const name = inboxName || `e2e-${generateUUID()}`;
  const mailinatorClient = new MailinatorClient(config.apiKey);

  async function fetchLatestEmail() {
    try {
      const response = await mailinatorClient.request(
        new GetInboxRequest(config.teamDomain, name, 0, 1, Sort.DESC, true)
      );

      if (
        !response.result ||
        !response.result.msgs ||
        response.result.msgs.length === 0
      ) {
        return null;
      }

      return response.result.msgs[0];
    } catch (e) {
      console.log("Error fetching email", e);
      return null;
    }
  }

  async function fetchLatestEmailWithRetry(): Promise<Message | null> {
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const email = await fetchLatestEmail();
        if (email !== null) {
          return email;
        }
      } catch (error) {
        console.error("Error fetching latest email:", error);
      }

      retries++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }

    console.error("Failed to fetch latest email after multiple retries");
    return null;
  }

  async function fetchEmailBySubject(subject: string) {
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const email = await fetchLatestEmail();
        if (email !== null && email.subject.includes(subject)) {
          return email;
        }
      } catch (error) {
        console.error("Error fetching latest email:", error);
      }

      retries++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    }

    console.error("Failed to fetch latest email after multiple retries");
    return null;
  }

  type GetMessageInput = {
    messageId: string;
  };

  async function fetchMessage({ messageId }: GetMessageInput) {
    try {
      const response = await mailinatorClient.request(
        new GetMessageRequest(config.teamDomain, messageId)
      );

      if (!response.result) {
        return null;
      }

      return response.result;
    } catch (e) {
      console.log("Error fetching email", e);
      return null;
    }
  }

  function getTextContent(message: Message) {
    const messageContent = message.parts.reduce((acc: string, part: Part) => {
      if (part.body) {
        return acc + part.body;
      }
      return acc;
    }, "");

    return messageContent;
  }

  function getTheJumpPageURL(email: string) {
    const $ = load(email);
    const jumpPageLink = $("a:contains('Confirm')").attr("href");
    return jumpPageLink;
  }

  async function getOTP(email: Message) {
    return email.subject.match(/\d{6}/)?.[0];
  }

  return {
    name,
    email: `${name}@${config.teamDomain}`,
    getLatestEmail: async () => fetchLatestEmailWithRetry(),
    getOTP,
    getJumpPageURL: async (email: Message) => {
      const message = await fetchMessage({ messageId: email.id });

      if (!message) {
        return null;
      }

      const messageContent = getTextContent(message);
      return getTheJumpPageURL(messageContent);
    },
    getEmailBySubject: async (subject) => fetchEmailBySubject(subject),
  };
}
