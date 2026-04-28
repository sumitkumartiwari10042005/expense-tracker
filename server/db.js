import sqlite3 from "sqlite3";
import { readFileSync } from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, 'expenses.db'));

const schema = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

db.exec(schema);

export default db;
