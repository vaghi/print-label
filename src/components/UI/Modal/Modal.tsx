import React, { ReactNode } from 'react';
import styles from './styles.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {onClose && (
            <button className={styles.closeButton} onClick={onClose}>
                &times;
            </button>
        )}
        <div className={styles.content}>
            {children}
        </div>
      </div>
    </div>
  );
};

export const Spinner: React.FC = () => {
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
            <p>Processing...</p>
        </div>
    )
}

export default Modal;
