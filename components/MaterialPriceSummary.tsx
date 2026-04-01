import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/MaterialPriceSummary.module.css';

export interface Material {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: 'm²' | 'm³' | 'm';
  quantity: number;
}

interface MaterialPriceSummaryProps {
  materials: Material[];
  onAddMaterial: (material: Material) => void;
  onRemoveMaterial: (id: string) => void;
}

type UnitType = 'm²' | 'm³' | 'm';

const UNIT_OPTIONS: UnitType[] = ['m²', 'm³', 'm'];

export const MaterialPriceSummary: React.FC<MaterialPriceSummaryProps> = ({
  materials,
  onAddMaterial,
  onRemoveMaterial,
}) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Material, 'id'>>({
    name: '',
    pricePerUnit: 0,
    unit: 'm²',
    quantity: 0,
  });

  const handleAddMaterial = () => {
    if (formData.name && formData.pricePerUnit > 0 && formData.quantity > 0) {
      onAddMaterial({
        id: Date.now().toString(),
        ...formData,
      });
      setFormData({
        name: '',
        pricePerUnit: 0,
        unit: 'm²',
        quantity: 0,
      });
      setShowForm(false);
    }
  };

  const totalCost = materials.reduce(
    (sum, material) => sum + material.pricePerUnit * material.quantity,
    0
  );

  return (
    <div className={styles.materialSummary}>
      <div className={styles.header}>
        <h2>{t('material.summary')}</h2>
        <button
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {t('material.addMaterial')}
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>{t('material.name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t('material.name')}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t('material.pricePerUnit')}</label>
              <input
                type="number"
                value={formData.pricePerUnit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerUnit: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t('material.unit')}</label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unit: e.target.value as UnitType,
                  })
                }
              >
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.saveButton}
              onClick={handleAddMaterial}
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
        {materials.length === 0 ? (
          <p className={styles.empty}>{t('material.addMaterial')}</p>
        ) : (
          <>
            <div className={styles.tableHeader}>
              <div className={styles.colName}>{t('material.name')}</div>
              <div className={styles.colPrice}>{t('material.pricePerUnit')}</div>
              <div className={styles.colUnit}>{t('material.unit')}</div>
              <div className={styles.colQty}>Qty</div>
              <div className={styles.colTotal}>{t('material.totalCost')}</div>
              <div className={styles.colAction}>Action</div>
            </div>

            {materials.map((material) => (
              <div key={material.id} className={styles.tableRow}>
                <div className={styles.colName}>{material.name}</div>
                <div className={styles.colPrice}>
                  ${material.pricePerUnit.toFixed(2)}
                </div>
                <div className={styles.colUnit}>{material.unit}</div>
                <div className={styles.colQty}>{material.quantity}</div>
                <div className={styles.colTotal}>
                  ${(material.pricePerUnit * material.quantity).toFixed(2)}
                </div>
                <div className={styles.colAction}>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onRemoveMaterial(material.id)}
                    title={t('actions.delete')}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.tableFooter}>
              <div className={styles.footerLabel}>{t('material.totalCost')}</div>
              <div className={styles.footerValue}>
                ${totalCost.toFixed(2)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MaterialPriceSummary;
