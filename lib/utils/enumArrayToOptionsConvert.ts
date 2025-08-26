export function enumArrayToOptions(values: string[]): { label: string; value: string }[] {
    if (!Array.isArray(values)) return [];
  
    return values.map((value) => {
      if (!value) return { label: '', value: '' };
  
      const label = value
        .toLowerCase()
        .replace(/[_-]/g, ' ') // treat both _ and - as word separators
        .split(' ')
        .map((word, idx) =>
          idx === 0
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word
        )
        .join(' ');
  
      return { label, value };
    });
  }
  