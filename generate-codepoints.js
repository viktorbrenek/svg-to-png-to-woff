import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM náhrady
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Načti config
const paths = JSON.parse(fs.readFileSync(path.join(__dirname, "paths.json"), "utf-8"));

// Použij složky z configu
const outputDirs = paths.svgDirs.map(folder => ({ folder }));

const startCodepoint = 0xe000;
let currentCodepoint = startCodepoint;

const result = {};

for (const { folder } of outputDirs) {
  if (!fs.existsSync(folder)) continue;

  const files = fs.readdirSync(folder)
    .filter(f => f.endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
    const name = file.replace(/\.svg$/, "");
    if (!result[name]) {
      result[name] = currentCodepoint;
      currentCodepoint++;
    }
  }
}

fs.writeFileSync(paths.codepoints, JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ codepoints.json generated with ${Object.keys(result).length} icons.`);
