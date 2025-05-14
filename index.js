#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🛠 Generating icon font...');

try {
  execSync('npm run all', { stdio: 'inherit' });
  console.log('✅ Font generation finished.');
} catch (err) {
  console.error('❌ Error during generation:', err);
  process.exit(1);
}
