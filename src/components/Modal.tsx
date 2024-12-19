import { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ open, children, onClosingModal }: any, ref) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open])
 

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClosingModal}>
      { open && children }
    </dialog>,
    document.getElementById('modal') ?? document.body
  );
});

export default Modal;
