// validation.ts

/**
 * Validates dimensions to ensure they meet the specified criteria.
 * @param {number} width - The width of the object.
 * @param {number} height - The height of the object.
 * @param {number} depth - The depth of the object.
 * @returns {boolean} - Returns true if dimensions are valid, otherwise false.
 */
function validateDimensions(width: number, height: number, depth: number): boolean {
    return width > 0 && height > 0 && depth > 0;
}

/**
 * Validates materials to ensure they are part of a predefined list of acceptable materials.
 * @param {string} material - The material to validate.
 * @returns {boolean} - Returns true if the material is valid, otherwise false.
 */
function validateMaterials(material: string): boolean {
    const validMaterials = ["wood", "metal", "plastic", "glass"];
    return validMaterials.includes(material);
}

/**
 * Validates the quality of the provided data against specific criteria.
 * @param {any[]} data - The data array to validate.
 * @returns {boolean} - Returns true if data quality is acceptable, otherwise false.
 */
function validateDataQuality(data: any[]): boolean {
    return data.length > 0 && data.every(item => item != null);
}

export { validateDimensions, validateMaterials, validateDataQuality };