import pathlib, urllib.request
root=pathlib.Path(__file__).resolve().parents[1]/'dist'
for path in ['/i18n/en.ac0e3a0c1d.js','/mascots/pingvin.glb?v=2',
             '/icon-192.png','/icon-512.png',
             '/images/pay/payme.svg','/images/pay/click.svg',
             '/images/pay/paypal.svg','/images/pay/applepay.svg','/images/pay/mir.svg',
             '/images/pay/icons/uzum.svg','/images/pay/icons/paynet.svg',
             '/museum-assets/previews/light.webp?v=2',
             '/museum-assets/previews/dark.webp?v=2',
             '/museum-assets/previews/marry-me.webp?v=2']:
    target=root/path.split('?')[0].lstrip('/')
    if target.exists():continue
    req=urllib.request.Request('https://muzeycha.uz'+path,headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(req,timeout=45) as response:
        data=response.read()
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_bytes(data)
    print(path,len(data),flush=True)
