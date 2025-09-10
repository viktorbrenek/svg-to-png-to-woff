import fs from "fs";
import { paths } from "./config.js";

// 1. Načtení všech potřebných souborů
const codepoints = JSON.parse(fs.readFileSync(paths.codepoints, "utf-8"));
const staticAliases = JSON.parse(fs.readFileSync(paths.staticIconAliasesPath, "utf-8"));

/**
 * Převede název ikony s pomlčkami na camelCase.
 * Příklad: "building-bed" -> "buildingBed"
 */
function formatEnumKey(name) {
  const parts = name.split("-");
  return parts[0] + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

// 2. Zpracování statických aliasů
const staticEntries = Object.entries(staticAliases).map(([key, value]) => {
  // Klíče v iconAliases.json jsou již ve formátu camelCase
  return `    ${key} = "${value}",`;
});

// 3. Zpracování dynamicky generovaných ikon (původní logika)
const allNames = Object.keys(codepoints);
const nonFilled = allNames.filter(n => !n.endsWith("-filled")).sort((a, b) => a.localeCompare(b));
const filledSet = new Set(allNames.filter(n => n.endsWith("-filled")));
const dynamicEntries = [];

for (const name of nonFilled) {
  dynamicEntries.push(`    ${formatEnumKey(name)} = "${name}",`);

  const filledName = name + "-filled";
  if (filledSet.has(filledName)) {
    dynamicEntries.push(`    ${formatEnumKey(filledName)} = "${filledName}",`);
    filledSet.delete(filledName);
  }
}

// Přidání "osiřelých" filled ikon na konec
for (const name of filledSet) {
  dynamicEntries.push(`    ${formatEnumKey(name)} = "${name}",`);
}

// 4. Sestavení finálního obsahu souboru
const fileHeader = `/// <amd-module name="@teaf/ui/components/Icon/iconCode" />

/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

/**
 * Icon codes derived directly from LESS variables.
 * Changes must be reflected in the @icon-codes variable.
 * @includeToDoc
 */`;

const finalEnumMembers = [
  ...staticEntries,
  "", // Vložení prázdného řádku dle požadavku
  ...dynamicEntries
];

const finalContent = `${fileHeader}\nexport enum IconCode {\n${finalEnumMembers.join("\n")}\n}\n`;

// 5. Zápis do souboru
fs.writeFileSync(paths.tsOutput, finalContent, "utf-8");

console.log(`✅ iconCode.ts vygenerován s ${staticEntries.length} statickými a ${allNames.length} dynamickými ikonami.`);