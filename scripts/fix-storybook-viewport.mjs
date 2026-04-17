/**
 * Post-build patch: remove zoom-disabling restrictions from Storybook's
 * auto-generated manager index.html.
 *
 * Storybook 8 hard-codes `maximum-scale=1` in its manager template at
 * build time, after the `managerHead` hook runs, so the hook can't reach it.
 * This script runs after `storybook build` to clean the static output.
 *
 * WCAG 1.4.4 (Resize Text) — removes `maximum-scale` and `user-scalable=no`.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = 'storybook-static';
const file = join(OUTPUT_DIR, 'index.html');

let html;
try {
  html = readFileSync(file, 'utf8');
} catch {
  console.error(`fix-storybook-viewport: could not read ${file} — skipping`);
  process.exit(0);
}

const fixed = html.replace(
  /<meta name="viewport" content="[^"]*"/,
  '<meta name="viewport" content="width=device-width, initial-scale=1"'
);

if (fixed === html) {
  console.log('fix-storybook-viewport: no viewport meta found to patch — skipping');
} else {
  writeFileSync(file, fixed, 'utf8');
  console.log('fix-storybook-viewport: patched viewport meta in', file);
}
