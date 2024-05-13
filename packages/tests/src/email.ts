import MailosaurClient from "mailosaur";
import { load } from "cheerio";
import { v4 as generateUUID } from "uuid";
import { config } from "../config";
import type { SearchOptions } from "mailosaur/lib/models";

type Message = Awaited<ReturnType<MailosaurClient["messages"]["get"]>>;

export type CreateTestInboxInput = {
  inboxName?: string;
};

export type TestInbox = {
  name: string;
  email: string;
  getLatestEmail: (options?: SearchOptions) => Promise<Message | null>;
  getOTP: (email: Message) => Promise<string | null | undefined>;
  getJumpPageURL: (email: Message) => Promise<string | null | undefined>;
  getEmailBySubject: (subject: string) => Promise<Message | null>;
};

export function createTestInbox({
  inboxName,
}: CreateTestInboxInput = {}): TestInbox {
  const name = inboxName || `e2e-${generateUUID()}`;
  const email = `${name}@${config.mailServerId}.mailosaur.net`;
  const mailosaurClient = new MailosaurClient(config.mailApiKey);

  async function getLatestEmail(
    options?: SearchOptions
  ): Promise<Message | null> {
    try {
      const message = await mailosaurClient.messages.get(
        config.mailServerId,
        {
          sentTo: name,
        },
        options
      );

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

  async function getEmailBySubject(subject: string) {
    return mailosaurClient.messages.get(config.mailServerId, {
      sentTo: name,
      subject,
    });
  }

  return {
    name,
    email,
    getLatestEmail,
    getOTP,
    getJumpPageURL,
    getEmailBySubject,
  };
}
