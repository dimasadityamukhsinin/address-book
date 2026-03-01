import { elements } from "./elements.js";
import {
  getAddressValues,
  initAddressInputs,
  setAddressRows,
} from "./address-inputs.js";
import {
  getPhoneValues,
  initPhoneInputs,
  setPhoneRows,
} from "./phone-inputs.js";

/**
 * Initialize phone and address inputs once.
 */
export const initContactFormControls = () => {
  initPhoneInputs();
  initAddressInputs();
};

/**
 * Update the form error message.
 */
export const setFormError = (message = "") =>
  (elements.formError.textContent = message);

/**
 * Open the contact form for create or edit.
 */
export const openContactForm = (contact = null) => {
  elements.formSection.classList.remove("hidden");
  elements.form.dataset.editingId = contact?.id ? String(contact.id) : "";

  elements.formTitle.textContent = contact ? "Edit Kontak" : "Tambah Kontak";
  elements.saveButton.textContent = contact ? "Simpan Perubahan" : "Simpan";

  elements.nameInput.value = contact?.name ?? "";
  elements.emailInput.value = contact?.email ?? "";
  elements.favoriteInput.checked = Boolean(contact?.favorite);

  setPhoneRows(contact?.phones ?? []);
  setAddressRows(contact?.addresses ?? []);

  const groupId = contact?.groupId ?? "";
  elements.groupSelect.value = groupId === null ? "" : String(groupId);

  setFormError("");
  elements.formSection.scrollIntoView({ behavior: "smooth" });
};

/**
 * Close and reset the contact form.
 */
export const closeContactForm = () => {
  elements.form.reset();
  elements.form.dataset.editingId = "";
  elements.formSection.classList.add("hidden");
  setFormError("");
  setPhoneRows([""]);
  setAddressRows([""]);
};

/**
 * Get current editing id from the form.
 */
export const getEditingId = () => elements.form?.dataset.editingId ?? "";

/**
 * Build a contact payload from the form values.
 */
export const getContactFormPayload = () => ({
  name: elements.nameInput?.value ?? "",
  email: elements.emailInput?.value ?? "",
  phones: getPhoneValues(),
  addresses: getAddressValues(),
  groupId: elements.groupSelect?.value ?? "",
  favorite: Boolean(elements.favoriteInput?.checked),
});
