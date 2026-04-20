# Gépelés.Teszt

Magyar nyelvű gépelési sebesség mérő alkalmazás, React + Vite alapokon.


## Képernyőkép

> _ide beszúrhatunk egy screenshotot később_

## Funkciók

- Magyar gyakorló szövegek három nehézségi szinten
- Választható időkorlát: 30 / 60 / 120 másodperc
- Valós idejű statisztikák: SZP (szó/perc), pontosság, idő, karakterszám
- Egyéni szöveg beillesztése
- Sötét, minimalista dizájn
- Reszponzív – mobilon is működik

## Technológiák

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- CSS Modules

## Telepítés és futtatás

### Előfeltételek
- Node.js 18+
- npm

### Lépések

# Repository klónozása
git clone https://github.com/bcbeco/gepeles-teszt.git

# Mappába lépés
cd gepeles-teszt

# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev

Az alkalmazás elérhető lesz a `http://localhost:5173` címen.

## Projekt struktúra
```plaintext
src/
├── components/
│   └── TypingSpeedTest/
│       ├── index.jsx                  # Fő komponens
│       ├── TypingSpeedTest.module.css # Stílusok
│       ├── constants.js               # Szövegek és beállítások
│       └── utils.js                   # Segédfüggvények
├── App.jsx
└── main.jsx
```

## Használat

1. Válassz nehézségi szintet: **könnyű / közepes / nehéz**
2. Válassz időkorlátot: **30s / 60s / 120s**
3. Kattints a szövegterületre és kezdj el gépelni
4. Az első leütés után 3 másodperces visszaszámlálás indul
5. Gépeld le a szöveget a lehető leggyorsabban és pontosabban
6. Az idő lejártával látod az eredményedet

## Licenc

MIT License – szabadon felhasználható és módosítható.