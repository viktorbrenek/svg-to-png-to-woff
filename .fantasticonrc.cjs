const fs = require('fs');
const paths = JSON.parse(fs.readFileSync('./paths.json', 'utf-8'));
const codepoints = require('./codepoints.json');

module.exports = {
  inputDir: paths.flatOutputDir,
  outputDir: paths.distDir,
  fontTypes: ['woff2'],
  assetTypes: [],
  name: 'solar-icons',
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
  templates: {
    css: 'my-custom-tp.css.hbs'
  },
  codepoints
};
