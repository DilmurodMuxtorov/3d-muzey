import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await fs.mkdir(path.join(root,'dist/pages'),{recursive:true});
const names=['home','login','oferta','privacy','qaytarish'];
for(const locale of ['uz','en']) {
  for(const name of names) {
    const file=`${name}${locale==='en'?'-en':''}.html`;
    let html;
    try { html=await fs.readFile(path.join(root,'reference',file),'utf8'); }
    catch { html=await fs.readFile(path.join(root,'reference',`${name}.html`),'utf8'); }
    if(locale==='en') {
      html=html.replace('<html lang="uz">','<html lang="en">')
        .replace('/i18n/uz.5dba433c37.js','/i18n/en.ac0e3a0c1d.js')
        .replace(/"locale":"uz"/g,'"locale":"en"');
    }
    // Remove source-site analytics, Telegram injection, and session CSRF values.
    html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,tag=>
      /data-page="app"|src="\/i18n\/|type="module"/.test(tag)?tag:'');
    html=html.replace(/<meta name="csrf-token"[^>]*>/,'<meta name="csrf-token" content="local-preview">');
    html=html.replace(/https:\/\/muzeycha\.uz\/build\//g,'/build/');
    html=html.replace(/<link rel="preconnect" href="https:\/\/fonts\.bunny\.net">/,'');
    html=html.replace(/<link href="https:\/\/fonts\.bunny\.net[^>]+>/,'<link rel="stylesheet" href="/fonts/fonts.css">');
    html=html.replace('</head>','<link rel="stylesheet" href="/local.css"></head>');
    html=html.replace(/Muzeycha/g,'3D muzey').replace(/Gift Museum/g,'3D muzey');
    await fs.writeFile(path.join(root,'dist/pages',`${name}-${locale}.html`),html);
    if(name==='home'&&locale==='uz') await fs.writeFile(path.join(root,'dist/index.html'),html);
  }
}
console.log('Local frontend prepared in dist/');
