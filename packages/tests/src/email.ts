import MailosaurClient from "mailosaur";

import { load } from "cheerio";
import { v4 as generateUUID } from "uuid";

type Message = Awaited<ReturnType<MailosaurClient["messages"]["get"]>>;

export type CreateTestInboxInput = {
  inboxName?: string;
};

export type TestInbox = {
  name: string;
  email: string;
  getLatestEmail: () => Promise<Message | null>;
  getOTP: (email: Message) => Promise<string | null | undefined>;
  getJumpPageURL: (email: Message) => Promise<string | null | undefined>;
};

export function createTestInbox({
  inboxName,
}: CreateTestInboxInput = {}): TestInbox {
  const config = {
    serverId: process.env.MAILOSAUR_SERVER_ID || "",
    apiKey: process.env.MAILOSAUR_API_KEY || "",
  };

  if (!config.serverId || !config.apiKey) {
    throw new Error("Mailosaur configuration is missing");
  }

  const name = inboxName || `e2e-${generateUUID()}`;
  const email = `${name}@${config.serverId}.mailosaur.net`;
  const mailosaurClient = new MailosaurClient(config.apiKey);

  async function getLatestEmail(): Promise<Message | null> {
    try {
      const message = await mailosaurClient.messages.get(config.serverId, {
        sentTo: name,
      });

      return message;
    } catch (e) {
      console.log("Error fetching email", e);
      return null;
    }
  }

  async function getJumpPageURL(message: Message) {
    if (!message || !message.html || !message.html.body) {
      return null;
    }

    const $ = load(message.html.body);
    const jumpPageLink = $("a:contains('Confirm')").attr("href");
    return jumpPageLink;
  }

  async function getOTP(message: Message) {
    if (!message || !message.subject) {
      return null;
    }

    return message.subject.match(/\d{6}/)?.[0];
  }

  return {
    name,
    email,
    getLatestEmail,
    getOTP,
    getJumpPageURL,
  };
}
