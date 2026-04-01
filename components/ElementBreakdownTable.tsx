import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/ElementBreakdownTable.module.css';

export interface CalculationElement {
  id: string;
  name: string;
  length: number;
  width: number;
  height?: number;
  elementType: string;
  area?: number;
  volume?: number;
  linearMeters?: number;
}

interface ElementBreakdownTableProps {
  elements: CalculationElement[];
  onAddElement: (element: CalculationElement) => void;
  onRemoveElement: (id: string) => void;
}

const ELEMENT_TYPES = [
  'Wall',
  'Floor',
  'Ceiling',
  'Column',
  'Beam',
  'Slab',
  'Foundation',
  'Footing',
  'Custom',
];

export const ElementBreakdownTable: React.FC<ElementBreakdownTableProps> = ({
  elements,
  onAddElement,
  onRemoveElement,
}) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<CalculationElement, 'id'>>({
    name: '',
    length: 0,
    width: 0,
    height: undefined,
    elementType: 'Wall',
  });

  const handleAddElement = () => {
    if (formData.name && formData.length > 0 && formData.width > 0) {
      const area = formData.length * formData.width;
      const volume = formData.height
        ? formData.length * formData.width * formData.height
        : undefined;
      const linearMeters = formData.length;

      onAddElement({
        id: Date.now().toString(),
        ...formData,
        area,
        volume,
        linearMeters,
      });
      setFormData({
        name: '',
        length: 0,
        width: 0,
        height: undefined,
        elementType: 'Wall',
      });
      setShowForm(false);
    }
  };

  const totalArea = elements.reduce((sum, el) => sum + (el.area || 0), 0);
  const totalVolume = elements.reduce((sum, el) => sum + (el.volume || 0), 0);

  return (
    <div className={styles.elementTable}>
      <div className={styles.header}>
        <h2>{t('element.breakdownTable')}</h2>
        <button
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {t('actions.add')}
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>{t('element.name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t('element.name')}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                {t('dimensions.length')} ({t('layer.unit')})
              </label>
              <input
                type="number"
                value={formData.length}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    length: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                {t('dimensions.width')} ({t('layer.unit')})
              </label>
              <input
                type="number"
                value={formData.width}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    width: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                {t('dimensions.height')} ({t('layer.unit')}) - Optional
              </label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t('element.type')}</label>
              <select
                value={formData.elementType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    elementType: e.target.value,
                  })
                }
              >
                {ELEMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.saveButton}
              onClick={handleAddElement}
            >
              {t('actions.save')}
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              {t('actions.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className={styles.table}>
        {elements.length === 0 ? (
          <p className={styles.empty}>{t('element.noElements')}</p>
        ) : (
          <>
            <div className={styles.tableHeader}>
              <div className={styles.colName}>{t('element.name')}</div>
              <div className={styles.colLength}>{t('dimensions.length')}</div>
              <div className={styles.colWidth}>{t('dimensions.width')}</div>
              <div className={styles.colHeight}>{t('dimensions.height')}</div>
              <div className={styles.colType}>{t('element.type')}</div>
              <div className={styles.colArea}>{t('results.area')}</div>
              <div className={styles.colVolume}>{t('results.volume')}</div>
              <div className={styles.colAction}>{t('actions.delete')}</div>
            </div>

            {elements.map((element) => (
              <div key={element.id} className={styles.tableRow}>
                <div className={styles.colName}>{element.name}</div>
                <div className={styles.colLength}>
                  {element.length.toFixed(2)} {t('layer.unit')}
                </div>
                <div className={styles.colWidth}>
                  {element.width.toFixed(2)} {t('layer.unit')}
                </div>
                <div className={styles.colHeight}>
                  {element.height
                    ? `${element.height.toFixed(2)} ${t('layer.unit')}`
                    : '-'}
                </div>
                <div className={styles.colType}>{element.elementType}</div>
                <div className={styles.colArea}>
                  {element.area?.toFixed(2)} {t('results.m2')}
                </div>
                <div className={styles.colVolume}>
                  {element.volume
                    ? `${element.volume.toFixed(2)} ${t('results.m3')}`
                    : '-'}
                </div>
                <div className={styles.colAction}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onRemoveElement(element.id)}
                    title={t('actions.delete')}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.tableFooter}>
              <div className={styles.footerLabel}>
                Total: {totalArea.toFixed(2)} {t('results.m2')}{' '}
                {totalVolume > 0 && `/ ${totalVolume.toFixed(2)} ${t('results.m3')}`}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ElementBreakdownTable;
