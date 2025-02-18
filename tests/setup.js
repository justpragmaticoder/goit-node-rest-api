import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, '../db/contacts.json');

// Ensure the file exists for testing
if (!fs.existsSync(contactsPath)) {
    fs.writeFileSync(contactsPath, '[]');
}
