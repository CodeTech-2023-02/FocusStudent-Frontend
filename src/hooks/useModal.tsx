import { useState } from "react";

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [message, setMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [handleOnConfirm, setHandleOnConfirm] = useState<(() => void) | null>(
    null
  );
  const [handleOnModalClose, setHandleOnModalClose] = useState<
    (() => void) | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startProcessing = () => {
    setIsProcessing(true);
  };

  const stopProcessing = () => {
    setIsProcessing(false);
  };
  const openModal = (
    onConfirm?: () => void,
    onModalClose?: () => void,
    newTitle = "",
    newMessage?: string
  ) => {
    setMessage(newMessage || "");
    setModalTitle(newTitle);
    setHandleOnConfirm(() => onConfirm);
    setHandleOnModalClose(() => onModalClose);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (handleOnModalClose) {
      handleOnModalClose();
    }
    setHandleOnModalClose(null);
    setIsOpen(false);
  };

  const confirm = () => {
    if (handleOnConfirm) {
      handleOnConfirm();
    }
  };

  return {
    isOpen,
    message,
    modalTitle,
    openModal,
    closeModal,
    handleOnConfirm: confirm,
    isProcessing,
    startProcessing,
    stopProcessing,
  };
};

export default useModal;
