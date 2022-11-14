import { FC } from 'react';

import css from './modal.module.css';

interface Props {
  children: React.ReactNode;
  title: string;
}

const Modal: FC<Props> = ({ children, title }) => {
  return (
    <div className={css.host}>
      <p className={css.title}>{title}</p>
      {children}
    </div>
  );
};

export default Modal;
