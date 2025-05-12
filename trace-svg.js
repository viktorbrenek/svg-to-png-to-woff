import fs from 'fs';
import { execSync } from 'child_process';
import sharp from 'sharp';

const inputFile = './iconyzfigmy/com-phone.svg';
const pngPath = './tmp/trace.png';
const pgmPath = './tmp/trace.pgm';
const tracedSvgPath = './output/com-phone-traced.svg';

async function convertSvgToPng(input, output) {
  console.log('🟣 Převádím SVG na PNG...');
  await sharp(input)
    .resize(512, 512, { fit: 'contain' })
    .png()
    .toFile(output);
  console.log('🔵 PNG hotové:', output);
}

function convertPngToPgm(pngInput, pgmOutput) {
  console.log('🟠 PNG ➜ PGM pomocí alpha kanálu (invertovaný)...');
  execSync(`convert "${pngInput}" -alpha extract -threshold 50% -negate "${pgmOutput}"`);
}

function tracePgmToSvg(pgmInput, svgOutput) {
  console.log('🟡 Spouštím potrace...');
  execSync(`potrace -s "${pgmInput}" -o "${svgOutput}"`, { stdio: 'inherit' });
  console.log('🟢 SVG výstup hotov:', svgOutput);
}

async function main() {
  if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
  if (!fs.existsSync('./output')) fs.mkdirSync('./output');

  await convertSvgToPng(inputFile, pngPath);
  convertPngToPgm(pngPath, pgmPath);
  tracePgmToSvg(pgmPath, tracedSvgPath);
}

main().catch((err) => {
  console.error('❌ Chyba:', err);
});
