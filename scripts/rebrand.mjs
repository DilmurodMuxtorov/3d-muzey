import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const rename=value=>value
  .replace(/Muzeychani/g,'3D muzeyni')
  .replace(/Muzeychadan/g,'3D muzeydan')
  .replace(/Muzeycha[’‘']?dagi/g,'3D muzeydagi')
  .replace(/Muzeycha/g,'3D muzey')
  .replace(/Suratlar muzeychasi/g,'Suratlar muzeyi')
  .replace(/Gift Museum/g,'3D muzey');

for(const name of await fs.readdir(path.join(dist,'i18n'))) {
  if(!name.endsWith('.js'))continue;
  const file=path.join(dist,'i18n',name);
  const content=await fs.readFile(file,'utf8');
  const data=JSON.parse(content.replace(/^window\.__I18N=/,'').replace(/;\s*$/,''));
  for(const [key,value] of Object.entries(data.lines))if(typeof value==='string')data.lines[key]=rename(value);
  Object.assign(data.lines,{
    'app.name':'3D muzey',
    'app.title_suffix':':title · 3D muzey',
    'museum3d.title.brand':'3D MUZEY',
    'museum3d.brand.domain':'3D muzey',
    'ui.qr.caption_classic':'3D muzey',
    'viewer.video.instagram_handle':'',
    'viewer.video.share_text':'3D muzey',
  });
  await fs.writeFile(file,'window.__I18N='+JSON.stringify(data)+';');
}
for(const file of ['index.html',...(await fs.readdir(path.join(dist,'pages'))).map(n=>'pages/'+n)]) {
  const target=path.join(dist,file);
  await fs.writeFile(target,rename(await fs.readFile(target,'utf8')));
}
const manifestFile=path.join(dist,'site.webmanifest');
const manifest=JSON.parse(await fs.readFile(manifestFile,'utf8'));
manifest.name=manifest.short_name='3D muzey';
await fs.writeFile(manifestFile,JSON.stringify(manifest,null,2));
for(const name of ['MuseumView-DESj1fLN.js','QrCode-BjuUzmpZ.js']) {
  const file=path.join(dist,'build/assets',name);
  const content=await fs.readFile(file,'utf8');
  await fs.writeFile(file,content.replaceAll('M U Z E Y C H A','3D MUZEY')
    .replaceAll('title:`Suratlar muzeychasi`','title:`Suratlar muzeyi`')
    .replaceAll('muzeycha.mp4','3d-muzey.mp4').replaceAll('muzeycha-qr.png','3d-muzey-qr.png')
    .replaceAll('s.title||`muzeycha`','s.title||`3D muzey`'));
}
console.log('Display branding updated to 3D muzey.');
