import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
const portFlag=process.argv.indexOf('--port');
const port=Number(portFlag>=0?process.argv[portFlag+1]:4177);
const pages={'/':'home','/login':'login','/oferta':'oferta','/privacy':'privacy','/qaytarish':'qaytarish'};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json','.webmanifest':'application/manifest+json','.glb':'model/gltf-binary','.mp3':'audio/mpeg','.woff':'font/woff','.woff2':'font/woff2'};

function send(res,status,type,body,headers={}) {
  res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff',...headers});
  res.end(body);
}
const json=(res,status,data,headers)=>send(res,status,'application/json; charset=utf-8',JSON.stringify(data),headers);
async function readBody(req) {
  const parts=[];let size=0;
  for await(const part of req) {size+=part.length;if(size>1024*1024)throw Error('Request too large');parts.push(part);}
  return JSON.parse(Buffer.concat(parts).toString()||'{}');
}

const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,`http://127.0.0.1:${port}`);
    if(req.method==='GET'&&url.pathname==='/__health')return json(res,200,{app:'muzeycha-local',version:2,pid:process.pid,port,root});
    const locale=/(?:^|;\s*)local-locale=en(?:;|$)/.test(req.headers.cookie||'')?'en':'uz';
    const name=pages[url.pathname];
    if(req.method==='POST') {
      if(url.pathname==='/locale') {
        const data=await readBody(req);
        return json(res,200,{ok:true},{'Set-Cookie':`local-locale=${data.locale==='en'?'en':'uz'}; Path=/; SameSite=Lax`});
      }
      if(['/i18n/missing','/events','/track','/analytics','/analytics/event','/analytics/batch'].includes(url.pathname))return json(res,200,{ok:true});
      // Closed backend services are deliberately not proxied to the source site.
      const message=locale==='en'?'This is a local frontend copy. Accounts and payments are not connected yet.':'Bu mahalliy frontend nusxa. Hisob yaratish va to‘lov hali ulanmagan.';
      return json(res,422,{message,errors:{email:[message],code:[message]}});
    }
    if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{message:'Method not allowed'});
    if(name) {
      const html=await fs.readFile(path.join(dist,'pages',`${name}-${locale}.html`),'utf8');
      if(req.headers['x-inertia']) {
        const data=JSON.parse(html.match(/<script data-page="app" type="application\/json">([\s\S]*?)<\/script>/)[1]);
        data.url=url.pathname+url.search;
        return json(res,200,data,{'X-Inertia':'true','Vary':'X-Inertia'});
      }
      return send(res,200,'text/html; charset=utf-8',html,{'Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data: blob:; connect-src 'self' blob:; font-src 'self' data:; worker-src 'self' blob:; frame-src 'none'; form-action 'self'"});
    }
    const file=path.resolve(dist,'.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(dist+path.sep))return json(res,403,{message:'Forbidden'});
    const data=await fs.readFile(file);
    return send(res,200,types[path.extname(file)]||'application/octet-stream',req.method==='HEAD'?undefined:data);
  } catch(error) {
    if(error.code==='ENOENT')return json(res,404,{message:'Not found'});
    return json(res,400,{message:'Invalid request'});
  }
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} band. start.cmd orqali ishga tushiring.`:error.message);process.exit(1);});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
