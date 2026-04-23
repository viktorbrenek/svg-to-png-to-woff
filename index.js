#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🚀 Spouštím generování ikon...');

try {
  // Změna z 'npm run all' na 'npm run build'
  // stdio: 'inherit' zajistí, že uvidíte barevné výstupy z podprocesů
  execSync('npm run build', { stdio: 'inherit' }); 
  
  console.log('✅ Hotovo! Všechny ikony byly vygenerovány.');
} catch (err) {
  console.error('❌ Chyba při generování:', err.message);
  process.exit(1);
}