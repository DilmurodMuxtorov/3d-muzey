import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await import('./prepare.mjs');
await import('./customize.mjs');
await import('./rebrand.mjs');

const dist=path.join(root,'dist');
const html=await fs.readFile(path.join(dist,'index.html'),'utf8');
const assets=[...html.matchAll(/(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)].map(match=>match[1]);
assets.push('/build/assets/Home-Dm84qboy.js',
  '/museum-assets/previews/light.webp',
  '/museum-assets/previews/dark.webp',
  '/museum-assets/previews/marry-me.webp',
  '/mascots/pingvin.glb');
for(const asset of new Set(assets)) {
  const stat=await fs.stat(path.join(dist,asset));
  if(!stat.isFile()||stat.size===0)throw Error('Missing publish asset: '+asset);
}
console.log('Static site ready in dist/. No running Node server is required on Netlify.');
