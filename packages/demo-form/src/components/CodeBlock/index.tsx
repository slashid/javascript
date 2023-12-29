import { FC } from "react";

import css from "./code-block.module.css";

interface Props {
  code: string;
}

const CodeBlock: FC<Props> = ({ code }) => {
  return (
    <pre className={css.host}>
      <code>{JSON.stringify(code, null, " ")}</code>
    </pre>
  );
};

export default CodeBlock;
