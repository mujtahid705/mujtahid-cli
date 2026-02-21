import ora from "ora";

export async function withSpinner(text, asyncFn) {
  const spinner = ora({ text, color: "cyan" }).start();
  try {
    const result = await asyncFn();
    spinner.stop();
    // Clear the spinner line for clean output
    process.stdout.write("\r\x1b[K");
    return result;
  } catch (err) {
    spinner.fail(text + " — failed");
    throw err;
  }
}
