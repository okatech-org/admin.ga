// Simple utility function to capitalize the first letter of a string.
export const capitalize = (s: string) => {
  if (typeof s !== 'string' || s.length === 0) {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};
