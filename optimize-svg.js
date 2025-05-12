import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';

const inputDir = './icons';
const outputDir = './iconsoptimized';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const svgoConfig = {
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeEditorsNSData',
    'cleanupAttrs',
    'mergePaths',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['fill', 'stroke', 'class', 'style']
      }
    },
    {
      name: 'convertShapeToPath',
      active: true
    },
    {
      name: 'removeUnknownsAndDefaults',
      active: false
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [{ 'fill-rule': 'evenodd' }]
      }
    }
  ]
};

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.svg'));

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  try {
    const svgContent = fs.readFileSync(inputPath, 'utf8');
    const result = optimize(svgContent, { path: inputPath, ...svgoConfig });

    if (!result || !result.data) {
      console.warn(`✖ ${file} selhalo: Výstup z SVGO je neplatný.`);
      continue;
    }

    fs.writeFileSync(outputPath, result.data, 'utf8');
    console.log(`✔ ${file} optimalizováno`);
  } catch (err) {
    console.warn(`✖ ${file} selhalo: ${err.message}`);
  }
}
