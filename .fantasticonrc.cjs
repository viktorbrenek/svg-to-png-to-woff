const fs = require('fs');
const paths = JSON.parse(fs.readFileSync('./paths.json', 'utf-8'));
const codepoints = require('./codepoints.json');

module.exports = {
  inputDir: paths.flatOutputDir,
  outputDir: paths.distDir,
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['html', 'json', 'ts'],
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
    ts: `${paths.distDir}/icon-types.ts`,
    json: `${paths.distDir}/icon-codepoints.json`
  },
  templates: {
    css: 'my-custom-tp.css.hbs'
  },
  codepoints
};
