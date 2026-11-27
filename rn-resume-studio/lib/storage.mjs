import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const STUDIO_ROOT = path.resolve(__dirname, "..");
export const DATA_DIR = path.join(STUDIO_ROOT, "data");
export const OUTPUT_DIR = path.join(STUDIO_ROOT, "output");
export const PROFILE_PATH = path.join(DATA_DIR, "master-profile.json");
export const APPLICATIONS_PATH = path.join(DATA_DIR, "applications.json");

export async function readMasterProfile() {
  const raw = await fs.readFile(PROFILE_PATH, "utf8");
  return JSON.parse(raw);
}

export async function writeMasterProfile(profile) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PROFILE_PATH, JSON.stringify(profile, null, 2), "utf8");
  return profile;
}

export async function readApplications() {
  try {
    const raw = await fs.readFile(APPLICATIONS_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export async function writeApplications(list) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(APPLICATIONS_PATH, JSON.stringify(list, null, 2), "utf8");
  return list;
}

export async function saveTexOutput(filename, texContent) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const safeBase = path.basename(filename);
  const fullPath = path.join(OUTPUT_DIR, safeBase);
  await fs.writeFile(fullPath, texContent, "utf8");
  return fullPath;
}

export async function saveBinaryOutput(filename, buffer) {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const safeBase = path.basename(filename);
  const fullPath = path.join(OUTPUT_DIR, safeBase);
  await fs.writeFile(fullPath, buffer);
  return fullPath;
}
