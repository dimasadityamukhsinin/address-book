export const CONTACTS_KEY = "contacts";
export const GROUPS_KEY = "groups";

/**
 * Load contacts from localStorage.
 */
export const loadContacts = () => {
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Save contacts to localStorage.
 */
export const saveContacts = (contacts) =>
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts ?? []));

/**
 * Load groups from localStorage.
 */
export const loadGroups = () => {
  try {
    const raw = localStorage.getItem(GROUPS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Save groups to localStorage.
 */
export const saveGroups = (groups) =>
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups ?? []));
