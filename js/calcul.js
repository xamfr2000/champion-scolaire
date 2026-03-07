/* ================================================================
   Champion Scolaire — Données et logique CALCUL
   Basé sur les évaluations CM2 + extrapolations
   ================================================================ */

const CALC_TYPES = {
  mental:     { nom: "Calcul mental",  icon: "🧠" },
  conversion: { nom: "Conversions",    icon: "📏" },
  operation:  { nom: "Opérations",     icon: "🔢" }
};

// ================================================================
// UTILITAIRES
// ================================================================
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function round(n, d) { return parseFloat(n.toFixed(d)); }
function normNumber(s) {
  if (typeof s === 'number') return s;
  return parseFloat((s || '').replace(',', '.').replace(/\s/g, ''));
}
function checkCalcAnswer(expected, userInput) {
  const user = normNumber(userInput);
  if (isNaN(user)) return false;
  return Math.abs(user - expected) < 0.005;
}
function formatNum(n) {
  const s = String(n);
  return s.replace('.', ',');
}

// ================================================================
// CALCUL MENTAL — générateurs
// ================================================================
const MENTAL_GENS = [
  // Doubles
  { type:'double', w:1.5, gen() { const n = randomInt(25, 499); return { question:`Le double de ${n}`, reponse: n*2 }; }},
  // Triples
  { type:'triple', w:1.5, gen() { const n = randomInt(20, 340); return { question:`Le triple de ${n}`, reponse: n*3 }; }},
  // Moitiés
  { type:'moitie', w:1.5, gen() { const n = randomInt(25, 499)*2; return { question:`La moitié de ${n}`, reponse: n/2 }; }},
  // Quarts
  { type:'quart', w:1.3, gen() { const n = randomInt(10, 250)*4; return { question:`Le quart de ${n}`, reponse: n/4 }; }},
  // ×10, ×100, ×1000
  { type:'mult10', w:1.0, gen() {
    const m = [10,100,1000][randomInt(0,2)];
    const d = randomInt(0,2); const n = round(randomInt(1,99) + Math.random(), d);
    return { question:`${formatNum(n)} × ${m}`, reponse: round(n*m, Math.max(0, d - (m===10?1:m===100?2:3))) };
  }},
  // Tables 7,8,9
  { type:'table', w:1.2, gen() { const a = randomInt(7,9); const b = randomInt(3,12); return { question:`${a} × ${b}`, reponse: a*b }; }},
  // Additions mentales
  { type:'add', w:0.8, gen() { const a = randomInt(100,999); const b = randomInt(100,999); return { question:`${a} + ${b}`, reponse: a+b }; }},
  // Soustractions mentales
  { type:'sub', w:0.8, gen() { const a = randomInt(200,999); const b = randomInt(50, a-1); return { question:`${a} - ${b}`, reponse: a-b }; }},
  // Compléments à 100
  { type:'comp100', w:1.0, gen() { const n = randomInt(1,99); return { question:`Combien pour aller de ${n} à 100 ?`, reponse: 100-n }; }},
  // Compléments à 1000
  { type:'comp1000', w:0.8, gen() { const n = randomInt(1,9)*100 + randomInt(0,9)*10; return { question:`Combien pour aller de ${n} à 1 000 ?`, reponse: 1000-n }; }},
];

// ================================================================
// CONVERSIONS — questions statiques basées sur évaluations
// ================================================================
const CONV_QS = [
  // Longueurs
  { question:"73 mm = ? m",      reponse:0.073,  unite:"m",   priority:true },
  { question:"9,72 km = ? dam",  reponse:972,    unite:"dam", priority:true },
  { question:"58 m = ? km",      reponse:0.058,  unite:"km",  priority:true },
  { question:"8 600 m = ? km",   reponse:8.6,    unite:"km",  priority:true },
  { question:"540 mm = ? m",     reponse:0.54,   unite:"m",   priority:true },
  { question:"3,51 km = ? dam",  reponse:351,    unite:"dam", priority:true },
  { question:"45 cm = ? m",      reponse:0.45,   unite:"m",   priority:false },
  { question:"3,2 km = ? m",     reponse:3200,   unite:"m",   priority:false },
  { question:"1 200 mm = ? m",   reponse:1.2,    unite:"m",   priority:false },
  { question:"6,3 dam = ? m",    reponse:63,     unite:"m",   priority:false },
  { question:"250 cm = ? m",     reponse:2.5,    unite:"m",   priority:false },
  { question:"0,4 km = ? m",     reponse:400,    unite:"m",   priority:false },
  // Masses
  { question:"5,1 t = ? kg",     reponse:5100,   unite:"kg",  priority:true },
  { question:"150 hg = ? kg",    reponse:15,     unite:"kg",  priority:true },
  { question:"306 kg = ? t",     reponse:0.306,  unite:"t",   priority:true },
  { question:"2 500 g = ? kg",   reponse:2.5,    unite:"kg",  priority:false },
  { question:"850 g = ? kg",     reponse:0.85,   unite:"kg",  priority:false },
  { question:"3,7 kg = ? g",     reponse:3700,   unite:"g",   priority:false },
  { question:"45 dag = ? kg",    reponse:4.5,    unite:"kg",  priority:false },
  // Capacités
  { question:"0,3 dL = ? L",     reponse:0.03,   unite:"L",   priority:true },
  { question:"0,06 hL = ? L",    reponse:6,      unite:"L",   priority:true },
  { question:"7,5 L = ? cL",     reponse:750,    unite:"cL",  priority:false },
  { question:"0,5 L = ? mL",     reponse:500,    unite:"mL",  priority:false },
  { question:"4 500 mL = ? L",   reponse:4.5,    unite:"L",   priority:false },
  { question:"25 cL = ? L",      reponse:0.25,   unite:"L",   priority:false },
  { question:"1,2 daL = ? L",    reponse:12,     unite:"L",   priority:false },
];

