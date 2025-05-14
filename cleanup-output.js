import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM náhrady
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Načti config
const paths = JSON.parse(fs.readFileSync(path.join(__dirname, "paths.json"), "utf-8"));

for (const dir of paths.svgDirs) {
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".svg"));
  for (const file of files) {
    const filePath = path.join(dir, file);
    fs.unlinkSync(filePath);
  }
  console.log(`🧹 Cleared ${files.length} SVG files from: ${dir}`);
}
