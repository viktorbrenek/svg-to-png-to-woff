import fs from "fs";
import { paths } from "./config.js";

// načtení ikon
const codepoints = JSON.parse(fs.readFileSync(paths.codepoints, "utf-8"));

// --- statické aliasy (manuálně udržované) ---
const staticAliases = `// Icon aliases (static)
@icon-ordered-asc: @ui-arrow-top-small;
@icon-ordered-desc: @ui-arrow-bottom-small;
@icon-filter: @ui-filter;
@icon-filter-on: @ui-filter-filled;
@icon-lov: @ui-chevron-right-small;
@icon-dropdown: @ui-chevron-bottom-small;
@icon-dateedit: @time-calendar-small;
@icon-datetimeedit: @time-calendar-small;
@icon-timeedit: @time-calendar-small;
@icon-more: @ui-more-vertical;
`;

// --- dynamicky generované LESS proměnné ---
const iconVariables = Object.entries(codepoints)
  .map(([name, code]) => `@${name}: "\\${code.toString(16).padStart(4, "0")}";`)
  .join("\n");

// --- mapování pro @icon-codes ---
const iconCodes = Object.entries(codepoints)
  .map(([name, code]) => `    ${name}: "\\${code.toString(16).padStart(4, "0")}";`)
  .join("\n");

// --- legacy aliasy ---
const legacyAliases = `@icon-codes-legacy: {
    com-bell-a: @com-bell;
    com-bell-a-filled: @com-bell-filled;
};`;

const finalContent = `// Icon codes
${staticAliases}

// Dynamically generated icon variables
${iconVariables}

/** The changes must be reflected in the IconCode and the above variables. */
@icon-codes: {
${iconCodes}
};

${legacyAliases}
`;

fs.writeFileSync(paths.lessOutput, finalContent.trim() + "\n", "utf-8");
console.log(`✅ iconCode.less generated to ${paths.lessOutput} with ${Object.keys(codepoints).length} icons.`);
