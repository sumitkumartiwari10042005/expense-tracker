import sqlite3 from "sqlite3";
import fs from "fs";

const db = new sqlite3.Database("./expenses.db");

// run schema once
const schema = fs.readFileSync("./schema.sql", "utf-8");
db.exec(schema);

export default db;
