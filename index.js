function add(contacts) {
  // Address Book Table
  const tableAddressBook = document.querySelector("#table-address-book > tbody");

  if (contacts.length > 0) {
    contacts.forEach(({ name, email }) => {
        if(!name && !email) {
            console.log("Nama dan Email wajib diisi!");
            return;
        }
        if(!name) {
            console.log("Nama wajib diisi!");
            return;
        }
        if(!email) {
            console.log("Email wajib diisi!");
            return;
        }
        const tr = document.createElement("tr");
        const tdName = document.createElement("td");
        tr.appendChild(tdName);
        tdName.append(name);
        const tdEmail = document.createElement("td");
        tr.appendChild(tdEmail);
        tdEmail.append(email);
        tableAddressBook.appendChild(tr)
    });
  }
}

add([
    {
        id: 1,
        name: "Dimas Aditya Mukhsinin",
        email: "dimas@aditya.com"
    },
    {
        id: 2,
        name: "Lazuardy Anugrah",
        email: "lazuardy@anugrah.com"
    }
])