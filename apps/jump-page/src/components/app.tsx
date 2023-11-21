import { ThemeRoot } from "@slashid/react-primitives";

export type Props = {
  children: React.ReactNode;
};

export function App() {
  return (
    <main>
      <ThemeRoot theme="light">
        <div className="container">
          <h1>Jump Page</h1>
        </div>
      </ThemeRoot>
    </main>
  );
}
