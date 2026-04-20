// ============================================================
// index.jsx – A gépelési teszt fő komponense
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./TypingSpeedTest.module.css";
import { pickText, calcWpm, calcAccuracy } from "./utils";
import { TIME_OPTIONS, DIFFICULTY_OPTIONS, DIFFICULTY_LABELS } from "./constants";

export default function TypingSpeedTest() {

  // ── Beállítások ──
  const [difficulty, setDifficulty] = useState("medium");   // nehézségi szint
  const [timeLimit, setTimeLimit]   = useState(60);          // időkorlát másodpercben
  const [customText, setCustomText] = useState("");           // egyéni szöveg (ha van)

  // ── Játékállapot ──
  const [passage,  setPassage]  = useState(() => pickText("medium", ""));
  const [typed,    setTyped]    = useState([]);        // leütött karakterek tömbje
  const [started,  setStarted]  = useState(false);     // elindult-e a timer
  const [done,     setDone]     = useState(false);     // lejárt-e az idő
  const [countdown, setCountdown] = useState(0);       // visszaszámlálás (3-2-1)
  const [timeLeft, setTimeLeft] = useState(60);        // hátralévő másodpercek

  // ── Statisztikák ──
  const [wpm,      setWpm]      = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // ── Modal ──
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDraft,     setCustomDraft]     = useState("");

  // A countdown key változtatásával kényszerítjük az animáció újrajátszását
  const [countdownKey, setCountdownKey] = useState(0);

  // ── Refek (timer kezeléshez és input fókuszhoz) ──
  const inputRef       = useRef(null);
  const timerRef       = useRef(null);
  const countdownRef   = useRef(null);
  const timeLimitRef   = useRef(timeLimit);
  const startedRef     = useRef(false);
  const doneRef        = useRef(false);

  // A timeLimitRef mindig a legfrissebb értéket tartja
  timeLimitRef.current = timeLimit;

  // ── Statisztikák újraszámítása ──
  const recalcStats = useCallback((typedArr, tLeft, tLim) => {
    const correct = typedArr.filter((c, i) => c === passage[i]).length;
    const elapsed  = tLim - tLeft;
    setWpm(calcWpm(correct, elapsed));
    setAccuracy(calcAccuracy(typedArr, passage));
  }, [passage]);

  // ── Reset: mindent visszaállít alapállapotba ──
  const reset = useCallback((diff, tl, custom) => {
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);
    setPassage(pickText(diff, custom));
    setTyped([]);
    setStarted(false);
    setDone(false);
    setCountdown(0);
    setTimeLeft(tl);
    setWpm(0);
    setAccuracy(100);
    startedRef.current = false;
    doneRef.current    = false;
    // Kis késleltetés után fókuszáljuk az inputot
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Kezdeti betöltéskor egyszer resetelünk
  useEffect(() => { reset(difficulty, timeLimit, customText); }, []);

  // ── Visszaszámlálás utáni gépelési timer indítása ──
  const startTypingTimer = useCallback((tl) => {
    setStarted(true);
    startedRef.current = true;
    let left = tl;
    timerRef.current = setInterval(() => {
      left--;
      setTimeLeft(left);
      // Az aktuális typed tömb alapján frissítjük a statisztikát
      setTyped(prev => {
        recalcStats(prev, left, tl);
        return prev;
      });
      if (left <= 0) {
        clearInterval(timerRef.current);
        setDone(true);
        doneRef.current = true;
      }
    }, 1000);
  }, [recalcStats]);

  // ── Visszaszámlálás (3-2-1) az első leütés után ──
  const beginCountdown = useCallback((tl) => {
    let c = 3;
    setCountdown(c);
    setCountdownKey(k => k + 1);
    countdownRef.current = setInterval(() => {
      c--;
      if (c <= 0) {
        clearInterval(countdownRef.current);
        setCountdown(0);
        startTypingTimer(tl);
      } else {
        setCountdown(c);
        setCountdownKey(k => k + 1);
      }
    }, 1000);
  }, [startTypingTimer]);

  // ── Billentyűleütés kezelése ──
  const handleKeyDown = useCallback((e) => {
    // Ha vége van a tesztnek vagy épp visszaszámlálás folyik, nem csinálunk semmit
    if (doneRef.current || countdown > 0) return;

    const key = e.key;

    if (key === "Backspace") {
      // Törlés: az utolsó karakter eltávolítása
      setTyped(prev => {
        const next = prev.slice(0, -1);
        if (startedRef.current) recalcStats(next, timeLimitRef.current, timeLimitRef.current);
        return next;
      });
    } else if (key.length === 1) {
      setTyped(prev => {
        // Ha már elértük a szöveg végét, nem fogadunk több karaktert
        if (prev.length >= passage.length) return prev;
        // Az első leütés elindítja a visszaszámlálást
        if (!startedRef.current) {
          beginCountdown(timeLimitRef.current);
          return prev;
        }
        const next = [...prev, key];
        recalcStats(next, timeLimitRef.current - 1, timeLimitRef.current);
        return next;
      });
    }
    e.preventDefault();
  }, [countdown, passage, beginCountdown, recalcStats]);

  // Az event listener felcsatolása és eltávolítása
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Progress bar kiszámítása ──
  const progressPct   = Math.round((timeLeft / timeLimit) * 100);
  // Szín: zöld → sárga → piros az idő csökkenésével
  const progressColor = progressPct > 50 ? "#8bb88a" : progressPct > 25 ? "#e6b450" : "#c0504a";

  // ── Eseménykezelők ──
  const handleDiff    = (d) => { setDifficulty(d); reset(d, timeLimit, customText); };
  const handleTime    = (t) => { setTimeLimit(t);  reset(difficulty, t, customText); };
  const handleRestart = ()  => reset(difficulty, timeLimit, customText);

  const applyCustom = () => {
    const val = customDraft.trim();
    const text = val.length >= 20 ? val : "";
    setCustomText(text);
    setShowCustomModal(false);
    reset(difficulty, timeLimit, text);
  };

  const clearCustom = () => {
    setCustomText("");
    setCustomDraft("");
    setShowCustomModal(false);
    reset(difficulty, timeLimit, "");
  };

  // ── Render ──
  return (
    <div className={styles.root} onClick={() => inputRef.current?.focus()}>

      {/* Fejléc */}
      <div className={styles.header}>
        <div className={styles.title}>gépelés<span>.</span>teszt</div>
        <div style={{ fontSize: 12, color: "#3a3a45", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {DIFFICULTY_LABELS[difficulty]} · {timeLimit}s
        </div>
      </div>

      {/* Vezérlőgombok: nehézség és időkorlát */}
      <div className={styles.controls}>
        {DIFFICULTY_OPTIONS.map(d => (
          <button
            key={d}
            className={`${styles.pill}${difficulty === d ? " " + styles.active : ""}`}
            onClick={() => handleDiff(d)}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
        <div className={styles.divider} />
        {TIME_OPTIONS.map(t => (
          <button
            key={t}
            className={`${styles.pill}${timeLimit === t ? " " + styles.active : ""}`}
            onClick={() => handleTime(t)}
          >
            {t}s
          </button>
        ))}
      </div>

      {/* Statisztikai négyzetek */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>SZP</div>
          <div className={`${styles.statValue}${wpm > 0 ? " " + styles.highlight : ""}`}>{wpm}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Pontosság</div>
          <div className={styles.statValue}>{accuracy}%</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Idő</div>
          <div className={`${styles.statValue}${timeLeft <= 10 && started ? " " + styles.highlight : ""}`}>
            {timeLeft}s
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Karakter</div>
          <div className={styles.statValue}>{typed.length}</div>
        </div>
      </div>

      {/* Időcsík */}
      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%`, background: progressColor }} />
      </div>

      {/* Szövegterület */}
      <div className={styles.textArea} onClick={() => inputRef.current?.focus()}>
        {/* Láthatatlan input – ez fogja a billentyűleütéseket */}
        <input ref={inputRef} className={styles.hiddenInput} readOnly />

        {/* A gyakorló szöveg karakterenként kirajzolva */}
        <div className={styles.passage}>
          {passage.split("").map((ch, i) => {
            let cls = styles.char;
            if (i < typed.length)    cls += " " + (typed[i] === ch ? styles.correct : styles.incorrect);
            else if (i === typed.length) cls += " " + styles.current;
            return (
              <span key={i} className={cls}>
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </div>

        {/* Visszaszámlálás fedőréteg */}
        {countdown > 0 && (
          <div className={styles.overlay}>
            <span className={styles.countdownNum} key={countdownKey}>{countdown}</span>
            <span style={{ fontSize: 13, color: "#4a4a55" }}>készülj…</span>
          </div>
        )}

        {/* Befejezés fedőréteg */}
        {done && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Lejárt az idő!</div>
            <div className={styles.overlaySub}>
              <span>{wpm} SZP</span>&nbsp;·&nbsp;<span>{accuracy}% pontosság</span>
            </div>
          </div>
        )}
      </div>

      {/* Újrakezdés és egyéni szöveg gombok */}
      <div className={styles.actions}>
        <button className={styles.btnRestart} onClick={handleRestart}>↺ Újrakezdés</button>
        <button className={styles.btnCustom}  onClick={() => setShowCustomModal(true)}>Egyéni szöveg</button>
      </div>

      {/* Segítség tipp */}
      <div className={styles.hint}>kattints a szövegre · kezdj el gépelni · backspace = törlés</div>

      {/* Egyéni szöveg modal */}
      {showCustomModal && (
        <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setShowCustomModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Egyéni szöveg</h3>
            <textarea
              autoFocus
              value={customDraft}
              onChange={e => setCustomDraft(e.target.value)}
              placeholder="Írd vagy illeszd be a saját szövegedet (min. 20 karakter)…"
            />
            <div className={styles.modalBtns}>
              <button onClick={clearCustom}>Alapértelmezett</button>
              <button className="primary" onClick={applyCustom}>Alkalmaz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}