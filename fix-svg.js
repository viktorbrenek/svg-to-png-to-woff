
import fs from 'fs';
import path from 'path';
import paper from 'paper';
import { JSDOM } from 'jsdom';
import { createCanvas } from 'canvas';

const inputDir = './icons';
const outputDir = './iconsfixed';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = window;
global.document = window.document;

const canvas = createCanvas(1000, 1000);
paper.setup(canvas);

const svgFiles = fs.readdirSync(inputDir).filter(f => f.endsWith('.svg'));

for (const file of svgFiles) {
  const filePath = path.join(inputDir, file);
  const svgString = fs.readFileSync(filePath, 'utf-8');

  try {
    const item = await paper.project.importSVG(svgString, { expandShapes: true });
    if (!item) throw new Error('Import selhal');

    const paths = item.getItems({
      match: el => el instanceof paper.Path || el instanceof paper.CompoundPath,
    });

    if (paths.length === 0) throw new Error('Žádné použitelné cesty');

    const group = new paper.Group({
      children: paths.map(path => {
        const copy = path.clone({ insert: false });
        copy.fillRule = 'evenodd';
        return copy;
      }),
      insert: false
    });

    const bounds = group.bounds;
    const targetSize = 1000;
    const scale = targetSize / Math.max(bounds.width, bounds.height);

    group.scale(scale);
    group.translate(new paper.Point(-group.bounds.x, -group.bounds.y));
    group.translate(new paper.Point((targetSize - group.bounds.width) / 2, (targetSize - group.bounds.height) / 2));

    const svgGroup = group.exportSVG({ asString: false });
    const pathsInSvg = svgGroup.querySelectorAll('path');
    for (const p of pathsInSvg) {
      p.setAttribute('fill-rule', 'evenodd');
    }

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("viewBox", "0 0 1000 1000");
    svgElement.setAttribute("width", "1000");
    svgElement.setAttribute("height", "1000");
    svgElement.appendChild(svgGroup);

    const serialized = svgElement.outerHTML;
    fs.writeFileSync(path.join(outputDir, file), serialized);
    console.log(`✔ ${file} přečištěno`);
  } catch (err) {
    console.warn(`✖ ${file} selhalo: ${err.message}`);
  }

  paper.project.clear();
}