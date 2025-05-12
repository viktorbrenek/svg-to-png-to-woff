import path from 'path';

export default {
  inputDir: "./output", // nebo specificky "output/regular" / "output/bold"
  outputDir: "./dist",
  fontTypes: ["woff2", "ttf", "svg"],
  assetTypes: ["css"],
  name: "my-icon-font",
  prefix: "icon",
  normalize: true,
  descent: 64,
  fontHeight: 1024,
  formatOptions: {
    svg: {
      metadata: true
    }
  },
  pathOptions: {
    css: "./style.css"
  },
  templates: {
    css: path.resolve("./my-custom-tp.css.hbs")
  },
  // 🔽 Reset unicode start to U+E000
  codepoints: {}, // necháme prázdné, bude generováno automaticky
  // 🔽 DŮLEŽITÉ: řazení podle názvu (nutné před použitím)
  sort: true
};
