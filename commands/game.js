import { input, select } from "@inquirer/prompts";
import { getGame } from "../utils/data.js";
import { theme, sectionHeader, newline, divider } from "../utils/ui.js";

export function register(program, runFn) {
  program
    .command("game")
    .description("Play a tech trivia mini-game")
    .action(async () => {
      await runFn();
    });
}

export async function run() {
  const game = await getGame();
  const questions = game.questions || [];

  sectionHeader(game.title || "Tech Trivia");

  if (questions.length === 0) {
    console.log(theme.muted("  No trivia questions available."));
    newline();
    return;
  }

  console.log(theme.muted(`  ${game.description || "Test your knowledge!"}`));
  console.log(
    theme.muted(`  ${questions.length} questions — let's see what you've got.`),
  );
  newline();

  // Shuffle and pick up to 5 questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 5);

  let score = 0;

  for (let i = 0; i < picked.length; i++) {
    const q = picked[i];

    console.log(`  ${theme.bold(`Question ${i + 1}/${picked.length}`)}`);
    console.log(`  ${theme.subheading(q.question)}`);
    newline();

    const choices = q.options.map((opt, idx) => ({
      name: opt,
      value: idx,
    }));

    try {
      const answer = await select({
        message: "Your answer:",
        choices,
      });

      if (answer === q.answer) {
        score++;
        console.log(theme.success(`  ✓ Correct!`));
      } else {
        console.log(
          theme.error(`  ✗ Wrong — the answer is: ${q.options[q.answer]}`),
        );
      }

      if (q.explanation) {
        console.log(theme.muted(`  ${q.explanation}`));
      }
    } catch {
      // User pressed Ctrl+C during prompt
      console.log(theme.muted("\n  Game ended early."));
      return;
    }

    newline();
  }

  // Score summary
  divider();
  newline();

  const pct = Math.round((score / picked.length) * 100);
  let message;

  if (pct === 100) {
    message = "Perfect score! You really know your stuff.";
  } else if (pct >= 80) {
    message = "Impressive! You have strong fundamentals.";
  } else if (pct >= 60) {
    message = "Not bad! Keep learning and you will get there.";
  } else if (pct >= 40) {
    message = "Room to grow — keep coding and reading!";
  } else {
    message = "Tough round! Every question is a learning opportunity.";
  }

  console.log(
    `  ${theme.bold("Score:")} ${theme.highlight(`${score}/${picked.length}`)} (${pct}%)`,
  );
  console.log(`  ${theme.muted(message)}`);
  newline();
}
