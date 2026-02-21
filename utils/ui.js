import chalk from "chalk";
import figlet from "figlet";

// Consistent color theme
export const theme = {
  heading: chalk.bold.cyan,
  subheading: chalk.bold.yellow,
  highlight: chalk.green,
  muted: chalk.gray,
  accent: chalk.magenta,
  error: chalk.red,
  bold: chalk.bold,
  link: chalk.underline.cyan,
  success: chalk.green,
  warn: chalk.yellow,
};

// Category-specific colors for skills
export const categoryColors = {
  frontend: chalk.cyan,
  backend: chalk.green,
  database: chalk.yellow,
  tools: chalk.magenta,
};

// Generate centered figlet banner
export async function banner() {
  return new Promise((resolve, reject) => {
    figlet(
      "MUJTAHID",
      { font: "ANSI Shadow", horizontalLayout: "default" },
      (err, result) => {
        if (err) {
          // Fallback if font not available
          figlet("MUJTAHID", (err2, result2) => {
            if (err2) return reject(err2);
            resolve(centerText(result2));
          });
          return;
        }
        resolve(centerText(result));
      },
    );
  });
}

// Center a multi-line string in the terminal
function centerText(text) {
  const termWidth = process.stdout.columns || 80;
  return text
    .split("\n")
    .map((line) => {
      const padding = Math.max(0, Math.floor((termWidth - line.length) / 2));
      return " ".repeat(padding) + line;
    })
    .join("\n");
}

// Center a single line
export function centerLine(text) {
  const termWidth = process.stdout.columns || 80;
  const cleanLength = chalk.level > 0 ? stripAnsi(text).length : text.length;
  const padding = Math.max(0, Math.floor((termWidth - cleanLength) / 2));
  return " ".repeat(padding) + text;
}

// Rough ANSI strip for centering calculations
function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*m/g, "");
}

// Print a section header
export function sectionHeader(title) {
  console.log();
  console.log(theme.heading(`  ━━━ ${title.toUpperCase()} ━━━`));
  console.log();
}

// Print a key-value pair
export function keyValue(key, value) {
  console.log(`  ${theme.muted(key + ":")}  ${theme.bold(value)}`);
}

// Print a bullet list
export function bulletList(items, color = theme.muted) {
  for (const item of items) {
    console.log(`  ${theme.highlight("●")} ${color(item)}`);
  }
}

// Print a thin divider
export function divider() {
  const width = Math.min(process.stdout.columns || 60, 60);
  console.log(theme.muted("  " + "─".repeat(width - 4)));
}

// Print a newline
export function newline() {
  console.log();
}

// Sleep utility for animations
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Wrap text to fit terminal width
export function wrapText(text, indent = 2, maxWidth) {
  const width = maxWidth || Math.min(process.stdout.columns || 80, 80) - indent;
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length > width) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());

  const pad = " ".repeat(indent);
  return lines.map((l) => pad + l).join("\n");
}
