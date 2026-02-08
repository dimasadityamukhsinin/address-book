## Pseudocode

```text
FUNCTION add(contacts)
  SET tableAddressBook = query "#table-address-book > tbody"

  IF contacts length > 0 THEN
    FOR EACH contact IN contacts DO
      IF contact.name is empty AND contact.email is empty THEN
        PRINT "Nama dan Email wajib diisi!"
        CONTINUE
      ENDIF

      IF contact.name is empty THEN
        PRINT "Nama wajib diisi!"
        CONTINUE
      ENDIF

      IF contact.email is empty THEN
        PRINT "Email wajib diisi!"
        CONTINUE
      ENDIF

      CREATE tr
      CREATE tdName
      APPEND tdName TO tr
      APPEND contact.name TO tdName

      CREATE tdEmail
      APPEND tdEmail TO tr
      APPEND contact.email TO tdEmail

      APPEND tr TO tableAddressBook
    END FOR
  ENDIF
END FUNCTION
```
