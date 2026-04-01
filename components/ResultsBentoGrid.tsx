import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/ResultsBentoGrid.module.css';

export interface CalculationResult {
  area?: number;
  volume?: number;
  linearMeters?: number;
  totalCost?: number;
  elementCount?: number;
  layerCount?: number;
}

interface ResultsBentoGridProps {
  results: CalculationResult;
  isLoading?: boolean;
}

export const ResultsBentoGrid: React.FC<ResultsBentoGridProps> = ({
  results,
  isLoading = false,
}) => {
  const { t } = useLanguage();

  const hasResults = Object.values(results).some((val) => val !== undefined && val > 0);

  if (!hasResults && !isLoading) {
    return (
      <div className={styles.bentoGrid}>
        <div className={styles.emptyState}>
          <p>{t('results.noData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bentoGrid}>
      <h2 className={styles.title}>{t('results.summary')}</h2>

      <div className={styles.grid}>
        {results.area !== undefined && (
          <div className={`${styles.card} ${styles.cardArea}`}>
            <div className={styles.cardContent}>
              <p className={styles.label}>{t('results.area')}</p>
              <p className={styles.value}>
                {results.area.toFixed(2)}
                <span className={styles.unit}>{t('results.m2')}</span>
              </p>
            </div>
          </div>
        )}

        {results.volume !== undefined && (
          <div className={`${styles.card} ${styles.cardVolume}`}>
            <div className={styles.cardContent}>
              <p className={styles.label}>{t('results.volume')}</p>
              <p className={styles.value}>
                {results.volume.toFixed(2)}
                <span className={styles.unit}>{t('results.m3')}</span>
              </p>
            </div>
          </div>
        )}

        {results.linearMeters !== undefined && (
          <div className={`${styles.card} ${styles.cardLinear}`}>
            <div className={styles.cardContent}>
              <p className={styles.label}>{t('results.linearMeters')}</p>
              <p className={styles.value}>
                {results.linearMeters.toFixed(2)}
                <span className={styles.unit}>{t('results.m')}</span>
              </p>
            </div>
          </div>
        )}

        {results.totalCost !== undefined && (
          <div className={`${styles.card} ${styles.cardCost}`}>
            <div className={styles.cardContent}>
              <p className={styles.label}>{t('material.totalCost')}</p>
              <p className={styles.value}>
                ${results.totalCost.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {results.elementCount !== undefined && (
          <div className={`${styles.card} ${styles.cardCount}`}>
            <div className={styles.cardContent}>
              <p className={styles.label}>Total Elements</p>
              <p className={styles.value}>{results.elementCount}</p>
            </div>
          </div>
        )}

        {results.layerCount !== undefined && (
          <div className={`${styles.card} ${styles.cardCount}`}>
            <div className={styles.cardContent}>
              <p className={styles.label}>Total Layers</p>
              <p className={styles.value}>{results.layerCount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsBentoGrid;
