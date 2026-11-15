# Tekshiruv — 2026-11-15

## So‘nggi o‘zgarishlar sinovi

- Sahna tanlashdagi yetishmayotgan `light.webp`, `dark.webp`, `marry-me.webp` fayllari mahalliy `museum-assets/previews/` papkasiga qo‘shildi. Brauzerda uchalasining yuklangani va o‘lchami mavjudligi tekshirildi. `evidence/scene-previews-fixed.jpg` joriy natijani ko‘rsatadi.

- Boshlang‘ich oynada faqat rasm/video tanlash kartasi ko‘rindi.
- Ikkita test rasmi bilan 3D muzey ochildi. Ulashish va to‘lov tugmalari ko‘rinmadi.
- So‘nggi brauzer konsolida JavaScript xatosi qayd etilmadi.
- Sahifa yangilanganda yana rasm tanlash kartasi chiqdi.
- Launcher boshqa papkadan, Codex Node yo‘li PATH ichidan olib tashlangan oddiy Windows muhitida ishlatildi.
- Shu loyihaning yashirin serveri to‘xtatilib, qayta ishga tushirildi va health so‘roviga javob berdi.
- Launcher takroran bajarilganda mavjud server PID o‘zgarmadi, ikkinchi nusxa ochilmadi.
- `/`, `/local.css`, Home JS, pingvin GLB va musiqa fayli HTTP 200 javob qaytardi.
- Foydalanuvchi ochishi uchun fon serveri ishlayotgan holda qoldirildi.
- `evidence/photo-first.jpg` — joriy soddalashtirilgan oynaning haqiqiy skrinshoti.

Quyidagi bandlar dastlabki nusxaning tarixiy tekshiruvidir. Tarif, kirish va avtomatik qoralama tiklash bo‘yicha bandlar yangi soddalashtirilgan oqimdan olib tashlangan.

---

Mahalliy manzil: `http://127.0.0.1:4177/`. Uchta shaxsiy ma’lumotsiz test PNG ishlatildi.

Amalda tekshirildi:

- Bosh sahifa 200 javob bilan ochildi, mahalliy shriftlar va ko‘rinish yuklandi.
- O‘zbekcha → inglizcha → o‘zbekcha til almashtirish ishladi.
- Maxfiylik sahifasiga ichki navigatsiya va bosh sahifaga qaytish ishladi.
- Uchta surat tanlandi, pingvinli yorug‘ 3D muzey ochildi.
- Qorong‘i sahna, qahramonsiz ko‘rinish, “Sinov muzeyi” nomi va ikkinchi suratni asosiy qilish ishladi.
- Sozlash tugagach sahifa yangilandi. Qoralama rasmlar va sozlamalar bilan tiklandi.
- Suratni kattalashtirish va keyingi suratga o‘tish ishladi.
- Ulashish oynasidagi 90 kun / 17 000 so‘m va 1 yil / 59 000 so‘m tanlovi ishladi.
- To‘lov usullari logotiplari mahalliy fayllardan muvaffaqiyatli yuklandi.
- W tugmasi bilan kamera oldinga yurdi.
- Oxirgi konsol tekshiruvida JavaScript xatolari kuzatilmadi. Dastlabki yuklanishda asl Three.js kutubxonasining eskirgan Clock API ogohlantirishi bor.
- `server.mjs` va `scripts/prepare.mjs` Node sintaksis tekshiruvidan o‘tdi.

Chegaralar:

- Haqiqiy hisob, email, to‘lov va to‘lovdan keyingi serverda saqlash ishlatilmagan, ulanmagan.
- Video yuklash, romantik sahna va barcha mobil qurilmalar kombinatsiyasi amalda to‘liq sinovdan o‘tkazilmagan.
- Asl saytdagi rasmlarni “ko‘rildi” hisoblagichi xatti-harakati nusxada ham saqlangan. Hozir funksional o‘zgartirish kiritilmadi.
- Sozlashdan keyin qoralama saqlanishi asinxron bajariladi. Saqlash tugashidan oldin darhol sahifani yangilash oxirgi o‘zgarishni yo‘qotishi mumkin.

`evidence/home.jpg`, `evidence/gallery.jpg`, `evidence/share.jpg` — mahalliy nusxadan olingan haqiqiy skrinshotlar.
