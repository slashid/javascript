const TOKEN = {
  opening: "{{",
  closing: "}}",
};

/**
 * This allows interpolating text with tokens.
 * Source text needs to have the tokens in the form of {{TOKEN_NAME}}.
 * TODO write tests
 * @param text
 * @param tokens
 * @returns
 */
export function interpolate(text: string, tokens: Record<string, string>) {
  if (!text.includes(TOKEN.opening)) return text;

  const interpolatedText = Object.keys(tokens).reduce(
    (partialResult, token) => {
      return partialResult.replace(
        `${TOKEN.opening}${token}${TOKEN.closing}`,
        tokens[token]
      );
    },
    text
  );

  return interpolatedText;
}
