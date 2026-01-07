export function getUpdatedFields<T extends Record<string, any>>(
  values: Partial<T>,
  original: Partial<T>
): Partial<T> {
  if (!values || !original) return {};
  
  return (Object.keys(values) as Array<keyof T>).reduce((acc, key) => {
    const currentValue = values[key];
    const originalValue = original[key];
    
    // Handle file upload objects (like logo) - compare by uid
    if (currentValue && typeof currentValue === 'object' && 'uid' in currentValue && 
        originalValue && typeof originalValue === 'object' && 'uid' in originalValue) {
      if (currentValue.uid !== originalValue.uid) {
        acc[key] = currentValue;
      }
    }
    // Handle array comparison
    else if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
      if (currentValue.length !== originalValue.length || 
          !currentValue.every((val, i) => val === originalValue[i])) {
        acc[key] = currentValue;
      }
    } 
    // Handle nested object comparison
    else if (typeof currentValue === 'object' && currentValue !== null && 
             typeof originalValue === 'object' && originalValue !== null &&
             !Array.isArray(currentValue) && !Array.isArray(originalValue)) {
      const nestedChanges = getUpdatedFields(currentValue as any, originalValue as any);
      if (Object.keys(nestedChanges).length > 0) {
        (acc as any)[key] = nestedChanges;
      }
    }
    // Handle primitive values and other cases
    else if (currentValue !== originalValue) {
      acc[key] = currentValue;
    }
    
    return acc;
  }, {} as Partial<T>);
}