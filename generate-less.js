import fs from "fs";
import { paths } from "./config.js";

const codepoints = JSON.parse(fs.readFileSync(paths.codepoints, "utf-8"));

const lines = Object.entries(codepoints).map(
  ([name, code]) => `@${name}: "\\${code.toString(16).padStart(4, "0")}";`
);

fs.writeFileSync("./dist/iconCode.less", lines.join("\n") + "\n", "utf-8");
console.log(`✅ iconCode.less generated. Total: ${lines.length} icons.`);

