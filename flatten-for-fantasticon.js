import fs from "fs";
import path from "path";

const sets = ["output/regular", "output/bold"];
const flatOutput = "output-flat";

if (fs.existsSync(flatOutput)) {
  fs.rmSync(flatOutput, { recursive: true });
}
fs.mkdirSync(flatOutput);

for (const folder of sets) {
  if (!fs.existsSync(folder)) continue;

  const files = fs.readdirSync(folder).filter(f => f.endsWith(".svg"));

  for (const file of files) {
    const cleanName = file.replace(/^regular-/, "").replace(/^bold-/, "");
    const src = path.join(folder, file);
    const dest = path.join(flatOutput, cleanName);
    fs.copyFileSync(src, dest);
  }
}

console.log(`📦 Flatten complete. Total icons copied: ${fs.readdirSync(flatOutput).length}`);
