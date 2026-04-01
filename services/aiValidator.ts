export async function validateUserInput(
  _length: number,
  _width: number,
  _height: number | null,
  _elementType: string
) {
  return {
    isValid: true,
    warnings: [],
    suggestions: [],
    message: 'Valid input',
  };
}

export function validateResults(
  _area: number,
  _volume: number | null,
  _linearMeters: number
) {
  return {
    warnings: [],
    suggestions: [],
  };
}

export function suggestMaterials(
  _area: number,
  _volume: number | null,
  _elementType: string
) {
  return [];
}
