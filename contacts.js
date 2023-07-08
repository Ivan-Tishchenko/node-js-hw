import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.normalize("./db/contacts.json");

/**
 * Reads and retrieves the contents of the contacts.json file containing contact information.
 *
 * @returns {Promise<string>} A promise that resolves with the string data of all contacts.
 */
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return data.toString();
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

/**
 * Retrieves a contact with the specified contactId from the contacts.json file.
 *
 * @param {number} contactId - The identifier of the contact to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves with the found contact (as an object), or null if the contact is not found.
 */
async function getContactById(contactId) {
  const allContacts = await listContacts();
  const parsedContacts = JSON.parse(allContacts);
  const contact = parsedContacts.find(
    (obj) => obj.id === contactId
  );
  return contact || null;
}

/**
 * Removes a contact with the specified contactId from the contacts.json file.
 *
 * @param {number} contactId - The identifier of the contact to remove.
 * @returns {Promise<Object|null>} A promise that resolves with the removed contact (as an object), or null if the contact is not found.
 */
async function removeContact(contactId) {
  const allContacts = await listContacts();
  const parsedContacts = JSON.parse(allContacts);
  const contactToRemove = await getContactById(contactId);

  if (!contactToRemove) {
    return null;
  }

  const newContactsList = parsedContacts.filter(
    (obj) => obj.id !== contactId
  );

  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContactsList, null, 2)
  );
  return contactToRemove;
}

/**
 * Adds a new contact with the specified name, email, and phone to the contacts.json file.
 *
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {Promise<Object>} A promise that resolves with the newly added contact (as an object).
 */
async function addContact(name, email, phone) {
  const allContacts = await listContacts();
  const parsedContacts = JSON.parse(allContacts);

  const obj = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  const newContactsList = [...parsedContacts, obj];
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContactsList, null, 2)
  );
  return obj;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
