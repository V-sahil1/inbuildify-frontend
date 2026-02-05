export function getUpdatedFields<T extends Record<string, any>>(
  values: Partial<T>,
  original: Partial<T>
): { isUpdated: boolean; updatedFields: Partial<T> } {
  if (!values || !original) return { isUpdated: false, updatedFields: {} };
  const updatedFields: Partial<T> = (Object.keys(values) as Array<keyof T>).reduce((acc, key) => {
    const currentValue = values[key];
    const originalValue = original[key];

    // Handle file upload objects (like logo) - compare by uid
    if (
      currentValue &&
      typeof currentValue === 'object' &&
      'uid' in currentValue &&
      originalValue &&
      typeof originalValue === 'object' &&
      'uid' in originalValue
    ) {
      if (currentValue.uid !== originalValue.uid) {
        acc[key] = currentValue;
      }
    }
    // Handle array comparison
    else if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
      if (
        currentValue.length !== originalValue.length ||
        !currentValue.every((val, i) => val === originalValue[i])
      ) {
        acc[key] = currentValue;
      }
    }
    // Handle nested object comparison
    else if (
      typeof currentValue === 'object' &&
      currentValue !== null &&
      typeof originalValue === 'object' &&
      originalValue !== null &&
      !Array.isArray(currentValue) &&
      !Array.isArray(originalValue)
    ) {
      const nestedChanges = getUpdatedFields(currentValue as any, originalValue as any);
      if (nestedChanges.isUpdated && Object.keys(nestedChanges.updatedFields).length > 0) {
        (acc as any)[key] = nestedChanges.updatedFields;
      }
    }
    // Handle primitive values and other cases
    else if (
      // Treat empty string and null as the same - don't count as update
      (currentValue === '' && originalValue === null) ||
      (currentValue === null && originalValue === '')
    ) {
      // Do nothing - these are considered the same
    }
    else if (currentValue !== originalValue) {
      acc[key] = currentValue;
    }

    return acc;
  }, {} as Partial<T>);

  return { isUpdated: Object.keys(updatedFields).length > 0, updatedFields };
}
