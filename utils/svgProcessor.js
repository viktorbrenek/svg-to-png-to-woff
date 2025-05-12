import fs from 'fs';
import { JSDOM } from 'jsdom';
import parse from 'svg-path-parser';
import ClipperLib from 'clipper-lib';

const { Clipper, PolyFillType, ClipType, PolyType } = ClipperLib;

function svgToClipperPoints(commands) {
  const points = [];
  for (const cmd of commands) {
    if (cmd.code === 'M' || cmd.code === 'L') {
      points.push({ X: Math.round(cmd.x * 100), Y: Math.round(cmd.y * 100) });
    } else if (cmd.code === 'Z' && points.length) {
      points.push({ ...points[0] });
    }
  }
  return points;
}

function clipperToPathD(paths) {
  return paths
    .map(ring =>
      `M ${ring.map(p => `${p.X / 100} ${p.Y / 100}`).join(' L ')} Z`
    )
    .join(' ');
}

export async function processSvgFile(filePath) {
  const svgContent = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(svgContent, { contentType: 'image/svg+xml' });
  const document = dom.window.document;

  const paths = Array.from(document.querySelectorAll('path[fill-rule="evenodd"]'));
  console.log(`Nalezeno ${paths.length} cest s fill-rule="evenodd"`);

  for (const path of paths) {
    const originalD = path.getAttribute('d');
    const commands = parse(originalD);

    const subPaths = [];
    let current = [];

    for (const cmd of commands) {
      if (cmd.code === 'M' && current.length) {
        subPaths.push(current);
        current = [cmd];
      } else {
        current.push(cmd);
      }
    }
    if (current.length) subPaths.push(current);

    const outer = [];
    const holes = [];

    for (const cmds of subPaths) {
      const poly = svgToClipperPoints(cmds);
      const area = ClipperLib.Clipper.Area(poly);
      console.log(`  Subpath area: ${area.toFixed(2)}, points: ${poly.length}`);
      if (Math.abs(area) < 1 || poly.length < 3) {
        console.log("  ⚠️ Ignorováno kvůli malému nebo chybnému polygonu.");
        continue;
      }

      if (area > 0) {
        outer.push(poly);
        console.log("  ➕ Přidáno jako obrys");
      } else {
        holes.push(poly);
        console.log("  ➖ Přidáno jako výřez");
      }
    }

    if (!outer.length) {
      console.log("❌ Žádné platné obrysy — ponechávám původní tvar");
      path.setAttribute('fill-rule', 'nonzero');
      continue;
    }

    const clipper = new Clipper();
    clipper.AddPaths(outer, PolyType.ptSubject, true);
    clipper.AddPaths(holes, PolyType.ptClip, true);

    const solution = new ClipperLib.Paths();
    clipper.Execute(
      ClipType.ctDifference,
      solution,
      PolyFillType.pftNonZero,
      PolyFillType.pftNonZero
    );

    if (!solution.length) {
      console.log("❌ Výsledek je prázdný — ponechávám původní tvar");
      path.setAttribute('fill-rule', 'nonzero');
      continue;
    }

    const newD = clipperToPathD(solution);
    path.setAttribute('d', newD);
    path.setAttribute('fill-rule', 'nonzero');
    console.log(`✅ Přepsáno: ${solution.length} cest`);
  }

  return document.documentElement.outerHTML;
}
