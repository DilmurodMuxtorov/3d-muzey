# 3D muzey

Rasm va videolardan brauzerda yurib ko‘riladigan 3D muzey yaratish uchun mahalliy veb loyiha.

Boshlang‘ich sahifada faqat rasm/video tanlash oynasi chiqadi. To‘lov, hisobga kirish, reklama va sharhlar foydalanuvchi jarayonidan olib tashlangan.

## Ishga tushirish

Node.js 22 yoki undan yangi versiya kerak. Qo‘shimcha npm paketlari talab qilinmaydi.

Windows’da `start.cmd` faylini oching. U mahalliy serverni fon rejimida ishga tushiradi va tayyor bo‘lgach brauzerni ochadi. Serverni yopish uchun `stop.cmd` faylini oching.

Yoki terminalda:

```sh
node server.mjs
```

So‘ng http://127.0.0.1:4177/ manzilini oching. Windows launcher asosiy port band bo‘lsa, 4178–4186 oralig‘idan bo‘sh portni tanlaydi.

## Imkoniyatlar

- Rasm/video tanlash va 3D galereyada yurish.
- Yorug‘, qorong‘i va romantik sahnalar.
- Pingvin, odamcha yoki qahramonsiz ko‘rinish.
- Muzey nomi, asosiy rasm, surat qo‘shish va o‘chirish.
- Musiqa va rasmlarni kattalashtirib ko‘rish.
- Har yangi sahifa ochilishida rasm tanlash oynasidan boshlash.

Haqiqiy hisob, to‘lov, ommaviy havola va serverda muzey saqlash ulanmagan. Suratlar mahalliy brauzerda ishlanadi; dastlabki xizmat API’siga yuborilmaydi.

## Ishlab chiqish

```sh
node scripts/prepare.mjs
node scripts/customize.mjs
node scripts/rebrand.mjs
```

Yoki `npm run prepare`. O‘zgarishlardan keyin brauzer sahifasini yangilang.

- `server.mjs` — mahalliy HTTP server.
- `dist/` — tayyor frontend va mahalliy media fayllari.
- `scripts/customize.mjs` — rasm tanlashdan boshlanadigan soddalashtirilgan interfeys.
- `scripts/rebrand.mjs` — ko‘rinadigan nomni “3D muzey”ga almashtirish.
- `scripts/launch.ps1`, `scripts/stop.ps1` — Windows’da serverni boshqarish.
- `reference/` — dastlabki ochiq sahifa va frontend nusxalari.
- `evidence/`, `VERIFICATION.md` — amaliy tekshiruv natijalari.

`.runtime/` loglari va kompyuterga xos `runtime-node.txt` Git orqali yuborilmaydi. Boshqa kompyuterda Node.js o‘rnatilgan bo‘lishi kerak.

