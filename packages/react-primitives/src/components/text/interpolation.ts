export function interpolate(text: string, tokens: Record<string, string>) {
  if (!text.includes("{{")) return text;

  const interpolatedText = Object.keys(tokens).reduce(
    (partialResult, token) => {
      return partialResult.replace(`{{${token}}}`, tokens[token]);
    },
    text
  );

  return interpolatedText;
}
