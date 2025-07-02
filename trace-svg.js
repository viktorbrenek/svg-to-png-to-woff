import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';
import { paths } from './config.js';
import cliProgress from 'cli-progress';

const inputDir = paths.input;
const tmpDir = paths.tmp;
const outputDir = paths.output;

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

async function convertSvgToPng(input, output) {
  await sharp(input)
    .resize(512, 512, { fit: 'contain' })
    .png()
    .toFile(output);
}

function getImageMagickCommand() {
  try {
    execSync('magick -version', { stdio: 'ignore' });
    return 'magick';
  } catch {
    return 'convert';
  }
}

const imageMagickCmd = getImageMagickCommand();

function convertPngToPgm(pngInput, pgmOutput) {
  execSync(`${imageMagickCmd} "${pngInput}" -alpha extract -threshold 50% -negate "${pgmOutput}"`);
}

function tracePgmToSvg(pgmInput, svgOutput) {
  execSync(`potrace -s "${pgmInput}" -o "${svgOutput}"`, { stdio: 'ignore' });
  fs.unlinkSync(pgmInput);
}

async function processIcon(fullInputPath, relativeOutputPath) {
  const baseName = path.basename(fullInputPath, '.svg');
  const pngPath = path.join(tmpDir, `${baseName}.png`);
  const pgmPath = path.join(tmpDir, `${baseName}.pgm`);
  const svgOutPath = path.join(outputDir, relativeOutputPath);

  fs.mkdirSync(path.dirname(svgOutPath), { recursive: true });

  try {
    await convertSvgToPng(fullInputPath, pngPath);
    convertPngToPgm(pngPath, pgmPath);
    tracePgmToSvg(pgmPath, svgOutPath);
  } finally {
    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
  }
}

function collectSvgPaths(dir, relative = '') {
  let paths = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      paths = paths.concat(collectSvgPaths(fullPath, relPath));
    } else if (entry.isFile() && entry.name.endsWith('.svg')) {
      const outputRelPath = relPath.replace(/\.svg$/, '.svg');
      paths.push({ fullPath, outputRelPath });
    }
  }
  return paths;
}

async function main() {
  const svgFiles = collectSvgPaths(inputDir);
  const bar = new cliProgress.SingleBar({
    format: 'Processing [{bar}] {value}/{total} SVGs',
    barCompleteChar: '#',
    barIncompleteChar: '-',
    hideCursor: true
  }, cliProgress.Presets.shades_classic);

  bar.start(svgFiles.length, 0);

  for (let i = 0; i < svgFiles.length; i++) {
    const { fullPath, outputRelPath } = svgFiles[i];
    await processIcon(fullPath, outputRelPath);
    bar.update(i + 1);
  }

  bar.stop();
  console.log(`🎉 Tracing complete. Total icons processed: ${svgFiles.length}`);
}

main().catch(err => {
  console.error('❌ Error:', err);
});
