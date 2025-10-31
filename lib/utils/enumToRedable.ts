export function enumToReadable(value: string): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .replace(/[_-]/g, ' ') // treat both _ and - as word separators
    .split(' ')
    .map((word, idx) => (idx === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}
