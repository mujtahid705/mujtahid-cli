import { getPersonal } from "../utils/data.js";
import {
  theme,
  sectionHeader,
  keyValue,
  divider,
  newline,
  wrapText,
} from "../utils/ui.js";

export function register(program, runFn) {
  program
    .command("about")
    .description("Learn about Mujtahid")
    .action(async () => {
      await runFn();
    });
}

export async function run() {
  const personal = await getPersonal();
  const about = personal.about || {};

  sectionHeader("About Me");

  // Name and role
  console.log(`  ${theme.bold(personal.name || "Muhammad Mujtahid")}`);
  console.log(`  ${theme.accent(personal.role || "Software Engineer")}`);
  newline();

  // Quick facts
  if (about.quickFacts && about.quickFacts.length > 0) {
    const factsLine = about.quickFacts
      .map((f) => `${theme.highlight(f.value)} ${theme.muted(f.label)}`)
      .join(`  ${theme.muted("·")}  `);
    console.log(`  ${factsLine}`);
    newline();
    divider();
    newline();
  }

  // Intro
  if (about.intro) {
    console.log(wrapText(about.intro));
    newline();
  }

  // Details
  if (about.details) {
    console.log(wrapText(about.details));
    newline();
  }

  // Philosophy
  if (about.philosophy) {
    divider();
    newline();
    console.log(theme.muted(wrapText(`"${about.philosophy}"`)));
    newline();
  }
}
