import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'dist/build/assets/Home-Dm84qboy.js');
const backup=path.join(root,'reference/Home.public-original.js');
try {await fs.access(backup);} catch {await fs.copyFile(file,backup);}
let source=await fs.readFile(backup,'utf8');
function replaceRange(start,end,replacement) {
  const a=source.indexOf(start),b=source.indexOf(end,a);
  if(a<0||b<0)throw Error('Expected section missing: '+start.slice(0,60));
  source=source.slice(0,a)+replacement+source.slice(b+end.length);
}
// Retain the original uploader and editor, removing marketing and checkout mounts.
const pickerStart=source.indexOf('g(`section`,Xn,[');
const pickerEnd=source.indexOf(',e(I)?',pickerStart);
if(pickerStart<0||pickerEnd<0)throw Error('Uploader not found');
const picker=source.slice(pickerStart,pickerEnd).replace('g(`section`,Xn,[','g(`section`,{class:`local-picker`},[')+'])';
replaceRange('[g(`header`,Rn,','d(be)],32))','['+picker+'],32))');
source=source.replace('class:`min-h-dvh`,onDragover','class:`local-start`,onDragover');
replaceRange(',g(`button`,{type:`button`,class:`btn btn-primary h-11','p(` `+_(t.$t(`home.museum.share`)),1)])','');
replaceRange(',me.value?(l(),ee(Pe,',',d(he,{show:N.value',',d(he,{show:N.value');
replaceRange('let e=await Fe();e?.images?.length&&(', 'ye.value=!1;', 'ye.value=!1;');
await fs.writeFile(file,source);
console.log('Photo-first frontend prepared; marketing, account links and checkout removed.');
