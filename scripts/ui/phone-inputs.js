import { elements } from "./elements.js";

/**
 * Build a phone input row.
 */
const createPhoneRow = (value = "") => {
  const row = document.createElement("div");
  row.className = "flex items-center gap-2";
  row.dataset.phoneRow = "true";

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "08xxx";
  input.value = value;
  input.dataset.phoneInput = "true";
  input.className =
    "flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.dataset.phoneRemove = "true";
  removeButton.className =
    "shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 shadow-sm transition hover:bg-slate-100";
  removeButton.textContent = "Hapus";

  row.append(input, removeButton);
  return row;
};

/**
 * Toggle remove button visibility based on row count.
 */
const updatePhoneRows = () => {
  const rows = Array.from(
    elements.phonesContainer.querySelectorAll("[data-phone-row]"),
  );
  rows.forEach((row) => {
    const removeButton = row.querySelector("[data-phone-remove]");
    if (removeButton)
      removeButton.classList.toggle("hidden", rows.length === 1);
  });
};

/**
 * Replace phone inputs with the provided list.
 */
export const setPhoneRows = (phones = []) => {
  elements.phonesContainer.innerHTML = "";
  const list = Array.isArray(phones) && phones.length > 0 ? phones : [""];
  for (const phone of list) {
    elements.phonesContainer.appendChild(createPhoneRow(phone));
  }
  updatePhoneRows();
};

/**
 * Read phone values from the UI.
 */
export const getPhoneValues = () =>
  Array.from(
    elements.phonesContainer?.querySelectorAll("[data-phone-input]") ?? [],
  )
    .map((input) => input.value)
    .filter((v) => v !== "");

/**
 * Wire add/remove events for phone inputs.
 */
export const initPhoneInputs = () => {
  setPhoneRows([""]);

  elements.addPhoneButton.addEventListener("click", () => {
    elements.phonesContainer.appendChild(createPhoneRow());
    updatePhoneRows();
  });

  elements.phonesContainer.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-phone-remove]");
    const row = removeButton.closest("[data-phone-row]");
    row.remove();
    updatePhoneRows();
  });
};
