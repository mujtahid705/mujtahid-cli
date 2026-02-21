import { getProjects, getProjectById } from "../utils/data.js";
import {
  theme,
  sectionHeader,
  keyValue,
  bulletList,
  divider,
  newline,
  wrapText,
} from "../utils/ui.js";

export function register(program, runFn) {
  program
    .command("projects [id]")
    .description("View projects (optionally pass a project ID for details)")
    .action(async (id) => {
      await runFn(id);
    });
}

export async function run(id) {
  if (id) {
    await showDetail(id);
  } else {
    await showList();
  }
}

async function showList() {
  const projects = await getProjects();

  sectionHeader("Projects");

  for (const project of projects) {
    const desc =
      project.description.length > 80
        ? project.description.slice(0, 77) + "..."
        : project.description;

    console.log(
      `  ${theme.highlight(project.id.padEnd(20))} ${theme.bold(project.title)}`,
    );
    console.log(`  ${" ".repeat(20)} ${theme.muted(desc)}`);
    newline();
  }

  divider();
  newline();
  console.log(
    theme.muted(
      `  Tip: Run ${theme.highlight("mujtahid projects <id>")} for a detailed view`,
    ),
  );
  newline();
}

async function showDetail(id) {
  const project = await getProjectById(id);

  if (!project) {
    const projects = await getProjects();
    const validIds = projects.map((p) => p.id);

    console.log();
    console.log(theme.error(`  Project "${id}" not found.`));
    newline();
    console.log(theme.muted("  Available projects:"));
    for (const vid of validIds) {
      console.log(`    ${theme.highlight(vid)}`);
    }
    newline();
    return;
  }

  sectionHeader(project.title);

  // Problem
  if (project.problem) {
    console.log(`  ${theme.subheading("Problem")}`);
    console.log(wrapText(project.problem, 4));
    newline();
  }

  // Solution
  if (project.solution) {
    console.log(`  ${theme.subheading("Solution")}`);
    console.log(wrapText(project.solution, 4));
    newline();
  }

  // Tech stack
  if (project.technologies && project.technologies.length > 0) {
    console.log(`  ${theme.subheading("Tech Stack")}`);
    const badges = project.technologies
      .map((t) => theme.accent(`[ ${t} ]`))
      .join(" ");
    console.log(`    ${badges}`);
    newline();
  }

  // Challenges
  if (project.challenges && project.challenges.length > 0) {
    console.log(`  ${theme.subheading("Challenges")}`);
    bulletList(project.challenges);
    newline();
  }

  // Links
  divider();
  newline();
  if (project.links) {
    if (project.links.github && project.links.github !== "#") {
      keyValue("GitHub", theme.link(project.links.github));
    }
    if (project.links.demo && project.links.demo !== "#") {
      keyValue("Demo  ", theme.link(project.links.demo));
    }
  }
  newline();
}
