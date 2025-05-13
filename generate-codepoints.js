import fs from "fs";
import path from "path";

const outputDirs = [
  { folder: "output/regular" },
  { folder: "output/bold" }
];

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

fs.writeFileSync("codepoints.json", JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ codepoints.json generated with ${Object.keys(result).length} icons.`);

