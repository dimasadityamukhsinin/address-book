/**
 * Check whether a value is blank (null/undefined/empty after trim).
 */
const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

/**
 * Check whether a value is an empty array (or not an array at all).
 */
const isEmptyArray = (a) => !Array.isArray(a) || a.length === 0;

/**
 * Validate the contacts added.
 * If there's no errors, return null; otherwise return the error message.
 */
const validateContact = ({ name, email, phones, addresses }) => {
  const missing = [];
  if (isBlank(name)) missing.push("Nama");
  if (isBlank(email)) missing.push("Email");
  if (isEmptyArray(phones)) missing.push("No Telpon");
  if (isEmptyArray(addresses)) missing.push("Alamat");

  if (missing.length === 0) return null;
  return `${missing.join(", ")} Wajib Diisi!`;
};

/**
 * Format a contact into a printable string.
 */
const formatContact = ({ name, phones, email, addresses }) => {
  return `👤 ${name} | 📞 ${phones.join(", ")} | 📧 ${email} | 📍 ${addresses.join(", ")}`;
};

/**
 * Validate and print the contacts.
 */
const printContacts = (contacts) => {
  for (const c of contacts ?? []) {
    const error = validateContact(c);

    if (error) {
      console.log(error);
      continue;
    }

    console.log(formatContact(c));
  }
};

const CONTACTS_KEY = "contacts";

/**
 * Load contacts from localStorage.
 */
const loadContacts = () => {
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
const saveContacts = (contacts) =>
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts ?? []));

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
 * Print contacts from localStorage.
 */
const printContactsFromStorage = () => printContacts(loadContacts());

/**
 * Add a contact (validates first), persists to localStorage, and prints.
 */
const addContact = (contact) => {
  const error = validateContact(contact);

  if (error) {
    console.log(error);
    return;
  }

  const contacts = loadContacts();
  const newContact = { ...contact, id: nextId(contacts) };

  contacts.push(newContact);
  saveContacts(contacts);

  console.log("Add Contact");
};

/**
 * Edit an existing contact by id using a patch object.
 * Validates the merged result, persists, and prints.
 */
const editContact = (id, patch) => {
  const contacts = loadContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) {
    const error = "Contact tidak ditemukan";
    console.log(error);
    return;
  }

  const merged = {
    ...contacts[idx],
    ...patch,
    id: contacts[idx].id,
  };
  const error = validateContact(merged);
  if (error) {
    console.log(error);
    return;
  }

  contacts[idx] = merged;
  saveContacts(contacts);

  console.log("Edit Contact : ", merged);
};

/**
 * Delete an existing contact by id, persists, and prints.
 */
const deleteContact = (id) => {
  const contacts = loadContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) {
    const error = "Contact tidak ditemukan";
    console.log(error);
  }

  const [removed] = contacts.splice(idx, 1);
  saveContacts(contacts);

  console.log("Delete Contact");
  console.log("Terhapus:", removed);
};

addContact({
  name: "Ben Nata",
  email: "ben@nata.com",
  phones: ["+628111222333"],
  addresses: ["Jl. Mawar No. 3, Bandung"],
});

editContact(1, {
  phones: ["+628999888777", "+628123456789"],
  addresses: ["Street A No. 1, Pekanbaru"],
});

// deleteContact(1);

printContactsFromStorage();