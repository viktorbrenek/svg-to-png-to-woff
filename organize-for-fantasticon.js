import fs from "fs";
import path from "path";
import { paths } from "./config.js";

const { svgDirs, flatOutputDir } = paths;

if (fs.existsSync(flatOutputDir)) {
  fs.rmSync(flatOutputDir, { recursive: true });
}
fs.mkdirSync(flatOutputDir);

for (const folder of svgDirs) {
  if (!fs.existsSync(folder)) continue;

  const files = fs.readdirSync(folder).filter(f => f.endsWith(".svg"));

  for (const file of files) {
    const cleanName = file.replace(/^regular-/, "").replace(/^bold-/, "");
    const src = path.join(folder, file);
    const dest = path.join(flatOutputDir, cleanName);
    fs.copyFileSync(src, dest);
  }
}

console.log(`📦 Flatten complete. Total icons copied: ${fs.readdirSync(flatOutputDir).length}`);
