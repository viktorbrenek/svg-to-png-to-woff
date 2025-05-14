import fs from "fs";
import { paths } from "./config.js";

const codepoints = JSON.parse(fs.readFileSync(paths.codepoints, "utf-8"));

function formatEnumEntry(name) {
  const parts = name.split("-");
  const key = parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return `    ${key} = "${name}",`;
}

// Rozdělit na "regular" a "filled"
const normal = [];
const filled = [];

for (const name of Object.keys(codepoints).sort()) {
  if (name.endsWith("-filled")) {
    filled.push(formatEnumEntry(name));
  } else {
    normal.push(formatEnumEntry(name));
  }
}

// Přidat komentář před začátek filled ikon
const comment = [
  "    // Bold version STARTS HERE",
  "    // Ends with *-filled"
];
const final = [...normal, ...comment, ...filled];

const content = `export enum IconCode {\n${final.join("\n")}\n}\n`;

fs.writeFileSync("./dist/iconCode.ts", content, "utf-8");
console.log(`✅ iconCode.ts generated with ${Object.keys(codepoints).length} icons (non-filled first).`);
