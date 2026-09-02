import { Database } from "bun:sqlite";
import fs from "fs";
import path from "path";

const DB_DIR = path.resolve(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, "ruang_naskah.sqlite");
export const db = new Database(DB_PATH, { create: true });

// Enable WAL mode for high concurrency and performance
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize Schema
export function initSchema() {
  const schemaPath = path.resolve(process.cwd(), "server/db/schema.sql");
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    db.exec(schemaSql);
  }
}

initSchema();

export default db;

