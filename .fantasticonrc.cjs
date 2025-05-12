/** @type {import('fantasticon').Config} */
module.exports = {
  inputDir: 'output', // důležité: bez ./ a správná složka
  outputDir: 'dist',
  fontTypes: ['ttf', 'woff', 'woff2'],
  assetTypes: ['css', 'html', 'json', 'ts'],
  name: 'my-icons',
  fontsUrl: '/static/fonts',
  normalize: true,
  fontHeight: 1000,
  descent: 200,
  prefix: 'icon',
  pathOptions: {
    ts: 'dist/icon-types.ts',
    json: 'dist/icon-codepoints.json'
  },
  templates: {
    css: 'my-custom-tp.css.hbs'
  }
};
