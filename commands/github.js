import { getGithub } from "../utils/data.js";
import {
  theme,
  sectionHeader,
  keyValue,
  newline,
  divider,
} from "../utils/ui.js";

export function register(program, runFn) {
  program
    .command("github")
    .description("View GitHub stats")
    .action(async () => {
      await runFn();
    });
}

export async function run() {
  const github = await getGithub();

  sectionHeader("GitHub Stats");

  if (!github.username) {
    console.log(theme.muted("  No GitHub data available."));
    newline();
    return;
  }

  // Username
  console.log(`  ${theme.link(`github.com/${github.username}`)}`);
  newline();

  // Stats grid
  const stats = [
    { label: "Repositories", value: String(github.repos || 0), icon: "📦" },
    { label: "Stars Earned", value: String(github.stars || 0), icon: "⭐" },
    {
      label: "Contributions",
      value: String(github.contributions || 0),
      icon: "🔥",
    },
    {
      label: "Current Streak",
      value: `${github.streak || 0} days`,
      icon: "📈",
    },
  ];

  for (const stat of stats) {
    console.log(
      `  ${stat.icon}  ${theme.muted(stat.label.padEnd(15))} ${theme.highlight(stat.value)}`,
    );
  }

  newline();

  // Top languages bar chart
  if (github.topLanguages && github.topLanguages.length > 0) {
    divider();
    newline();
    console.log(`  ${theme.subheading("Top Languages")}`);
    newline();

    const barWidth = 30;

    for (const lang of github.topLanguages) {
      const filled = Math.round((lang.percentage / 100) * barWidth);
      const empty = barWidth - filled;
      const bar =
        theme.highlight("█".repeat(filled)) + theme.muted("░".repeat(empty));
      const pct = theme.muted(`${lang.percentage}%`);

      console.log(`  ${lang.name.padEnd(14)} ${bar} ${pct}`);
    }

    newline();
  }

  divider();
  newline();
  console.log(
    theme.muted(
      "  Stats are illustrative — connect on GitHub for live activity.",
    ),
  );
  newline();
}
