import fs from "fs";
import path from "path";

const STORAGE_FILE = path.resolve(process.cwd(), "lazai-identity.json");

export function saveIdentity(identity) {
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(identity, null, 2), { encoding: "utf8" });
}

export function loadIdentity() {
  try {
    if (!fs.existsSync(STORAGE_FILE)) return null;
    const raw = fs.readFileSync(STORAGE_FILE, { encoding: "utf8" });
    return JSON.parse(raw);
  } catch (e) {
    console.warn("storage.loadIdentity error:", e.message);
    return null;
  }
}

export function clearIdentity() {
  try {
    if (fs.existsSync(STORAGE_FILE)) fs.unlinkSync(STORAGE_FILE);
  } catch (e) {
    console.warn("storage.clearIdentity error:", e.message);
  }
}
