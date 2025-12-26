export function getUpdatedFields<T extends Record<string, any>>(
  values: Partial<T>,
  original: Partial<T>
): Partial<T> {
  return (Object.keys(values) as Array<keyof T>).reduce((acc, key) => {
    const currentValue = values[key];
    const originalValue = original[key];
    
    // Handle array comparison - check if both are arrays and have the same length
    if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
      if (currentValue.length !== originalValue.length || 
          !currentValue.every((val, i) => val === originalValue[i])) {
        acc[key] = currentValue;
      }
    } 
    // Handle primitive values and other cases
    else if (currentValue !== originalValue) {
      acc[key] = currentValue;
    }
    
    return acc;
  }, {} as Partial<T>);
}