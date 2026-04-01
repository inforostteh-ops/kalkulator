import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/ExportModal.module.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  hasData: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExportCSV,
  onExportExcel,
  onExportPDF,
  hasData,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{t('export.title')}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {!hasData ? (
            <p className={styles.noData}>{t('results.noData')}</p>
          ) : (
            <div className={styles.options}>
              <button
                className={styles.exportOption}
                onClick={() => {
                  onExportCSV();
                  onClose();
                }}
              >
                <span className={styles.icon}>📄</span>
                <span className={styles.label}>{t('export.csv')}</span>
              </button>

              <button
                className={styles.exportOption}
                onClick={() => {
                  onExportExcel();
                  onClose();
                }}
              >
                <span className={styles.icon}>📊</span>
                <span className={styles.label}>{t('export.excel')}</span>
              </button>

              <button
                className={styles.exportOption}
                onClick={() => {
                  onExportPDF();
                  onClose();
                }}
              >
                <span className={styles.icon}>📋</span>
                <span className={styles.label}>{t('export.pdf')}</span>
              </button>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            {t('export.cancel')}
          </button>
        </div>
      </div>
    </>
  );
};

export default ExportModal;
