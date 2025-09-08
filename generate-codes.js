// generate-iconObjects-fromOutputs.js
import fs from "fs";
import path from "path";
import { paths } from "./config.js";

// 1. Načti TS soubor a extrahuj názvy ikon z enumu
const tsContent = fs.readFileSync(paths.tsOutput, "utf-8");
const iconNames = [];
const enumLineRegex = /^\s+[\w\d_]+ = "(.*?)",$/gm;
let match;
while ((match = enumLineRegex.exec(tsContent)) !== null) {
  iconNames.push(match[1]);
}

// 2. Načti LESS soubor a vytvoř mapu name → hex kód
const lessContent = fs.readFileSync(paths.lessOutput, "utf-8");
const codeMap = {};
const varLineRegex = /^\s*@?([\w-]+): "\\([a-f0-nebo 9]+)";$/gm;
while ((match = varLineRegex.exec(lessContent)) !== null) {
  const name = match[1];
  const code = match[2].toLowerCase();
  codeMap[name] = code;
}

// 3. Poskládej výsledné pole objektů
const output = [];
for (const name of iconNames) {
  if (codeMap[name]) {
    output.push({
      name,
      code: codeMap[name]
    });
  }
}

// 4. Zapiš JSON pole do souboru
const outPath = path.join(paths.distDir, "iconObjects.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
console.log(`✅ iconObjects.json generated with ${output.length} icons.`);
