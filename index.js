const isBlank = (v) => v === null || String(v).trim() === "";

const isEmptyArray = (a) => !Array.isArray(a) || a.length === 0;

const validateContact = ({ name, email, phones, addresses }) => {
  const missing = [];
  if (isBlank(name)) missing.push("Nama");
  if (isBlank(email)) missing.push("Email");
  if (isEmptyArray(phones)) missing.push("No Telpon");
  if (isEmptyArray(addresses)) missing.push("Alamat");

  if (missing.length === 0) return null;
  if (missing.length === 4)
    return "Nama, Email, No Telpon dan Alamat Wajib Diisi!";
  return `${missing.join(", ")} Wajib Diisi!`;
};

const formatContact = ({ name, phones, email, addresses }) => {
  return `👤 ${name} | 📞 ${phones.join(", ")} | 📧 ${email} | 📍 ${addresses.join(", ")}`;
};

const addContact = (contacts) => {
  for (const c of contacts ?? []) {
    const error = validateContact(c);

    if (error) {
      console.log(error);
      break;
    }

    console.log(formatContact(c));
  }
};

addContact([
  {
    id: 1,
    name: "Dimas Aditya Mukhsinin",
    email: "dimas@aditya.com",
    phones: ["+628123456789"],
    addresses: ["Street A No. 1, Pekanbaru", "Street B No. 2, Jakarta"],
  },
  {
    id: 2,
    name: "Lazuardy Anugrah",
    email: "lazuardy@anugrah.com",
    phones: ["+628123456789"],
    addresses: ["Street A No. 1, Pekanbaru", "Street B No. 2, Jakarta"],
  },
]);
