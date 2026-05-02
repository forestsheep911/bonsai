import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const configPath = resolve("image-prompts/screen-prompts.config.json");
const outputPath = resolve("image-prompts/generated/bonsai-screen-prompts.md");

const config = JSON.parse(readFileSync(configPath, "utf8"));

function line(label, value) {
  if (!value) return "";
  return `${label}: ${value}`;
}

function list(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function renderPrompt(screen) {
  const text = screen.visibleText.map((item) => `"${item}"`).join(", ");
  const avoid = [...config.visualSystem.avoid].join("; ");

  return [
    line("Use case", "ui-mockup"),
    line("Asset type", `${screen.viewport}; imagined website screenshot for ${config.project.name}`),
    line("Primary request", screen.primaryRequest),
    line("Scene/backdrop", `A clean web app interface for ${config.project.positioning}.`),
    line("Subject", screen.title),
    line("Style/medium", config.visualSystem.style),
    line("Composition/framing", screen.composition),
    line("Lighting/mood", `${config.visualSystem.density}; calm daylight UI, precise spacing, production-ready polish`),
    line("Color palette", config.visualSystem.palette),
    line("Typography", config.visualSystem.typography),
    line("Materials/textures", config.visualSystem.texture),
    line("Text (verbatim)", `Use only short readable UI labels. Include these labels where appropriate: ${text}.`),
    line(
      "Constraints",
      `${config.visualSystem.shape}; ${screen.details}; keep all text inside its containers; make it look like a real shipped web app screenshot; ${config.project.language}.`
    ),
    line("Avoid", avoid)
  ]
    .filter(Boolean)
    .join("\n");
}

const sections = config.screens.map((screen) => {
  return [
    `## ${screen.id} · ${screen.title}`,
    "",
    "```text",
    renderPrompt(screen),
    "```"
  ].join("\n");
});

const doc = [
  "# Bonsai Screen Image Prompts",
  "",
  "Generated from `image-prompts/screen-prompts.config.json`.",
  "Edit the config, then run:",
  "",
  "```bash",
  "node image-prompts/render-screen-prompts.mjs",
  "```",
  "",
  "## Shared Visual System",
  "",
  `- Project: ${config.project.name}`,
  `- Positioning: ${config.project.positioning}`,
  `- Tagline: ${config.project.tagline}`,
  `- Palette: ${config.visualSystem.palette}`,
  `- Avoid:\n${list(config.visualSystem.avoid)}`,
  "",
  ...sections,
  ""
].join("\n");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, doc);

console.log(`Wrote ${outputPath}`);
