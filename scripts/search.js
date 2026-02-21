import { isBlank, normalizeString, normalizeStringArray } from "./utils.js";
import { loadContacts } from "./storage.js";
import { normalizeContact } from "./contacts.js";
import { getGroupNameById } from "./groups.js";

/**
 * Build a searchable string for a contact.
 */
export const buildContactSearchText = (contact) => {
  const normalized = normalizeContact(contact);
  const groupName = getGroupNameById(normalized.groupId);
  const groupsList = normalizeStringArray(contact?.groups);
  const fields = [
    normalized.name,
    normalized.email,
    ...normalized.phones,
    ...normalized.addresses,
    groupName,
    ...groupsList,
  ];

  return fields.filter((v) => !isBlank(v)).join(" ").toLowerCase();
};

/**
 * Search contacts by name/phone/email/address/group.
 */
export const searchContacts = (keyword) => {
  const contacts = loadContacts();
  const query = normalizeString(keyword).toLowerCase();
  if (isBlank(query)) return contacts ?? [];
  return (contacts ?? []).filter((c) => buildContactSearchText(c).includes(query));
};
