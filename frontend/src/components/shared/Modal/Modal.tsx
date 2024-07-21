import ReactDOM from 'react-dom';
import { useEffect, type ReactNode } from 'react';

import Backdrop from '../Backdrop/Backdrop';
import ModalWrapper from './ModalWrapper';

type Props = {
  children: ReactNode;
  onClick: () => void;
};
function Modal({ children, onClick }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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

export default Modal;
