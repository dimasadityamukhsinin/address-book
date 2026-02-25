import { loadContacts, saveContacts } from "./storage.js";
import { groupExists } from "./groups.js";
import { nextId } from "./utils.js";

/**
 * Normalize a contact payload.
 */
export const normalizeContact = ({
  name,
  email,
  phones,
  addresses,
  favorite,
} = {}) => ({
  name:  String(name ?? "").trim(),
  email: String(email ?? "").trim().toLowerCase(),
  phones: phones.filter((item) => !(String(item ?? "").trim() === "")),
  addresses: addresses.filter((item) => !(String(item ?? "").trim() === "")),
  favorite: Boolean(favorite),
});

/**
 * Validate the contacts added and return normalized data.
 */
export const validateContact = (contact) => {
  const normalized = { ...contact, ...normalizeContact(contact) };
  const missing = [];

  if (!normalized.name) missing.push("Nama");
  if (!normalized.email) missing.push("Email");
  if (normalized.phones.length === 0) missing.push("No Telpon");
  if (normalized.addresses.length === 0) missing.push("Alamat");

  if (missing.length > 0) {
    return {
      error: `${missing.join(", ")} Wajib Diisi!`,
      normalized,
    };
  }

  if (normalized.groupId !== null && !groupExists(normalized.groupId)) {
    return {
      error: "Group tidak ditemukan",
      normalized
    };
  }

  return {
    error: null,
    normalized,
  };
};

/**
 * Add a contact (validates first), persists to localStorage, and prints.
 */
export const addContact = (contact) => {
  const { error, normalized } = validateContact(contact);

  if (error) {
    throw new Error(error);
  }

  const contacts = loadContacts();
  const newContact = { ...normalized, id: nextId(contacts) };

  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
};

/**
 * Edit an existing contact by id using a patch object.
 * Validates the merged result, persists, and prints.
 */
export const editContact = (id, patch) => {
  const contacts = loadContacts();
  const targetId = Number(id);
  const idx = contacts.findIndex((c) => Number(c?.id) === targetId);
  if (idx === -1) {
    throw new Error("Contact tidak ditemukan");
  }

  const merged = {
    ...contacts[idx],
    ...patch,
    id: contacts[idx].id,
  };
  const { error, normalized } = validateContact(merged);
  if (error) {
    throw new Error(error);
  }

  contacts[idx] = normalized;
  saveContacts(contacts);
  return normalized;
};

/**
 * Mark/unmark contact as favorite by id.
 */
export const setFavorite = (id, isFavorite) => {
  const contacts = loadContacts();
  const targetId = Number(id);
  const idx = contacts.findIndex((c) => Number(c?.id) === targetId);
  if (idx === -1) {
    throw new Error("Contact tidak ditemukan");
  }

  const updated = {
    ...contacts[idx],
    favorite: Boolean(isFavorite),
  };
  const normalized = {
    ...updated,
    ...normalizeContact(updated),
    id: updated.id,
  };
  contacts[idx] = normalized;
  saveContacts(contacts);
  return normalized;
};

/**
 * Assign/unassign a contact to a group by id.
 */
export const setContactGroup = (contactId, groupId) => {
  const contacts = loadContacts();
  const targetId = Number(contactId);
  const idx = contacts.findIndex((c) => Number(c?.id) === targetId);
  if (idx === -1) {
    throw new Error("Contact tidak ditemukan");
  }

  if (!groupExists(Number(groupId))) {
    throw new Error("Group tidak ditemukan");
  }

  const updated = { ...contacts[idx], groupId };
  const normalized = {
    ...updated,
    ...normalizeContact(updated),
    id: updated.id,
  };
  contacts[idx] = normalized;
  saveContacts(contacts);
  return normalized;
};

/**
 * Delete an existing contact by id, persists, and prints.
 */
export const deleteContact = (id) => {
  const contacts = loadContacts();
  const targetId = Number(id);
  const idx = contacts.findIndex((c) => Number(c?.id) === targetId);
  if (idx === -1) {
    throw new Error("Contact tidak ditemukan");
  }

  const [removed] = contacts.splice(idx, 1);
  saveContacts(contacts);
  return removed;
};
