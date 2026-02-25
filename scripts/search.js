import { loadContacts } from "./storage.js";
import { normalizeContact } from "./contacts.js";
import { getGroupNameById } from "./groups.js";

/**
 * Build a searchable string for a contact.
 */
export const buildContactSearchText = (contact) => {
  const normalized = normalizeContact(contact);
  const groupName = getGroupNameById(normalized.groupId);
  const fields = [
    normalized.name,
    normalized.email,
    ...normalized.phones,
    ...normalized.addresses,
    groupName,
  ];

  return fields.filter((v) => !(String(v).trim() === "")).join(" ").toLowerCase();
};

/**
 * Search contacts by name/phone/email/address/group.
 */
export const searchContacts = (keyword) => {
  const contacts = loadContacts();
  const query = String(keyword ?? "").trim().toLowerCase();
  if (!query) return contacts ?? [];
  return (contacts ?? []).filter((c) => buildContactSearchText(c).includes(query));
};