// ================================================================
// OPÉRATIONS — générateurs
// ================================================================
const OP_GENS = [
  // Multiplication entier × 1 chiffre
  { type:'mult1', w:1.2, gen() { const a = randomInt(12,99); const b = randomInt(3,9); return { question:`${a} × ${b}`, reponse: a*b }; }},
  // Multiplication 2 chiffres × 2 chiffres
  { type:'mult2', w:1.0, gen() { const a = randomInt(12,50); const b = randomInt(12,50); return { question:`${a} × ${b}`, reponse: a*b }; }},
  // Addition décimaux
  { type:'add_dec', w:1.0, gen() {
    const a = round(randomInt(10,200) + randomInt(1,99)/100, 2);
    const b = round(randomInt(10,200) + randomInt(1,99)/100, 2);
    return { question:`${formatNum(a)} + ${formatNum(b)}`, reponse: round(a+b, 2) };
  }},
  // Soustraction décimaux
  { type:'sub_dec', w:1.0, gen() {
    const a = round(randomInt(50,300) + randomInt(1,99)/100, 2);
    const b = round(randomInt(10, Math.floor(a)-1) + randomInt(1,99)/100, 2);
    return { question:`${formatNum(a)} - ${formatNum(b)}`, reponse: round(a-b, 2) };
  }},
  // Multiplication par décimal simple
  { type:'mult_dec', w:1.2, gen() {
    const a = randomInt(5,50); const b = round(randomInt(1,99)/10, 1);
    return { question:`${a} × ${formatNum(b)}`, reponse: round(a*b, 1) };
  }},
  // Division simple
  { type:'div', w:1.0, gen() {
    const b = randomInt(2,12); const r = randomInt(3,50); const a = b * r;
    return { question:`${a} ÷ ${b}`, reponse: r };
  }},
];

// ================================================================
// GÉNÉRATION ET POOLS
// ================================================================
function generateCalcQ(calcType) {
  if (calcType === 'mental') {
    const gen = MENTAL_GENS[randomInt(0, MENTAL_GENS.length - 1)];
    const q = gen.gen();
    return { ...q, calcType: 'mental', subtype: gen.type, id: `mental_${gen.type}` };
  }
  if (calcType === 'conversion') {
    const q = CONV_QS[randomInt(0, CONV_QS.length - 1)];
    return { ...q, calcType: 'conversion', subtype: 'conv', id: `conv_${CONV_QS.indexOf(q)}` };
  }
  if (calcType === 'operation') {
    const gen = OP_GENS[randomInt(0, OP_GENS.length - 1)];
    const q = gen.gen();
    return { ...q, calcType: 'operation', subtype: gen.type, id: `op_${gen.type}` };
  }
}

function calcComboKey(q) { return q.id; }

// Pick which type to ask, weighted by past errors
function pickCalcType(stats) {
  const types = ['mental', 'conversion', 'operation'];
  const pool = types.map(t => {
    let w = 1;
    Object.entries(stats).forEach(([key, s]) => {
      if (key.startsWith(t.substring(0, 4)) || key.startsWith(t.substring(0, 2))) {
        if (s.wrong > 0) w += s.wrong * 0.3;
      }
    });
    return { type: t, w };
  });
  const total = pool.reduce((s, i) => s + i.w, 0);
  let r = Math.random() * total;
  for (const item of pool) { r -= item.w; if (r <= 0) return item.type; }
  return pool[pool.length - 1].type;
}

// For revision mode, pick from error types
function pickCalcRevisionQ(stats) {
  const errors = getErrorCombos(stats);
  if (errors.length === 0) return generateCalcQ(['mental','conversion','operation'][randomInt(0,2)]);
  // Weight toward error types
  const pool = [];
  errors.forEach(e => {
    let calcType = 'mental';
    if (e.key.startsWith('conv')) calcType = 'conversion';
    else if (e.key.startsWith('op')) calcType = 'operation';
    pool.push({ calcType, w: 2 + e.rate * 3 });
  });
  // Add some random
  pool.push({ calcType: 'mental', w: 0.5 });
  pool.push({ calcType: 'conversion', w: 0.5 });
  pool.push({ calcType: 'operation', w: 0.5 });
  const picked = weightedPick(pool);
  return generateCalcQ(picked.calcType);
}
