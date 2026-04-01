import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/LayerPanel.module.css';

export interface Layer {
  id: string;
  name: string;
  thickness: number;
  material: string;
}

interface LayerPanelProps {
  layers: Layer[];
  onAddLayer: (layer: Layer) => void;
  onRemoveLayer: (id: string) => void;
}

const MATERIAL_OPTIONS = [
  'Concrete',
  'Brick',
  'Stone',
  'Sand',
  'Gravel',
  'Insulation',
  'Drywall',
  'Wood',
  'Tile',
  'Mortar',
];

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  onAddLayer,
  onRemoveLayer,
}) => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Layer, 'id'>>({
    name: '',
    thickness: 0,
    material: 'Concrete',
  });

  const handleAddLayer = () => {
    if (formData.name && formData.thickness > 0) {
      onAddLayer({
        id: Date.now().toString(),
        ...formData,
      });
      setFormData({
        name: '',
        thickness: 0,
        material: 'Concrete',
      });
      setShowForm(false);
    }
  };

  return (
    <div className={styles.layerPanel}>
      <div className={styles.header}>
        <h2>{t('layer.title')}</h2>
        <button
          className={styles.addButton}
          onClick={() => setShowForm(!showForm)}
        >
          {t('layer.addLayer')}
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>{t('layer.name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t('layer.name')}
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              {t('layer.thickness')}
            </label>
            <input
              type="number"
              value={formData.thickness}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  thickness: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t('layer.material')}</label>
            <select
              value={formData.material}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
            >
              {MATERIAL_OPTIONS.map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.saveButton}
              onClick={handleAddLayer}
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

      <div className={styles.layersList}>
        {layers.length === 0 ? (
          <p className={styles.empty}>{t('layer.addLayer')}</p>
        ) : (
          layers.map((layer) => (
            <div key={layer.id} className={styles.layerItem}>
              <div className={styles.layerInfo}>
                <h3>{layer.name}</h3>
                <p>
                  {layer.material} - {layer.thickness} {t('layer.unit')}
                </p>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => onRemoveLayer(layer.id)}
                title={t('layer.remove')}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LayerPanel;
