import { isBlank, normalizeGroupId, normalizeString } from "./utils.js";
import { loadContacts, loadGroups, saveContacts, saveGroups } from "./storage.js";

/**
 * Check whether a group id exists.
 */
export const groupExists = (id) => {
  const targetId = normalizeGroupId(id);
  if (targetId === null) return false;
  const groups = loadGroups();
  return (groups ?? []).some((g) => Number(g?.id) === targetId);
};

/**
 * Get group name by id.
 */
export const getGroupNameById = (id) => {
  const targetId = normalizeGroupId(id);
  if (targetId === null) return "";
  const groups = loadGroups();
  const found = (groups ?? []).find((g) => Number(g?.id) === targetId);
  return normalizeString(found?.name);
};

/**
 * Generate next numeric id for groups.
 */
const nextGroupId = (groups) => {
  const maxId = (groups ?? []).reduce(
    (m, g) => Math.max(m, Number(g?.id) || 0),
    0,
  );
  return maxId + 1;
};

/**
 * Add a group (name must be unique), persists to localStorage, and prints.
 */
export const addGroup = (group) => {
  const name = normalizeString(group?.name ?? group);
  if (isBlank(name)) {
    console.log("Nama grup tidak boleh kosong");
    return null;
  }
  const groups = loadGroups();
  const exists = groups.some(
    (g) => normalizeString(g?.name).toLowerCase() === name.toLowerCase(),
  );
  if (exists) {
    console.log("Nama grup sudah ada");
    return null;
  }

  const newGroup = { id: nextGroupId(groups), name };
  groups.push(newGroup);
  saveGroups(groups);
  console.log("Add Group : ", newGroup);
  return newGroup;
};

/**
 * Edit group name by id.
 */
export const editGroup = (id, patch) => {
  const groups = loadGroups();
  const targetId = normalizeGroupId(id);
  if (targetId === null) {
    console.log("ID grup tidak valid");
    return null;
  }
  const idx = groups.findIndex((g) => Number(g?.id) === targetId);
  if (idx === -1) {
    console.log("Grup tidak ditemukan");
    return null;
  }

  const name = normalizeString(patch?.name ?? patch);
  if (isBlank(name)) {
    console.log("Nama grup tidak boleh kosong");
    return null;
  }
  const exists = groups.some(
    (g) =>
      Number(g?.id) !== targetId &&
      normalizeString(g?.name).toLowerCase() === name.toLowerCase(),
  );
  if (exists) {
    console.log("Nama grup sudah ada");
    return null;
  }

  const updated = { ...groups[idx], name };
  groups[idx] = updated;
  saveGroups(groups);
  console.log("Edit Group : ", updated);
  return updated;
};

/**
 * Delete group by id, and unassign contacts that reference it.
 */
export const deleteGroup = (id) => {
  const groups = loadGroups();
  const targetId = normalizeGroupId(id);
  if (targetId === null) {
    console.log("ID grup tidak valid");
    return null;
  }
  const idx = groups.findIndex((g) => Number(g?.id) === targetId);
  if (idx === -1) {
    console.log("Grup tidak ditemukan");
    return null;
  }

  const [removed] = groups.splice(idx, 1);
  saveGroups(groups);

  const contacts = loadContacts();
  let changed = false;
  const updatedContacts = (contacts ?? []).map((c) => {
    if (normalizeGroupId(c?.groupId) === targetId) {
      changed = true;
      return { ...c, groupId: null };
    }
    return c;
  });
  if (changed) saveContacts(updatedContacts);

  console.log("Delete Group");
  console.log("Terhapus:", removed);
  return removed;
};
