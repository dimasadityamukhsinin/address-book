import { elements } from "./elements.js";

/**
 * Build an address input row.
 */
const createAddressRow = (value = "") => {
  const row = document.createElement("div");
  row.className = "flex items-center gap-2";
  row.dataset.addressRow = "true";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Jl. Mawar No. 1, Bandung";
  input.value = value;
  input.dataset.addressInput = "true";
  input.className =
    "flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.dataset.addressRemove = "true";
  removeButton.className =
    "shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 shadow-sm transition hover:bg-slate-100";
  removeButton.textContent = "Hapus";

  row.append(input, removeButton);
  return row;
};

/**
 * Toggle required state and remove button visibility based on count.
 */
const updateAddressRows = () => {
  const rows = Array.from(elements.addressesContainer.querySelectorAll("[data-address-row]"));
  rows.forEach((row, index) => {
    const removeButton = row.querySelector("[data-address-remove]");
    if (removeButton) removeButton.classList.toggle("hidden", rows.length === 1);
  });
};

/**
 * Replace address inputs with the provided list.
 */
export const setAddressRows = (addresses = []) => {
  elements.addressesContainer.innerHTML = "";
  const list = Array.isArray(addresses) && addresses.length > 0 ? addresses : [""];
  for (const address of list) {
    elements.addressesContainer.appendChild(createAddressRow(address));
  }
  updateAddressRows();
};

/**
 * Read address values from the UI.
 */
export const getAddressValues = () =>
  Array.from(elements.addressesContainer?.querySelectorAll("[data-address-input]") ?? [])
    .map((input) => input.value.trim())
    .filter(Boolean);

/**
 * Wire add/remove events for address inputs.
 */
export const initAddressInputs = () => {
  setAddressRows([""]);

  if (elements.addAddressButton) {
    elements.addAddressButton.addEventListener("click", () => {
      elements.addressesContainer.appendChild(createAddressRow());
      updateAddressRows();
    });
  }

  elements.addressesContainer.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-address-remove]");
    const row = removeButton.closest("[data-address-row]");
    row.remove();
    updateAddressRows();
  });
};
