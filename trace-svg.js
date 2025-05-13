import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';

const inputDir = './iconyzfigmy';
const tmpDir = './tmp';
const outputDir = './output';

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

async function convertSvgToPng(input, output) {
  console.log(`🟣 Converting SVG to PNG: ${input}`);
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
  console.log(`🟠 PNG ➜ PGM (alpha extract): ${pngInput}`);
  execSync(`${imageMagickCmd} "${pngInput}" -alpha extract -threshold 50% -negate "${pgmOutput}"`);
}


function tracePgmToSvg(pgmInput, svgOutput) {
  console.log(`🟡 Tracing to SVG: ${pgmInput}`);
  execSync(`potrace -s "${pgmInput}" -o "${svgOutput}"`, { stdio: 'inherit' });

  // Delete PGM after tracing
  fs.unlinkSync(pgmInput);
}

async function processIcon(fullInputPath, relativeOutputPath) {
  const baseName = path.basename(fullInputPath, '.svg');
  const pngPath = path.join(tmpDir, `${baseName}.png`);
  const pgmPath = path.join(tmpDir, `${baseName}.pgm`);
  const svgOutPath = path.join(outputDir, relativeOutputPath);

  // Ensure subdirectory exists
  fs.mkdirSync(path.dirname(svgOutPath), { recursive: true });

  try {
    await convertSvgToPng(fullInputPath, pngPath);
    convertPngToPgm(pngPath, pgmPath);
    tracePgmToSvg(pgmPath, svgOutPath);
    console.log(`✅ Done: ${svgOutPath}\n`);
  } finally {
    // Cleanup PNG as well, whether it succeeded or failed
    if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
  }
}

async function walkAndProcess(dir, relative = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      await walkAndProcess(fullPath, relPath);
    } else if (entry.isFile() && entry.name.endsWith('.svg')) {
      const outputRelPath = relPath.replace(/\.svg$/, '.svg');
      await processIcon(fullPath, outputRelPath);
    }
  }
}

async function main() {
  let count = 0;
  async function wrappedWalk(dir, relative = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relative, entry.name);
      if (entry.isDirectory()) {
        await wrappedWalk(fullPath, relPath);
      } else if (entry.isFile() && entry.name.endsWith('.svg')) {
        const outputRelPath = relPath.replace(/\.svg$/, '.svg');
        await processIcon(fullPath, outputRelPath);
        count++;
      }
    }
  }

  await wrappedWalk(inputDir);
  console.log(`🎉 Tracing complete. Total icons processed: ${count}`);
}


main().catch(err => {
  console.error('❌ Error:', err);
});
