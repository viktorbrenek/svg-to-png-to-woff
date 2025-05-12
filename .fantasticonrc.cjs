const path = require("path");
const codepoints = require("./codepoints.json");

module.exports = {
  inputDir: "./output", // zachová strukturu a názvy
  outputDir: "./dist",
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['css', 'html', 'json', 'ts'],
  name: 'my-icons',
  fontsUrl: '/static/fonts',
  normalize: true,
  fontHeight: 1024,
  descent: 64,
  prefix: 'icon',
  formatOptions: {
    svg: {
      metadata: true
    }
  },
  pathOptions: {
    ts: 'dist/icon-types.ts',
    json: 'dist/icon-codepoints.json'
  },
  templates: {
    css: 'my-custom-tp.css.hbs'
  },
  codepoints
};
