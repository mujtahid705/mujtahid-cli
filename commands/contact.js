import { getContact } from "../utils/data.js";
import { theme, sectionHeader, newline, divider } from "../utils/ui.js";

export function register(program, runFn) {
  program
    .command("contact")
    .description("Get contact information")
    .action(async () => {
      await runFn();
    });
}

export async function run() {
  const contact = await getContact();

  sectionHeader("Get In Touch");

  const items = [
    { icon: "📧", label: "Email   ", value: contact.email },
    { icon: "📱", label: "Phone   ", value: contact.phone },
    { icon: "📍", label: "Location", value: contact.location },
  ];

  for (const item of items) {
    if (item.value) {
      console.log(
        `  ${item.icon}  ${theme.muted(item.label)}  ${theme.bold(item.value)}`,
      );
    }
  }

  newline();
  divider();
  newline();

  // Social links
  if (contact.social) {
    if (contact.social.github) {
      console.log(
        `  🔗  ${theme.muted("GitHub  ")}  ${theme.link(contact.social.github)}`,
      );
    }
    if (contact.social.linkedin) {
      console.log(
        `  🔗  ${theme.muted("LinkedIn")}  ${theme.link(contact.social.linkedin)}`,
      );
    }
  }

  newline();
  console.log(
    theme.muted(
      "  Feel free to reach out — I'm always open to interesting conversations!",
    ),
  );
  newline();
}
