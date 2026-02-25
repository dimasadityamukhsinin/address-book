import { loadContacts, loadGroups, saveContacts, saveGroups } from "./storage.js";
import { nextId } from "./utils.js";

/**
 * Check whether a group id exists.
 */
export const groupExists = (id) => {
  const targetId = Number(id);
  const groups = loadGroups();
  return (groups ?? []).some((g) => Number(g?.id) === targetId);
};

/**
 * Get group name by id.
 */
export const getGroupNameById = (id) => {
  const targetId = Number(id);
  const groups = loadGroups();
  const found = (groups ?? []).find((g) => Number(g?.id) === targetId);
  return String(found?.name ?? "").trim();
};

/**
 * Add a group (name must be unique), persists to localStorage, and prints.
 */
export const addGroup = (group) => {
  const name = String(group.name).trim();
  if (!name) {
    throw new Error("Nama grup tidak boleh kosong");
  }
  const groups = loadGroups();
  const exists = groups.some(
    (g) => String(g?.name ?? "").trim().toLowerCase() === name.toLowerCase(),
  );
  if (exists) {
    throw new Error("Nama grup sudah ada");
  }

  const newGroup = { id: nextId(groups), name };
  groups.push(newGroup);
  saveGroups(groups);
  return newGroup;
};

/**
 * Edit group name by id.
 */
export const editGroup = (id, patch) => {
  const groups = loadGroups();
  const targetId = Number(id);
  const idx = groups.findIndex((g) => Number(g?.id) === targetId);
  if (idx === -1) {
    throw new Error("Grup tidak ditemukan");
  }

  const name = String(patch.name).trim();
  if (!name) {
    throw new Error("Nama grup tidak boleh kosong");
  }
  const exists = groups.some(
    (g) =>
      Number(g?.id) !== targetId &&
      String(g.name ?? "").trim().toLowerCase() === name.toLowerCase(),
  );
  if (exists) {
    throw new Error("Nama grup sudah ada");
  }

  const updated = { ...groups[idx], name };
  groups[idx] = updated;
  saveGroups(groups);
  return updated;
};

/**
 * Delete group by id, and unassign contacts that reference it.
 */
export const deleteGroup = (id) => {
  const groups = loadGroups();
  const targetId = Number(id);
  const idx = groups.findIndex((g) => Number(g?.id) === targetId);
  if (idx === -1) {
    throw new Error("Grup tidak ditemukan");
  }

  const [removed] = groups.splice(idx, 1);
  saveGroups(groups);

  const contacts = loadContacts();
  let changed = false;
  const updatedContacts = (contacts ?? []).map((c) => {
    if (Number(c.groupId) === targetId) {
      changed = true;
      return { ...c, groupId: null };
    }
    return c;
  });
  if (changed) saveContacts(updatedContacts);
  return removed;
};
