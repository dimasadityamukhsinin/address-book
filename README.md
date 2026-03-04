# Address Book / Contacts (LocalStorage)

A simple **web-based Address Book / Contacts** app (no backend) that stores and manages contacts directly in the browser using **LocalStorage**. Styling uses **Tailwind CSS**.

# Website

- https://address-book.dimasadityamukhsinin.com/

## Features

- ✅ **Add / Edit / Delete contacts**
- ✅ **Search** contacts (by name/phone/email/address/group)
- ✅ **Favorites** (mark/unmark contacts as favorite)
- ✅ **Groups** (create groups and assign contacts to groups)
- ✅ **Multiple addresses** (one contact can have more than one address)
- ✅ **Multiple phone number** (one contact can have more than one phone number)
- ✅ **Persistent storage via LocalStorage** (data remains after refresh)

## Project Structure

```
/address-book
├─ assets
├─ index.html
├─ index.css
└─ scripts
   ├─ main.js
   ├─ contacts.js
   ├─ groups.js
   ├─ search.js
   ├─ storage.js
   ├─ utils.js
   └─ ui
      ├─ address-inputs.js
      ├─ elements.js
      ├─ form.js
      └─ phone-inputs.js
```

## Getting Started

### Option 1 — Open directly

1. Download / clone the project
2. Open `index.html` in your browser (Chrome/Firefox/Edge)

### Option 2 — Use a local server (recommended)

If you use VS Code:

- Install **Live Server** extension
- Right-click `index.html` → **Open with Live Server**

## How to Use

### Add a Contact

- Fill the form
- Add at least 1 address
- Add at least 1 phone number
- Add email
- Set favorite and assign group (optional)
- Click Save

### Search

- Type a keyword into the search input
- The list filters by name, phone, email, address, group.

### Favorites

- Click the favorite button/icon on a contact (toggle ON/OFF)
- Favorite contacts appear in a Favorites section/tab

### Groups

- Create a new group
- Assign a contact to a group
- Delete groups (contacts will be unassigned if the group is deleted)

### Multiple Addresses

- In the contact form, you can add more than one address
- Edit a contact to add/remove existing addresses

### Multiple Phone Number

- In the contact form, you can add more than one phone number
- Edit a contact to add/remove existing phone number

### Data Storage (LocalStorage)

- The app stores data as JSON strings in LocalStorage.

### Storage Keys

- contacts
- groups

### Example Data Models

#### Contact

```json
{
  "id": 1,
  "name": "Dimas Aditya Mukhsinin",
  "phones": ["+628123456789"],
  "emails": ["dimas@aditya.com"],
  "addresses": ["Street A No. 1, Pekanbaru", "Street B No. 2, Jakarta"],
  "groupId": 1,
  "favorite": true
}
```

### Group

```json
{
  "id": 1,
  "name": "Work"
}
```

### Validation Rules

- name, email, is required
- addresses must contain at least 1 non-empty entry
- phone number must contain at least 1 non-empty entry
- group names must be unique

### Flowchart

<img src="assets/flowchart.png" alt="Flowchart" width="700" />
