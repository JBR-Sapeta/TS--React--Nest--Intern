import ReactDOM from 'react-dom';
import type { ReactNode } from 'react';

import Backdrop from '../Backdrop/Backdrop';
import ModalWrapper from './ModalWrapper';

type Props = {
  children: ReactNode;
  onClick: () => void;
};
export function Modal({ children, onClick }: Props) {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClick={onClick} />,
        document.getElementById('backdrop')!
      )}
      {ReactDOM.createPortal(
        <ModalWrapper>{children}</ModalWrapper>,
        document.getElementById('modal')!
      )}
    </>
  );
}
