import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Layout from './layout';
import LayerPanel, { Layer } from './LayerPanel';
import ResultsBentoGrid, { CalculationResult } from './ResultsBentoGrid';
import MaterialPriceSummary, { Material } from './MaterialPriceSummary';
import ElementBreakdownTable, { CalculationElement } from './ElementBreakdownTable';
import ExportModal from './ExportModal';
import styles from '../styles/VolumeCalculatorShell.module.css';

export const VolumeCalculatorShell: React.FC = () => {
  const { t } = useLanguage();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [elements, setElements] = useState<CalculationElement[]>([]);
  const [results, setResults] = useState<CalculationResult>({});
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const savedLayers = localStorage.getItem('calc_layers');
    const savedMaterials = localStorage.getItem('calc_materials');
    const savedElements = localStorage.getItem('calc_elements');

    if (savedLayers) setLayers(JSON.parse(savedLayers));
    if (savedMaterials) setMaterials(JSON.parse(savedMaterials));
    if (savedElements) setElements(JSON.parse(savedElements));
  }, []);

  useEffect(() => {
    localStorage.setItem('calc_layers', JSON.stringify(layers));
  }, [layers]);

  useEffect(() => {
    localStorage.setItem('calc_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('calc_elements', JSON.stringify(elements));
  }, [elements]);

  useEffect(() => {
    calculateResults();
  }, [elements, materials]);

  const calculateResults = () => {
    const totalArea = elements.reduce((sum, el) => sum + (el.area || 0), 0);
    const totalVolume = elements.reduce((sum, el) => sum + (el.volume || 0), 0);
    const totalLinearMeters = elements.reduce(
      (sum, el) => sum + (el.linearMeters || 0),
      0
    );
    const totalCost = materials.reduce(
      (sum, mat) => sum + mat.pricePerUnit * mat.quantity,
      0
    );

    setResults({
      area: totalArea > 0 ? totalArea : undefined,
      volume: totalVolume > 0 ? totalVolume : undefined,
      linearMeters: totalLinearMeters > 0 ? totalLinearMeters : undefined,
      totalCost: totalCost > 0 ? totalCost : undefined,
      elementCount: elements.length,
      layerCount: layers.length,
    });
  };

  const handleAddLayer = (layer: Layer) => {
    setLayers([...layers, layer]);
  };

  const handleRemoveLayer = (id: string) => {
    setLayers(layers.filter((layer) => layer.id !== id));
  };

  const handleAddMaterial = (material: Material) => {
    setMaterials([...materials, material]);
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  const handleAddElement = (element: CalculationElement) => {
    setElements([...elements, element]);
  };

  const handleRemoveElement = (id: string) => {
    setElements(elements.filter((element) => element.id !== id));
  };

  const handleExportCSV = () => {
    const headers = [
      'Element Name',
      'Type',
      'Length (m)',
      'Width (m)',
      'Height (m)',
      'Area (m²)',
      'Volume (m³)',
    ];
    const rows = elements.map((el) => [
      el.name,
      el.elementType,
      el.length,
      el.width,
      el.height || '',
      el.area || '',
      el.volume || '',
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach((row) => {
      csv += row.map((cell) => `"${cell}"`).join(',') + '\n';
    });

    if (materials.length > 0) {
      csv += '\n\nMaterials\n';
      csv += 'Name,Price per Unit,Unit,Quantity,Total\n';
      materials.forEach((mat) => {
        csv += `"${mat.name}",${mat.pricePerUnit},${mat.unit},${mat.quantity},${
          mat.pricePerUnit * mat.quantity
        }\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calculations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    // Using xlsx library if available
    const wb = require('xlsx').utils.book_new();

    const elementData = elements.map((el) => ({
      Name: el.name,
      Type: el.elementType,
      'Length (m)': el.length,
      'Width (m)': el.width,
      'Height (m)': el.height || '',
      'Area (m²)': el.area || '',
      'Volume (m³)': el.volume || '',
    }));

    const materialData = materials.map((mat) => ({
      Name: mat.name,
      'Price/Unit': mat.pricePerUnit,
      Unit: mat.unit,
      Quantity: mat.quantity,
      Total: mat.pricePerUnit * mat.quantity,
    }));

    if (elementData.length > 0) {
      const ws1 = require('xlsx').utils.json_to_sheet(elementData);
      require('xlsx').utils.book_append_sheet(wb, ws1, 'Elements');
    }

    if (materialData.length > 0) {
      const ws2 = require('xlsx').utils.json_to_sheet(materialData);
      require('xlsx').utils.book_append_sheet(wb, ws2, 'Materials');
    }

    require('xlsx').writeFile(
      wb,
      `calculations_${new Date().toISOString().split('T')[0]}.xlsx`
    );
  };

  const handleExportPDF = () => {
    const content = `
VOLUME CALCULATOR REPORT
Generated: ${new Date().toLocaleString()}

ELEMENTS
${elements.map((el) => `${el.name}: ${el.length}m x ${el.width}m${el.height ? ` x ${el.height}m` : ''} = ${el.area?.toFixed(2)} m²${el.volume ? ` / ${el.volume.toFixed(2)} m³` : ''}`).join('\n')}

TOTALS
Total Area: ${results.area?.toFixed(2)} m²
Total Volume: ${results.volume?.toFixed(2)} m³

MATERIALS
${materials.map((mat) => `${mat.name}: $${(mat.pricePerUnit * mat.quantity).toFixed(2)}`).join('\n')}

Total Cost: $${results.totalCost?.toFixed(2)}
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calculations_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      )
    ) {
      setLayers([]);
      setMaterials([]);
      setElements([]);
      setResults({});
      localStorage.removeItem('calc_layers');
      localStorage.removeItem('calc_materials');
      localStorage.removeItem('calc_elements');
    }
  };

  return (
    <Layout onExport={() => setIsExportModalOpen(true)}>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        hasData={elements.length > 0}
      />

      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.row}>
            <div className={styles.column}>
              <ElementBreakdownTable
                elements={elements}
                onAddElement={handleAddElement}
                onRemoveElement={handleRemoveElement}
              />
            </div>
          </div>

          <ResultsBentoGrid results={results} />

          <div className={styles.row}>
            <div className={styles.column}>
              <MaterialPriceSummary
                materials={materials}
                onAddMaterial={handleAddMaterial}
                onRemoveMaterial={handleRemoveMaterial}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.column}>
              <LayerPanel
                layers={layers}
                onAddLayer={handleAddLayer}
                onRemoveLayer={handleRemoveLayer}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.clearButton}
              onClick={handleClearAll}
            >
              {t('actions.clear')}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VolumeCalculatorShell;
