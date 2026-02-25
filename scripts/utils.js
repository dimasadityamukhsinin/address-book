/**
 * Generate next numeric id based on the max id in the list.
 */
export const nextId = (data) => {
  const maxId = (data ?? []).reduce(
    (m, c) => Math.max(m, Number(c?.id) || 0),
    0,
  );
  return maxId + 1;
};