import { getTimeline } from "../utils/data.js";
import { theme, sectionHeader, newline, sleep } from "../utils/ui.js";

const typeConfig = {
  education: { icon: "🎓", color: theme.subheading },
  career: { icon: "💼", color: theme.highlight },
  milestone: { icon: "⭐", color: theme.accent },
};

export function register(program, runFn) {
  program
    .command("timeline")
    .description("View career timeline")
    .action(async () => {
      await runFn();
    });
}

export async function run() {
  const timeline = await getTimeline();

  sectionHeader("Career Timeline");

  if (timeline.length === 0) {
    console.log(theme.muted("  No timeline data available."));
    newline();
    return;
  }

  // Sort by year ascending
  const sorted = [...timeline].sort((a, b) => Number(a.year) - Number(b.year));

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const config = typeConfig[entry.type] || typeConfig.milestone;
    const isLast = i === sorted.length - 1;

    // Connector line
    const connector = isLast ? "└" : "├";
    const line = isLast ? " " : "│";

    console.log(
      `  ${theme.muted(connector + "──")} ${theme.bold(entry.year)}  ${config.icon}  ${config.color(entry.title)}`,
    );
    console.log(`  ${theme.muted(line)}    ${theme.muted(entry.description)}`);

    if (!isLast) {
      console.log(`  ${theme.muted("│")}`);
    }

    await sleep(150);
  }

  newline();
}
