// hooks/useOfflineCalculator.ts
import { useState, useEffect } from 'react';
import { calculateM2, calculateM3, calculateM } from '../utils/calculations';
import { validateDimensions, validateMaterials } from '../utils/validation';
import { validateUserInput, validateResults, suggestMaterials } from '../services/aiValidator';

interface CalculationData {
    length: number;
    width: number;
    height?: number;
    elementType: string;
    area?: number;
    volume?: number;
    linearMeters?: number;
}

interface CalculatorState {
    data: CalculationData[];
    currentInput: CalculationData;
    warnings: string[];
    suggestions: string[];
    errors: string[];
}

export function useOfflineCalculator() {
    const [state, setState] = useState<CalculatorState>({
        data: [],
        currentInput: {
            length: 0,
            width: 0,
            height: undefined,
            elementType: 'wall'
        },
        warnings: [],
        suggestions: [],
        errors: []
    });

    /**
     * Update input fields
     */
    const updateInput = (field: string, value: any) => {
        setState(prev => ({
            ...prev,
            currentInput: {
                ...prev.currentInput,
                [field]: value
            }
        }));
    };

    /**
     * Calculate and validate
     */
    const calculate = async () => {
        const { length, width, height, elementType } = state.currentInput;
        const warnings: string[] = [];
        const suggestions: string[] = [];
        const errors: string[] = [];

        try {
            // Validate dimensions
            if (!validateDimensions(length, width, height || 0)) {
                throw new Error('Invalid dimensions provided');
            }

            // AI validation
            const inputValidation = await validateUserInput(length, width, height || null, elementType);
            warnings.push(...inputValidation.warnings);
            suggestions.push(...inputValidation.suggestions);

            if (!inputValidation.isValid) {
                throw new Error(inputValidation.message);
            }

            // Calculate
            const area = calculateM2(length, width);
            const volume = height ? calculateM3(length, width, height) : undefined;
            const linearMeters = calculateM(length);

            // Validate results
            const resultValidation = validateResults(area, volume || null, linearMeters);
            warnings.push(...resultValidation.warnings);
            suggestions.push(...resultValidation.suggestions);

            // Get material suggestions
            const materialSuggestions = suggestMaterials(area, volume || null, elementType);
            suggestions.push(...materialSuggestions);

            // Save to state
            const newData: CalculationData = {
                ...state.currentInput,
                area,
                volume,
                linearMeters
            };

            // Save to localStorage
            const existingData = JSON.parse(localStorage.getItem('calculations') || '[]');
            existingData.push(newData);
            localStorage.setItem('calculations', JSON.stringify(existingData));

            setState(prev => ({
                ...prev,
                data: [...prev.data, newData],
                warnings,
                suggestions,
                errors: [],
                currentInput: {
                    length: 0,
                    width: 0,
                    height: undefined,
                    elementType: 'wall'
                }
            }));

            return newData;
        } catch (error) {
            errors.push(error instanceof Error ? error.message : 'Unknown error');
            setState(prev => ({
                ...prev,
                warnings,
                suggestions,
                errors
            }));
            throw error;
        }
    };

    /**
     * Load from localStorage on mount
     */
    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('calculations') || '[]');
        setState(prev => ({
            ...prev,
            data: savedData
        }));
    }, []);

    /**
     * Export to CSV
     */
    const exportToCSV = () => {
        const headers = ['Length (m)', 'Width (m)', 'Height (m)', 'Element Type', 'Area (m²)', 'Volume (m³)', 'Linear Meters (m)'];
        const rows = state.data.map(item => [
            item.length,
            item.width,
            item.height || '',
            item.elementType,
            item.area || '',
            item.volume || '',
            item.linearMeters || ''
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calculations.csv';
        a.click();
    };

    /**
     * Clear all data
     */
    const clearAll = () => {
        localStorage.removeItem('calculations');
        setState(prev => ({
            ...prev,
            data: [],
            currentInput: {
                length: 0,
                width: 0,
                height: undefined,
                elementType: 'wall'
            }
        }));
    };

    return {
        state,
        updateInput,
        calculate,
        exportToCSV,
        clearAll
    };
}