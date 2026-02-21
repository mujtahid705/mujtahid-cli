import { getSkills } from "../utils/data.js";
import {
  theme,
  categoryColors,
  sectionHeader,
  newline,
  divider,
} from "../utils/ui.js";

export function register(program, runFn) {
  program
    .command("skills")
    .description("View technical skills")
    .action(async () => {
      await runFn();
    });
}

export async function run() {
  const skills = await getSkills();

  sectionHeader("Skills");

  const categories = [
    { key: "frontend", label: "Frontend", color: categoryColors.frontend },
    { key: "backend", label: "Backend", color: categoryColors.backend },
    { key: "database", label: "Database", color: categoryColors.database },
    { key: "tools", label: "Tools & Libraries", color: categoryColors.tools },
  ];

  for (const cat of categories) {
    const items = skills[cat.key];
    if (!items || items.length === 0) continue;

    console.log(`  ${cat.color.bold(cat.label)}`);

    // Display skills in a grid-like format
    const skillStrings = items.map(
      (s) => `${s.icon || "●"} ${cat.color(s.name)}`,
    );
    const termWidth = Math.min(process.stdout.columns || 80, 80);
    const colWidth = 22;
    const cols = Math.max(1, Math.floor((termWidth - 4) / colWidth));

    for (let i = 0; i < skillStrings.length; i += cols) {
      const row = skillStrings.slice(i, i + cols);
      console.log("  " + row.map((s) => padVisible(s, colWidth)).join(""));
    }

    newline();
  }

  // Additional skills
  if (skills.additional && skills.additional.length > 0) {
    divider();
    newline();
    console.log(`  ${theme.subheading("Also familiar with:")}`);
    console.log(`  ${theme.muted(skills.additional.join("  ·  "))}`);
    newline();
  }
}

// Pad a string accounting for non-visible ANSI characters
function padVisible(str, width) {
  const visible = str.replace(/\x1B\[[0-9;]*m/g, "");
  const pad = Math.max(0, width - visible.length);
  return str + " ".repeat(pad);
}
