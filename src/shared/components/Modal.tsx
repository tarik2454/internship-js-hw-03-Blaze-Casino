import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";
import { cx } from "../../utils/classNames";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  stylesContent?: string;
  stylesBackdrop?: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  stylesContent,
  stylesBackdrop,
}: ModalProps) {
  const modalRoot: Element | null = document.querySelector("#modal-root");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return modalRoot ? (
    createPortal(
      <>
        <div
          className={cx(styles.backdrop, isOpen && styles.open, stylesBackdrop)}
          onClick={handleBackdropClick}
        >
          <div
            className={cx(styles.content, isOpen && styles.open, stylesContent)}
          >
            <button className={styles.closeButton} onClick={onClose}>
              ×
            </button>

            {children}
          </div>
        </div>
      </>,
      modalRoot
    )
  ) : (
    <div className={styles.error}>Oops!!! We have some problem!!</div>
  );
}
