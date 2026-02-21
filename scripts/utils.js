/**
 * Check whether a value is blank (null/undefined/empty after trim).
 */
export const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

/**
 * Check whether a value is an empty array (or not an array at all).
 */
export const isEmptyArray = (a) => !Array.isArray(a) || a.length === 0;

/**
 * Normalize a group id: number or null.
 */
export const normalizeGroupId = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Normalize a single string: trim and coerce to string.
 */
export const normalizeString = (v) => (v === null || v === undefined ? "" : String(v).trim());

/**
 * Normalize an array of strings: trim, drop blanks, ensure array.
 */
export const normalizeStringArray = (v) =>
  Array.isArray(v)
    ? v.map((item) => normalizeString(item)).filter((item) => !isBlank(item))
    : [];
