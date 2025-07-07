import fs from "fs";
import { paths } from "./config.js";
const codepoints = JSON.parse(fs.readFileSync(paths.codepoints, "utf-8"));

function formatEnumEntry(name) {
  const parts = name.split("-");
  const key = parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return `    ${key} = "${name}",`;
}

// Rozdělení
const allNames = Object.keys(codepoints);
const nonFilled = allNames.filter(n => !n.endsWith("-filled")).sort((a, b) => a.localeCompare(b));
const filledSet = new Set(allNames.filter(n => n.endsWith("-filled")));

const final = [];

for (const name of nonFilled) {
  final.push(formatEnumEntry(name));

  const filledName = name + "-filled";
  if (filledSet.has(filledName)) {
    final.push(formatEnumEntry(filledName));
    filledSet.delete(filledName); // prevent duplicates
  }
}

// Přidat zbylé filled (pro které nenašel pair)
for (const name of filledSet) {
  final.push(formatEnumEntry(name));
}

const content = `export enum IconCode {\n${final.join("\n")}\n}\n`;
fs.writeFileSync("./dist/iconCode.ts", content, "utf-8");
