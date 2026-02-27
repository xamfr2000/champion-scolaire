/* ================================================================
   Champion Scolaire — Moteur de quiz partagé
   Gère : profils, niveaux, XP, timer, gamification, sauvegarde
   ================================================================ */

// ================================================================
// PROFILS
// ================================================================
const PROFILES = [
  { id: 'estelle', name: 'Estelle', avatar: '👧' },
  { id: 'zelie',   name: 'Zélie',   avatar: '👧🏻' }
];

let currentProfile = null;

function getProfileKey(subject) {
  return `champion_${currentProfile.id}_${subject}`;
}

function setProfile(profileId) {
  currentProfile = PROFILES.find(p => p.id === profileId);
  localStorage.setItem('champion_lastProfile', profileId);
}

function getLastProfile() {
  return localStorage.getItem('champion_lastProfile');
}

// ================================================================
// NIVEAUX
// ================================================================
const LEVELS = [
  { min: 0,    max: 100,  name: 'Apprenti',          icon: '🌱' },
  { min: 100,  max: 300,  name: 'Explorateur',        icon: '🌿' },
  { min: 300,  max: 600,  name: 'Conjugueur Junior',  icon: '⭐' },
  { min: 600,  max: 1000, name: 'Conjugueur',         icon: '🌟' },
  { min: 1000, max: 1500, name: 'Expert des Verbes',  icon: '🏆' },
  { min: 1500, max: 2200, name: 'Maître des Verbes',  icon: '👑' },
  { min: 2200, max: 9999, name: 'Champion !',         icon: '🎯' }
];

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
}

// ================================================================
// SAUVEGARDE
// ================================================================
function loadSave(subject) {
  try {
    const raw = JSON.parse(localStorage.getItem(getProfileKey(subject)));
    if (!raw) return newSave();
    if (!raw.stats) raw.stats = {};
    return raw;
  } catch { return newSave(); }
}

function newSave() {
  return { xp: 0, sessions: 0, totalQ: 0, totalCorrect: 0, bestPct: 0, stats: {} };
}

function saveGame(subject, data) {
  localStorage.setItem(getProfileKey(subject), JSON.stringify(data));
}

// ================================================================
// STATS PAR COMBINAISON
// ================================================================
function comboKey(parts) { return parts.join('|'); }

function getStat(stats, key) {
  return stats[key] || { asked: 0, wrong: 0 };
}

function recordAnswer(stats, key, wasCorrect) {
  if (!stats[key]) stats[key] = { asked: 0, wrong: 0 };
  stats[key].asked++;
  if (!wasCorrect) stats[key].wrong++;
}

function getErrorCombos(stats) {
  return Object.entries(stats)
    .filter(([, s]) => s.wrong > 0)
    .map(([key, s]) => ({ key, stat: s, rate: s.wrong / s.asked }))
    .sort((a, b) => b.rate - a.rate);
}

// ================================================================
// UTILITAIRES
// ================================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weightedPick(pool) {
  const total = pool.reduce((s, i) => s + i.w, 0);
  let r = Math.random() * total;
  for (const item of pool) { r -= item.w; if (r <= 0) return item; }
  return pool[pool.length - 1];
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function norm(s) {
  return (s || '').toLowerCase().trim()
    .replace(/['']/g, "'").replace(/\s+/g, ' ')
    .replace(/^j'/, 'je ');
}

// ================================================================
// EXPORT / IMPORT
// ================================================================
function doExport(subject, gameData) {
  const payload = { profile: currentProfile.id, subject, data: gameData };
  return 'CHAMP1:' + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

function doImport(code) {
  let json;
  if (code.startsWith('CHAMP1:')) {
    json = decodeURIComponent(escape(atob(code.slice(7))));
  } else if (code.startsWith('CONJ1:')) {
    // Rétro-compatibilité avec l'ancien format
    json = decodeURIComponent(escape(atob(code.slice(6))));
    const data = JSON.parse(json);
    if (!data.stats) data.stats = {};
    return { profile: null, subject: 'conjugaison', data };
  } else {
    json = code;
  }
  const parsed = JSON.parse(json);
  if (!parsed.data || typeof parsed.data.xp !== 'number') throw new Error('Format invalide');
  if (!parsed.data.stats) parsed.data.stats = {};
  return parsed;
}
