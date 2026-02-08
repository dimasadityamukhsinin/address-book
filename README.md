# Address Book / Contacts (LocalStorage)

A simple **web-based Address Book / Contacts** app (no backend) that stores and manages contacts directly in the browser using **LocalStorage**.

## Features

- ✅ **Add / Edit / Delete contacts**
- ✅ **Search** contacts (by name/phone/email/address/group)
- ✅ **Favorites** (mark/unmark contacts as favorite)
- ✅ **Groups** (create groups and assign contacts to groups)
- ✅ **Multiple addresses** (one contact can have more than one address)
- ✅ **Persistent storage via LocalStorage** (data remains after refresh)

---

## Project Structure

/project-root
├─ index.html
├─ index.css
└─ index.js

---

## Getting Started

### Option 1 — Open directly
1. Download / clone the project
2. Open `index.html` in your browser (Chrome/Firefox/Edge)

### Option 2 — Use a local server (recommended)
If you use VS Code:
- Install **Live Server** extension
- Right-click `index.html` → **Open with Live Server**

Or using Node:
```bash
npx serve .
```

## How to Use

### Add a Contact
- Fill the form (name + at least 1 address)
- Add phone/email (optional)
- Click Save

### Search
- Type a keyword into the search input
- The list filters by name, phone, email, address, group.

### Favorites
- Click the favorite button/icon on a contact (toggle ON/OFF)
- Favorite contacts appear in a Favorites section/tab (if implemented)

### Groups
- Create a new group (group name must be unique)
- Assign a contact to a group
- Rename/Delete groups (contacts will be unassigned if the group is deleted)

### Multiple Addresses
- In the contact form, you can add more than one address
- Edit a contact to add/remove existing addresses

### Data Storage (LocalStorage)
- The app stores data as JSON strings in LocalStorage.

### Storage Keys
- contacts
- groups

### Example Data Models
#### Contact

```json
{
  "id": "c_1700000000000",
  "name": "John Doe",
  "phones": ["+628123456789"],
  "emails": ["john@example.com"],
  "addresses": [
    "Street A No. 1, Jakarta",
    "Street B No. 2, Depok"
  ],
  "groupId": "g_1699999999999",
  "favorite": true,
  "notes": "Work friend"
}
```

### Group

```json
{
  "id": "g_1699999999999",
  "name": "Work"
}
```

### Validation Rules
- name, phone is required
- email are optional (validate format if provided)
- addresses must contain at least 1 non-empty entry
- group names must be unique

### Flowchart
```mermaid
flowchart TD
    A([Start]) --> B[App Load]
    B --> C{LocalStorage ada data?}
    C -- Ya --> D[Load contacts + groups dari LocalStorage]
    C -- Tidak --> E[Inisialisasi data kosong: contacts kosong, groups kosong]
    D --> F[Render UI (List, Search, Groups, Favorites)]
    E --> F

    %% Main Loop
    F --> G{User Action?}

    %% Search
    G -->|Search| S1[Input keyword]
    S1 --> S2[Filter contacts by name/phone/email/address/group]
    S2 --> S3[Render hasil pencarian]
    S3 --> F

    %% Add Contact
    G -->|Add Contact| AC1[Form Contact]
    AC1 --> AC2[Input: Name, Phones, Emails, Addresses (>=1), Notes, Group (optional)]
    AC2 --> AC3{Validasi}
    AC3 -- Gagal --> AC4[Tampilkan error + kembali ke form]
    AC3 -- OK --> AC5[Generate ID + Simpan ke contacts]
    AC5 --> LS1[Update LocalStorage]
    LS1 --> AC6[Render list contact]
    AC6 --> F

    %% Edit Contact
    G -->|Edit Contact| EC1[Pilih contact]
    EC1 --> EC2[Ubah field termasuk multi-address]
    EC2 --> EC3{Validasi}
    EC3 -- Gagal --> EC4[Tampilkan error]
    EC3 -- OK --> EC5[Update contacts]
    EC5 --> LS2[Update LocalStorage]
    LS2 --> EC6[Render contact detail/list]
    EC6 --> F

    %% Delete Contact
    G -->|Delete Contact| DC1[Pilih contact]
    DC1 --> DC2{Konfirmasi hapus?}
    DC2 -- Tidak --> F
    DC2 -- Ya --> DC3[Hapus dari contacts]
    DC3 --> LS3[Update LocalStorage]
    LS3 --> F

    %% Favorite Toggle
    G -->|Toggle Favorite| FV1[Pilih contact]
    FV1 --> FV2[Set favorite=true/false]
    FV2 --> LS4[Update LocalStorage]
    LS4 --> FV3[Render Favorites + List]
    FV3 --> F

    %% Group Management
    G -->|Manage Groups| GR1{Action group?}
    GR1 -->|Add Group| GR2[Input nama group]
    GR2 --> GR3{Nama unik?}
    GR3 -- Tidak --> GR4[Error: group sudah ada]
    GR3 -- Ya --> GR5[Tambah ke groups]
    GR5 --> LS5[Update LocalStorage]
    LS5 --> F

    GR1 -->|Assign Contact to Group| GR6[Pilih contact + pilih group]
    GR6 --> GR7[Set contact.groupId / groupName]
    GR7 --> LS6[Update LocalStorage]
    LS6 --> F

    GR1 -->|Rename/Delete Group| GR8[Pilih group]
    GR8 --> GR9{Rename atau Delete?}
    GR9 -->|Rename| GR10[Update nama group]
    GR10 --> LS7[Update LocalStorage]
    GR9 -->|Delete| GR11[Hapus group + unassign dari contacts]
    GR11 --> LS8[Update LocalStorage]
    LS7 --> F
    LS8 --> F

    %% Detail View
    G -->|View Detail| VD1[Pilih contact]
    VD1 --> VD2[Tampilkan detail: multi-address, phone, email, group, favorite]
    VD2 --> F

    %% Exit
    G -->|Close App| Z([End])
```
