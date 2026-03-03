import { addGroup, deleteGroup, getGroupNameById } from "./groups.js";
import {
  addContact,
  deleteContact,
  editContact,
  setFavorite,
} from "./contacts.js";
import { searchContacts } from "./search.js";
import { loadContacts, loadGroups } from "./storage.js";
import { elements } from "./ui/elements.js";
import {
  closeContactForm,
  getContactFormPayload,
  getEditingId,
  initContactFormControls,
  openContactForm,
  setFormError,
} from "./ui/form.js";

const filterState = {
  groupId: "all",
  favorite: false,
};

/**
 * Render group list, group select options, and group count.
 */
const renderGroups = () => {
  const groups = loadGroups();
  const contacts = loadContacts();
  const counts = contacts.reduce((acc, contact) => {
    if (contact?.groupId === null || contact?.groupId === undefined) return acc;
    const key = String(contact.groupId);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const selected = elements.groupSelect?.value ?? "";
  elements.groupSelect.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Tanpa Group";
  elements.groupSelect.appendChild(emptyOption);
  for (const group of groups) {
    const option = document.createElement("option");
    option.value = String(group.id);
    option.textContent = group.name;
    elements.groupSelect.appendChild(option);
  }
  if (selected && groups.some((group) => String(group.id) === selected)) {
    elements.groupSelect.value = selected;
  } else {
    elements.groupSelect.value = "";
  }

  elements.groupList.innerHTML = "";
  for (const group of groups) {
    const item = document.createElement("li");
    item.className = "flex items-center gap-2";

    const filterButton = document.createElement("button");
    filterButton.type = "button";
    filterButton.dataset.filter = "group";
    filterButton.dataset.groupId = String(group.id);
    filterButton.className =
      "flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100";

    const name = document.createElement("span");
    name.textContent = group.name;

    const count = counts[String(group.id)] ?? 0;
    const countBadge = document.createElement("span");
    countBadge.className =
      "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500";
    countBadge.textContent = String(count);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete-group";
    deleteButton.dataset.id = String(group.id);
    deleteButton.className =
      "rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50";
    deleteButton.textContent = "Hapus";

    filterButton.append(name, countBadge);
    item.append(filterButton, deleteButton);
    elements.groupList.appendChild(item);
  }

  const groupIds = new Set(groups.map((group) => String(group.id)));
  if (
    filterState.groupId !== "all" &&
    !groupIds.has(String(filterState.groupId))
  ) {
    filterState.groupId = "all";
  }

  elements.groupCount.textContent = String(groups.length);

  updateFilterStyles();
};

/**
 * Update active styles for filter buttons in the sidebar.
 */
const updateFilterStyles = () => {
  if (!elements.groupSidebar) return;
  const buttons = elements.groupSidebar.querySelectorAll("button[data-filter]");
  for (const button of buttons) {
    const type = button.dataset.filter;
    const isAll = type === "all";
    const isGroup = type === "group";
    const isFavorite = type === "favorite";
    const matches =
      (isAll && filterState.groupId === "all" && !filterState.favorite) ||
      (isGroup &&
        !filterState.favorite &&
        button.dataset.groupId === String(filterState.groupId)) ||
      (isFavorite && filterState.favorite);

    button.classList.toggle("bg-slate-900", matches);
    button.classList.toggle("text-white", matches);
    button.classList.toggle("border-slate-900", matches);
    button.classList.toggle("bg-white", !matches);
    button.classList.toggle("text-slate-900", !matches);
    button.classList.toggle("border-slate-200", !matches);
    button.classList.toggle("hover:bg-slate-100", !matches);
    button.classList.toggle("hover:opacity-90", matches);
  }
};

/**
 * Render contacts table based on current filters.
 */
const renderContacts = () => {
  const query = elements.searchInput?.value ?? "";
  const baseList = query ? searchContacts(query) : loadContacts();
  let list = baseList;

  if (filterState.groupId !== "all") {
    list = list.filter(
      (contact) => String(contact?.groupId) === String(filterState.groupId),
    );
  }

  if (filterState.favorite) {
    list = list.filter((contact) => Boolean(contact?.favorite));
  }

  if (elements.tableBody) {
    elements.tableBody.innerHTML = "";
    for (const contact of list ?? []) {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = contact?.name ?? "";

      const emailCell = document.createElement("td");
      emailCell.textContent = contact?.email ?? "";

      const phonesCell = document.createElement("td");
      phonesCell.textContent = (contact?.phones ?? []).join(", ");

      const addressesCell = document.createElement("td");
      addressesCell.textContent = (contact?.addresses ?? []).join(", ");

      const groupCell = document.createElement("td");
      groupCell.textContent =
        getGroupNameById(contact?.groupId) || "Tanpa Group";

      const favoriteCell = document.createElement("td");
      const favoriteButton = document.createElement("button");
      favoriteButton.type = "button";
      favoriteButton.dataset.action = "favorite";
      favoriteButton.dataset.id = String(contact.id);
      favoriteButton.dataset.favorite = String(Boolean(contact?.favorite));
      favoriteButton.className =
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-base transition hover:bg-slate-100";
      favoriteButton.textContent = contact?.favorite ? "★" : "☆";
      favoriteButton.style.color = contact?.favorite ? "#f59e0b" : "inherit";
      favoriteCell.appendChild(favoriteButton);

      const actionCell = document.createElement("td");
      const actionWrap = document.createElement("div");
      actionWrap.className = "flex items-center gap-2";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.dataset.action = "edit";
      editButton.dataset.id = String(contact.id);
      editButton.className =
        "rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900 transition hover:bg-slate-100";
      editButton.textContent = "Edit";

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.dataset.action = "delete";
      deleteButton.dataset.id = String(contact.id);
      deleteButton.className =
        "rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900 transition hover:bg-rose-50";
      deleteButton.textContent = "Hapus";

      actionWrap.append(editButton, deleteButton);
      actionCell.appendChild(actionWrap);

      row.append(
        nameCell,
        emailCell,
        phonesCell,
        addressesCell,
        groupCell,
        favoriteCell,
        actionCell,
      );
      elements.tableBody.appendChild(row);
    }
  }

  if (elements.emptyState) {
    elements.emptyState.classList.toggle("hidden", (list ?? []).length > 0);
  }
  if (elements.contactCount) {
    elements.contactCount.textContent = String((list ?? []).length);
  }
  updateFilterStyles();
};

/**
 * Find a contact by id from storage.
 */
const getContactById = (id) => {
  const targetId = Number(id);
  return (
    loadContacts().find((contact) => Number(contact?.id) === targetId) ?? null
  );
};

initContactFormControls();
renderGroups();
renderContacts();

if (elements.addContactButton) {
  elements.addContactButton.addEventListener("click", () => {
    openContactForm();
  });
}

if (elements.cancelButton) {
  elements.cancelButton.addEventListener("click", () => {
    closeContactForm();
  });
}

if (elements.form) {
  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = getContactFormPayload();
    const editingId = getEditingId();
    try {
      if (editingId) {
        editContact(editingId, payload);
      } else {
        addContact(payload);
      }
    } catch (error) {
      setFormError(error?.message ?? "Terjadi kesalahan");
      return;
    }

    closeContactForm();
    renderContacts();
    renderGroups();
  });
}

