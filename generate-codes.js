import fs from "fs";
import path from "path";
import { paths } from "./config.js";

// 1. Načti jediný zdroj pravdy – soubor s definicemi kódů.
const codepoints = JSON.parse(fs.readFileSync(paths.codepoints, "utf-8"));

// 2. Získej seznam všech názvů a seřaď je (stejná logika jako pro iconCode.ts)
// Tím zajistíme, že "filled" varianty budou následovat za svými páry.
const allNames = Object.keys(codepoints);
const nonFilled = allNames.filter(n => !n.endsWith("-filled")).sort((a, b) => a.localeCompare(b));
const filledSet = new Set(allNames.filter(n => n.endsWith("-filled")));

const sortedNames = [];

for (const name of nonFilled) {
  sortedNames.push(name); // Přidej základní ikonu
  const filledName = name + "-filled";
  if (filledSet.has(filledName)) {
    sortedNames.push(filledName); // Přidej hned po ní její filled variantu
    filledSet.delete(filledName);
  }
}

// Přidej "osiřelé" filled ikony, které nemají pár, na konec seznamu
sortedNames.push(...Array.from(filledSet).sort((a, b) => a.localeCompare(b)));

// 3. Vytvoř finální pole objektů na základě seřazených názvů
const output = sortedNames.map(name => ({
  name: name,
  code: codepoints[name].toString(16) // Najdi kód v původním objektu a převeď na hex
}));

// 4. Zapiš JSON pole do souboru
const outPath = path.join(paths.distDir, "iconObjects.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

console.log(`✅ iconObjects.json vygenerován s ${output.length} ikonami přímo z codepoints.json.`);