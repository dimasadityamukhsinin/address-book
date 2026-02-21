import { addGroup, deleteGroup, editGroup } from "./groups.js";
import {
  addContact,
  deleteContact,
  editContact,
  printContacts,
  setContactGroup,
  setFavorite,
} from "./contacts.js";
import { searchContacts } from "./search.js";
import { loadContacts } from "./storage.js";

const workGroup = addGroup({ name: "Work" });
const friendsGroup = addGroup({ name: "Friends" });

addContact({
  name: "Ben Nata",
  email: "ben@nata.com",
  phones: ["+628111222333"],
  addresses: ["Jl. Mawar No. 3, Bandung"],
  groupId: workGroup?.id,
});

addContact({
  name: "Sari Putri",
  email: "sari@putri.com",
  phones: ["+628111222444"],
  addresses: ["Jl. Melati No. 5, Surabaya"],
  groupId: workGroup?.id,
});

addContact({
  name: "Budi Santoso",
  email: "budi@santoso.com",
  phones: ["+628111222555"],
  addresses: ["Jl. Kenanga No. 7, Jakarta"],
  groupId: friendsGroup?.id,
  favorite: true,
});

editContact(1, {
  phones: ["+628999888777", "+628123456789"],
  addresses: ["Street A No. 1, Pekanbaru"],
});

if (friendsGroup?.id) setContactGroup(1, friendsGroup.id);

setFavorite(1, true);
setFavorite(2, false);

// deleteContact(1);
// editGroup(workGroup?.id, { name: "Office" });
// deleteGroup(friendsGroup?.id);

printContacts(loadContacts());
console.log("Search Result:", searchContacts("ben"));

const fetchData = async () => {
  const url = "https://6995d3a3b081bc23e9c492b5.mockapi.io/api/contacts";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.status);
    }

    const result = await response.json();
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

fetchData();

// TODO:
// - ✅ Add / Edit / Delete contacts
// - ✅ Search contacts (by name/phone/email/address/group)
// - ✅ Favorites (mark/unmark contacts as favorite)
// - ✅ Groups (create groups and assign contacts to groups)
// - Validasi email dan no telpon
// - ✅ Multiple addresses (one contact can have more than one address)
// - ✅ Persistent storage via LocalStorage (data remains after refresh)
