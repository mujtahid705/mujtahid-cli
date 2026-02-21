import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, "..", "data", "data.json");

let cachedData = null;

export async function loadData() {
  if (cachedData) return cachedData;

  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    cachedData = JSON.parse(raw);
    return cachedData;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("\n  Could not load portfolio data.");
      console.error("  Make sure data/data.json exists.\n");
    } else {
      console.error("\n  Failed to parse portfolio data.");
      console.error(`  ${err.message}\n`);
    }
    process.exit(1);
  }
}

export async function getData() {
  return cachedData || (await loadData());
}

export async function getPersonal() {
  const data = await getData();
  return data.personal || {};
}

export async function getSkills() {
  const data = await getData();
  return data.skills || {};
}

export async function getProjects() {
  const data = await getData();
  return data.projects || [];
}

export async function getProjectById(id) {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function getContact() {
  const data = await getData();
  return data.contact || {};
}

export async function getExperience() {
  const data = await getData();
  return data.experience || [];
}

export async function getEducation() {
  const data = await getData();
  return data.education || [];
}

export async function getTimeline() {
  const data = await getData();
  return data.timeline || [];
}

export async function getGithub() {
  const data = await getData();
  return data.github || {};
}

export async function getGame() {
  const data = await getData();
  return data.game || { questions: [] };
}

export async function getEasterEggs() {
  const data = await getData();
  return data.easterEggs || { messages: [], secretCommand: "" };
}
