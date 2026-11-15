import concurrent.futures, json, pathlib, re, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
DIST = ROOT/'dist'
BASE = 'https://muzeycha.uz'

def request(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'}), timeout=45).read()

def save(path):
    try:
        data = request(BASE+path)
        target = DIST/path.split('?')[0].lstrip('/')
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(data)
        print(path,len(data),flush=True)
        return path
    except Exception as error:
        print('FAILED',path,str(error),flush=True)

paths = {'/favicon.svg','/apple-touch-icon.png','/site.webmanifest','/mascots/manifest.json'}
pattern = r'''["'`](/[^"'`\s{}<>]*\.(?:webp|png|jpe?g|gif|svg|mp3|wav|ogg|mp4|glb|gltf|json|woff2?)(?:\?[^"'`\s]*)?)["'`]'''
for file in DIST.rglob('*'):
    if file.suffix in ('.js','.css'):
        paths.update(re.findall(pattern,file.read_text(encoding='utf-8')))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    list(pool.map(save,sorted(paths)))
manifest = json.loads((DIST/'mascots/manifest.json').read_bytes())
for value in re.findall(r'"([^"\s]+\.(?:glb|webp|png|jpg|json))"',json.dumps(manifest)):
    if value.startswith('/'):
        save(value)
    elif not value.startswith('http'):
        save('/mascots/'+value)
for route,name in [('/login','login'),('/oferta','oferta'),('/privacy','privacy'),('/qaytarish','qaytarish'),('/?lang=en','home-en')]:
    (ROOT/'reference'/f'{name}.html').write_bytes(request(BASE+route))
fonts=request('https://fonts.bunny.net/css?family=manrope:400,500,600,700,800|fraunces:500,600,700,500i&display=swap').decode()
(ROOT/'reference/fonts.css').write_text(fonts,encoding='utf-8')
for url in set(re.findall(r'url\((https://[^)]+)\)',fonts)):
    name=url.rsplit('/',1)[-1]
    dest=DIST/'fonts'/name
    dest.parent.mkdir(exist_ok=True)
    dest.write_bytes(request(url))
    fonts=fonts.replace(url,'/fonts/'+name)
(DIST/'fonts/fonts.css').write_text(fonts,encoding='utf-8')
