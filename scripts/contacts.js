import {
  isBlank,
  isEmptyArray,
  normalizeGroupId,
  normalizeString,
  normalizeStringArray,
} from "./utils.js";
import { loadContacts, saveContacts } from "./storage.js";
import { getGroupNameById, groupExists } from "./groups.js";

/**
 * Normalize a contact payload.
 */
export const normalizeContact = ({
  name,
  email,
  phones,
  addresses,
  groupId,
  group,
  favorite,
} = {}) => ({
  name: normalizeString(name),
  email: normalizeString(email).toLowerCase(),
  phones: normalizeStringArray(phones),
  addresses: normalizeStringArray(addresses),
  groupId: normalizeGroupId(groupId ?? group?.id),
  favorite: Boolean(favorite),
});

/**
 * Validate the contacts added.
 * If there's no errors, return null; otherwise return the error message.
 */
// TODO: try to make use of the normalize() call inside validate(), instead of calling normalize() multiple times
export const validateContact = ({ name, email, phones, addresses, groupId, group }) => {
  const normalized = normalizeContact({ name, email, phones, addresses, groupId, group });
  const missing = [];

  // TODO: find a way to make this simpler
  if (isBlank(normalized.name)) missing.push("Nama");
  if (isBlank(normalized.email)) missing.push("Email");
  if (isEmptyArray(normalized.phones)) missing.push("No Telpon");
  if (isEmptyArray(normalized.addresses)) missing.push("Alamat");
  if (normalized.groupId === null) missing.push("Group");

  if (missing.length > 0) return `${missing.join(", ")} Wajib Diisi!`;

  if (!groupExists(normalized.groupId)) {
    return "Group tidak ditemukan";
  }

  return null;
};

/**
 * Format a contact into a printable string.
 */
export const formatContact = ({ name, phones, email, addresses, groupId, favorite }) => {
  const groupName = getGroupNameById(groupId);
  const groupLabel =
    groupId === null
      ? "-"
      : groupName
        ? `${groupName} (${groupId})`
        : `ID ${groupId}`;
  const favLabel = favorite ? "★" : "—";
  return `👤 ${name} | 📞 ${phones.join(", ")} | 📧 ${email} | 📍 ${addresses.join(", ")} | 🏷️ ${groupLabel} | ⭐ ${favLabel}`;
};

/**
 * Validate and print the contacts.
 */
export const printContacts = (contacts) => {
  for (const c of contacts ?? []) {
    const error = validateContact(c);

    if (error) {
      console.error(error);
      continue;
    }

    console.log(formatContact(c));
  }
};

/**
 * Generate next numeric id based on the max id in the list.
 */
const nextId = (contacts) => {
  const maxId = (contacts ?? []).reduce(
    (m, c) => Math.max(m, Number(c?.id) || 0),
    0,
  );
  return maxId + 1;
};

/**
 * Add a contact (validates first), persists to localStorage, and prints.
 */
export const addContact = (contact) => {
  const normalized = { ...contact, ...normalizeContact(contact) };
  const error = validateContact(normalized);

  if (error) {
    console.error(error);
    return;
  }

  const contacts = loadContacts();
  const newContact = { ...normalized, id: nextId(contacts) };

  contacts.push(newContact);
  saveContacts(contacts);

  console.log("Add Contact : ", newContact);
};

/**
 * Edit an existing contact by id using a patch object.
 * Validates the merged result, persists, and prints.
 */
export const editContact = (id, patch) => {
  const contacts = loadContacts();
  const targetId = Number(id);
  if (!Number.isFinite(targetId)) {
    const error = "ID tidak valid";
    console.error(error);
    return;
  }
  const idx = contacts.findIndex((c) => Number(c?.id) === targetId);
  if (idx === -1) {
    const error = "Contact tidak ditemukan";
    console.error(error);
    return;
  }

  const merged = {
    ...contacts[idx],
    ...patch,
    id: contacts[idx].id,
  };
  const normalized = { ...merged, ...normalizeContact(merged), id: merged.id };
  const error = validateContact(normalized);
  if (error) {
    console.error(error);
    return;
  }

  contacts[idx] = normalized;
  saveContacts(contacts);

  console.log("Edit Contact : ", merged);
};

/**
 * Mark/unmark contact as favorite by id.
 */
export const setFavorite = (id, isFavorite) => {
  const contacts = loadContacts();
  const targetId = Number(id);
  if (!Number.isFinite(targetId)) {
    const error = "ID tidak valid";
    console.error(error);
    return;
  }
  const idx = contacts.findIndex((c) => Number(c?.id) === targetId);
  if (idx === -1) {
    const error = "Contact tidak ditemukan";
    console.error(error);
    return;
  }

  const updated = {
    ...contacts[idx],
    favorite: Boolean(isFavorite),
  };
  const normalized = { ...updated, ...normalizeContact(updated), id: updated.id };
  contacts[idx] = normalized;
  saveContacts(contacts);

  console.log("Set Favorite : ", normalized);
};

/**
 * Assign/unassign a contact to a group by id.
 */
export const setContactGroup = (contactId, groupId) => {
  const contacts = loadContacts();
  const targetId = Number(contactId);
  if (!Number.isFinite(targetId)) {
    console.log("ID tidak valid");
    return;
  }
  const idx = contacts.findIndex((c) => Number(c?.id) === targetId);
  if (idx === -1) {
    console.log("Contact tidak ditemukan");
    return;
  }

  const normalizedGroupId = normalizeGroupId(groupId);
  if (normalizedGroupId !== null && !groupExists(normalizedGroupId)) {
    console.log("Group tidak ditemukan");
    return;
  }

  const updated = { ...contacts[idx], groupId: normalizedGroupId };
  const normalized = { ...updated, ...normalizeContact(updated), id: updated.id };
  contacts[idx] = normalized;
  saveContacts(contacts);

  console.log("Set Group : ", normalized);
};

/**
 * Delete an existing contact by id, persists, and prints.
 */
export const deleteContact = (id) => {
  const contacts = loadContacts();
  const targetId = Number(id);
  if (!Number.isFinite(targetId)) {
    const error = "ID tidak valid";
    console.error(error);
    return;
  }
  const idx = contacts.findIndex((c) => Number(c?.id) === targetId);
  if (idx === -1) {
    const error = "Contact tidak ditemukan";
    console.error(error);
    return;
  }

  const [removed] = contacts.splice(idx, 1);
  saveContacts(contacts);

  console.log("Delete Contact");
  console.log("Terhapus:", removed);
};
