#!/usr/bin/env node

import { Command } from "commander";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

import { loadData, getPersonal, getEasterEggs } from "../utils/data.js";
import { theme, banner, centerLine, newline, divider } from "../utils/ui.js";
import { withSpinner } from "../utils/spinner.js";

import * as about from "../commands/about.js";
import * as skills from "../commands/skills.js";
import * as projects from "../commands/projects.js";
import * as timeline from "../commands/timeline.js";
import * as contact from "../commands/contact.js";
import * as game from "../commands/game.js";

// Startup sequence: spinner -> banner -> tagline
async function startup() {
  const data = await withSpinner("Loading portfolio...", loadData);
  const personal = await getPersonal();

  newline();
  const art = await banner();
  console.log(theme.heading(art));
  newline();
  console.log(
    centerLine(theme.muted(personal.tagline || personal.description || "")),
  );
  console.log(centerLine(theme.accent(personal.role || "Software Engineer")));
  newline();
  divider();
  newline();
}

// Interactive menu loop (non-circular list navigation)
async function interactiveMenu() {
  let running = true;

  while (running) {
    try {
      const choice = await select({
        message: theme.bold("What would you like to explore?"),
        choices: [
          { name: "👤  About Me", value: "about" },
          { name: "⚡  Skills", value: "skills" },
          { name: "🚀  Projects", value: "projects" },
          { name: "📅  Career Timeline", value: "timeline" },
          { name: "📧  Contact", value: "contact" },
          { name: "🎮  Tech Trivia", value: "game" },
          { name: "👋  Exit", value: "exit" },
        ],
        loop: false, // Prevent circular navigation with arrow keys
      });

      // Add extra spacing before content
      newline();
      divider();
      newline();

      switch (choice) {
        case "about":
          await about.run();
          break;
        case "skills":
          await skills.run();
          break;
        case "projects":
          await projectsSubmenu();
          break;
        case "timeline":
          await timeline.run();
          break;
        case "contact":
          await contact.run();
          break;
        case "game":
          await game.run();
          break;
        case "exit":
          running = false;
          break;
      }

      // Add extra spacing after content (only if not exiting)
      if (running) {
        newline();
        divider();
        newline();
      }
    } catch {
      // User pressed Ctrl+C
      running = false;
    }
  }

  newline();
  console.log(theme.muted("  Thanks for visiting! Have a great day."));
  newline();
}

// Projects submenu — list then optionally deep dive
async function projectsSubmenu() {
  await projects.run();

  try {
    const { getProjects } = await import("../utils/data.js");
    const allProjects = await getProjects();
    const choices = allProjects.map((p) => ({
      name: `${theme.highlight(p.id)}  ${p.title}`,
      value: p.id,
    }));
    choices.push({ name: theme.muted("← Back to menu"), value: "__back" });

    const chosen = await select({
      message: theme.bold("View project details:"),
      choices,
    });

    if (chosen !== "__back") {
      await projects.run(chosen);
    }
  } catch {
    // User pressed Ctrl+C — return to menu
  }
}

// Build commander program
function createProgram() {
  const program = new Command();

  program
    .name("mujtahid")
    .description("Interactive CLI portfolio for Muhammad Mujtahid")
    .version("1.0.0");

  // Register all commands with their direct-mode handlers
  about.register(program, () => about.run());
  skills.register(program, () => skills.run());
  projects.register(program, (id) => projects.run(id));
  timeline.register(program, () => timeline.run());
  contact.register(program, () => contact.run());
  game.register(program, () => game.run());

  // Hidden easter egg command
  program.command("secret", { hidden: true }).action(async () => {
    const eggs = await getEasterEggs();
    const messages = eggs.messages || [];
    if (messages.length > 0) {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      newline();
      console.log(`  🥚 ${theme.accent(msg)}`);
      newline();
    }
  });

  return program;
}

// Main entry point
async function main() {
  // Handle Ctrl+C gracefully
  process.on("SIGINT", () => {
    newline();
    console.log(theme.muted("  Goodbye!"));
    newline();
    process.exit(0);
  });

  const hasCommand = process.argv.length > 2;

  await startup();

  if (hasCommand) {
    const program = createProgram();
    await program.parseAsync(process.argv);
  } else {
    await interactiveMenu();
  }
}

main().catch((err) => {
  console.error(theme.error(`\n  Unexpected error: ${err.message}\n`));
  process.exit(1);
});
