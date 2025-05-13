import fs from "fs";

const codepoints = JSON.parse(fs.readFileSync("./dist/icon-codepoints.json", "utf-8"));

const lines = Object.entries(codepoints).map(
  ([name, code]) => `@${name}: "\\${code.toString(16).padStart(4, "0")}";`
);

fs.writeFileSync("./dist/iconCode.less", lines.join("\n") + "\n", "utf-8");
console.log(`✅ iconCode.less generated. Total: ${lines.length} icons.`);

