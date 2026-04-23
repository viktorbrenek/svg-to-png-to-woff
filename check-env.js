import { execSync } from 'child_process';

function checkCommand(command, name) {
  try {
    execSync(command, { stdio: 'ignore' });
    console.log(`✅ ${name} je nainstalován.`);
  } catch (e) {
    console.error(`❌ CHYBA: ${name} není nainstalován nebo není v PATH.`);
    console.error(`   Prosím nainstalujte ho (např. brew install ${name.toLowerCase()})`);
    process.exit(1);
  }
}

console.log('🔍 Kontrola prostředí...');
checkCommand('magick -version', 'ImageMagick');
checkCommand('potrace --version', 'Potrace');