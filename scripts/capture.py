"""Capture only the public, browser-delivered frontend for a local working copy."""
import json, pathlib, re, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = 'https://muzeycha.uz'
def fetch(path):
    req = urllib.request.Request(BASE + path, headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=45) as response:
        return response.read()

html = fetch('/').decode()
(ROOT/'reference'/'home.html').write_text(html, encoding='utf-8')
paths = set(re.findall(r'https://muzeycha\.uz(/build/assets/[^"<>]+)', html))
paths.update(re.findall(r'"(/i18n/[^"<>]+)"', html))
seen = set()
while paths:
    path = paths.pop()
    if path in seen: continue
    seen.add(path)
    try:
        data = fetch(path)
    except Exception as e:
        print('FAILED',path,str(e),flush=True)
        continue
    out = ROOT/'dist'/path.lstrip('/')
    out.parent.mkdir(parents=True,exist_ok=True)
    out.write_bytes(data)
    print(path,len(data),flush=True)
    if path.endswith(('.js','.css')):
        body=data.decode('utf-8')
        for name in re.findall(r'[\w.-]+\.(?:js|css)',body):
            candidate='/build/assets/'+name
            if candidate not in seen: paths.add(candidate)
(ROOT/'reference'/'captured-assets.json').write_text(json.dumps(sorted(seen),indent=2))
