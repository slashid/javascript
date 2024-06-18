import { render, screen } from "@testing-library/react";
import { Text } from "./index";
import { interpolate } from "./interpolation";
import { TextProvider } from "./text-context";

describe("<Text>", () => {
  test("should render the text without interpolation", () => {
    const text = { hello: "world" };
    render(
      <TextProvider text={text}>
        <Text t="hello" />
      </TextProvider>
    );

    expect(screen.getByText("world")).toBeInTheDocument();
  });

  test("should render the text with interpolation", () => {
    const tokens = { name: "John" };
    const text = { hello: "Hello, {{name}}!" };

    render(
      <TextProvider text={text}>
        <Text t="hello" tokens={tokens} />
      </TextProvider>
    );
    expect(screen.getByText("Hello, John!")).toBeInTheDocument();
  });
});

describe("interpolate", () => {
  test("should replace placeholders with values from tokens", () => {
    const text = "Hello, {{name}}! You are {{age}} years old.";
    const tokens = {
      name: "John",
      age: "30",
    };
    const interpolatedText = interpolate(text, tokens);
    expect(interpolatedText).toBe("Hello, John! You are 30 years old.");
  });

  test("should not replace placeholders if corresponding token is missing", () => {
    const text = "Hello, {{name}}! You are {{age}} years old.";
    const tokens = {
      name: "John",
    };
    const interpolatedText = interpolate(text, tokens);
    expect(interpolatedText).toBe("Hello, John! You are {{age}} years old.");
  });

  test("should return the original text if tokens are not provided", () => {
    const text = "Hello, {{name}}! You are {{age}} years old.";
    const interpolatedText = interpolate(text, {});
    expect(interpolatedText).toBe(text);
  });
});
