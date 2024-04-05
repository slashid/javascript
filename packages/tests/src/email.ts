import {
  MailinatorClient,
  GetInboxRequest,
  GetMessageRequest,
  Sort,
  Message,
  Part,
} from "mailinator-client";
import { load } from "cheerio";

export const TEAM_DOMAIN = "team336427.testinator.com";

export type FetchLatestEmailInput = {
  inbox?: string;
};

export async function fetchLatestEmail({
  inbox = "e2e",
}: FetchLatestEmailInput) {
  try {
    const mailinatorClient: MailinatorClient = new MailinatorClient(
      process.env.MAILINATOR_API_KEY || ""
    );

    const response = await mailinatorClient.request(
      new GetInboxRequest(TEAM_DOMAIN, inbox, 0, 1, Sort.DESC, true)
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

export type GetMessageInput = {
  messageId: string;
};

export async function getMessage({ messageId }: GetMessageInput) {
  try {
    const mailinatorClient: MailinatorClient = new MailinatorClient(
      "4c39b2cfe3c746a09926ca6e0a17c779"
    );

    const response = await mailinatorClient.request(
      new GetMessageRequest(TEAM_DOMAIN, messageId)
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

export function getTextContent(message: Message) {
  const messageContent = message.parts.reduce((acc: string, part: Part) => {
    if (part.body) {
      return acc + part.body;
    }
    return acc;
  }, "");

  return messageContent;
}

export function getTheJumpPageURL(email: string) {
  const $ = load(email);
  const jumpPageLink = $("a:contains('Confirm')").attr("href");
  return jumpPageLink;
}

export async function fetchLatestEmailWithRetry(
  input: FetchLatestEmailInput
): Promise<Message | null> {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const email = await fetchLatestEmail(input);
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