if (elements.searchInput) {
  elements.searchInput.addEventListener("input", () => {
    renderContacts();
  });
}

if (elements.tableBody) {
  elements.tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "edit") {
      const contact = getContactById(id);
      if (!contact) return;
      openContactForm(contact);
    }

    if (action === "delete") {
      const contact = getContactById(id);
      if (!contact) return;
      const confirmed = window.confirm(`Hapus kontak ${contact.name}?`);
      if (!confirmed) return;
      try {
        deleteContact(id);
      } catch (error) {
        window.alert(error?.message ?? "Gagal menghapus kontak");
        return;
      }
      renderContacts();
      renderGroups();
    }

    if (action === "favorite") {
      const isFavorite = button.dataset.favorite === "true";
      try {
        setFavorite(id, !isFavorite);
      } catch (error) {
        window.alert(error?.message ?? "Gagal memperbarui favorit");
        return;
      }
      renderContacts();
    }
  });
}

if (elements.groupForm) {
  elements.groupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = elements.groupNameInput?.value.trim() ?? "";
    if (!name) return;

    try {
      addGroup({ name });
    } catch (error) {
      window.alert(error?.message ?? "Gagal menambah group");
      return;
    }

    elements.groupNameInput.value = "";
    renderGroups();
  });
}

if (elements.groupList) {
  elements.groupList.addEventListener("click", (event) => {
    const filterButton = event.target.closest("button[data-filter='group']");
    if (filterButton) {
      filterState.groupId = filterButton.dataset.groupId;
      filterState.favorite = false;
      renderContacts();
      updateFilterStyles();
      return;
    }

    const deleteButton = event.target.closest(
      "button[data-action='delete-group']",
    );
    if (!deleteButton) return;

    const id = deleteButton.dataset.id;
    const confirmed = window.confirm(
      "Hapus group ini? Kontak akan kehilangan group.",
    );
    if (!confirmed) return;

    try {
      deleteGroup(id);
    } catch (error) {
      window.alert(error?.message ?? "Gagal menghapus group");
      return;
    }
    renderGroups();
    renderContacts();
  });
}

if (elements.groupSidebar) {
  elements.groupSidebar.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;

    const type = button.dataset.filter;
    if (type === "group") return;
    if (type === "all") {
      filterState.groupId = "all";
      filterState.favorite = false;
    }

    if (type === "favorite") {
      filterState.favorite = !filterState.favorite;
      if (filterState.favorite) {
        filterState.groupId = "all";
      }
    }

    renderContacts();
    updateFilterStyles();
  });
}
