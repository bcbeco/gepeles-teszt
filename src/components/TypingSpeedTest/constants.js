// ============================================================
// constants.js – Állandó adatok és beállítások
// ============================================================

// Magyar gyakorló szövegek nehézségi szint szerint
export const TEXTS = {

  // Könnyű szövegek – rövid mondatok, egyszerű szavak
  easy: [
    "A nap nyugaton nyugszik és keleten kel fel. A madarak magasan repülnek a kék égen. A kutyák gyorsan futnak, a macskák egész nap alszanak. Enni és inni kell ahhoz, hogy egészségesek maradjunk.",
    "Reggel könyvet olvas a tó partján. A halak kiugranak a vízből, ha fúj a szél. Biciklivel lemegy a dombon és az öreg tölgyfa mellett parkol le minden egyes nap.",
    "Az eső sötét felhőkből hull az égből. A gyerekek csizmát húznak és pocsolyákban ugrálnak. A kutya lerázza magáról a vizet és befut a meleg házba megszáradni.",
  ],

  // Közepes szövegek – összetettebb mondatok, változatos szókincs
  medium: [
    "A technológia gyökeresen megváltoztatta az emberek kommunikációját és az információhoz való hozzáférést. A modern okostelefonok lehetővé teszik, hogy azonnal kapcsolatba lépjünk barátainkkal és családunkkal a világ bármely pontján.",
    "A rendszeres olvasás javítja a szókincset és az agy működését. A könyvek különböző világokba és szemszögekbe röpítik az olvasót, fejlesztve az empátiát és a kritikus gondolkodást, amelyek értékesek az élet minden területén.",
    "A természetben töltött idő bizonyítottan csökkenti a stresszt és javítja a közérzetet. Az erdei séták, a hegymászás vagy akár egy egyszerű kerti pihenő is sokat segíthet a mindennapok fáradalmainak leküzdésében.",
  ],

  // Nehéz szövegek – szakmai kifejezések, hosszú és összetett mondatszerkezetek
  hard: [
    "A kvantumösszefonódás nem-lokális korrelációkat mutat a részecskék között, megkérdőjelezve az okozatiság és a lokalitás klasszikus felfogását – egy jelenséget, amelyet Einstein híressé vált megfogalmazásával kísérteties távolhatásnak nevezett.",
    "A fotoszintézis rendkívül hatékony biokémiai kaszkádot vezényel: a klorofillmolekulák fotonokat nyelnek el, gerjesztve az elektronokat, amelyek az elektrontranszport-láncon haladnak át, végül adenozin-trifoszfátot szintetizálva.",
    "Az idegi plaszticitás biztosítja az agy figyelemre méltó alkalmazkodóképességét az emberi élet során, bár a szinaptikus megerősítési folyamatok hatékonysága az életkor előrehaladtával fokozatosan csökken.",
  ],
};

// Elérhető időkorlát opciók másodpercben
export const TIME_OPTIONS = [30, 60, 120];

// Elérhető nehézségi szintek
export const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];

// Nehézségi szintek magyar megnevezése (megjelenítéshez)
export const DIFFICULTY_LABELS = {
  easy: "könnyű",
  medium: "közepes",
  hard: "nehéz",
};