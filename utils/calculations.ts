// utils/calculations.ts

/**
 * Function to calculate area in square meters (m2).
 * @param {number} length - Length in meters.
 * @param {number} width - Width in meters.
 * @returns {number} - Area in square meters.
 */
export function calculateM2(length: number, width: number): number {
    return length * width;
}

/**
 * Function to calculate volume in cubic meters (m3).
 * @param {number} length - Length in meters.
 * @param {number} width - Width in meters.
 * @param {number} height - Height in meters.
 * @returns {number} - Volume in cubic meters.
 */
export function calculateM3(length: number, width: number, height: number): number {
    return length * width * height;
}

/**
 * Function to calculate length in linear meters (m).
 * @param {number} totalLength - Total length in meters.
 * @returns {number} - Length in linear meters.
 */
export function calculateM(totalLength: number): number {
    return totalLength;
}