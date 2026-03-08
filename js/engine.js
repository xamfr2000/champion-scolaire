/* ================================================================
   Champion Scolaire — Moteur de quiz partagé
   Gère : profils, niveaux, XP, timer, gamification, sauvegarde, chat virtuel
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
  return 'champion_' + currentProfile.id + '_' + subject;
}

function setProfile(profileId) {
  currentProfile = PROFILES.find(p => p.id === profileId);
  localStorage.setItem('champion_lastProfile', profileId);
}

function getLastProfile() {
  return localStorage.getItem('champion_lastProfile');
}

// ================================================================
// NIVEAUX (gardés pour compatibilité)
// ================================================================
const LEVELS = [
  { min: 0,    max: 100,  name: 'Apprenti',      icon: '🌱' },
  { min: 100,  max: 300,  name: 'Explorateur',    icon: '🌿' },
  { min: 300,  max: 600,  name: 'Confirmé',       icon: '⭐' },
  { min: 600,  max: 1000, name: 'Expert',          icon: '🌟' },
  { min: 1000, max: 1500, name: 'Maître',          icon: '🏆' },
  { min: 1500, max: 2200, name: 'Grand Maître',    icon: '👑' },
  { min: 2200, max: 9999, name: 'Champion !',      icon: '🎯' }
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
  } catch(e) { return newSave(); }
}

function newSave() {
  return { xp: 0, sessions: 0, totalQ: 0, totalCorrect: 0, bestPct: 0, stats: {} };
}

function saveGame(subject, data) {
  localStorage.setItem(getProfileKey(subject), JSON.stringify(data));
  syncToCloud().catch(function() {});
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

function weightedPick(pool, excludeSet) {
  let filtered = excludeSet && excludeSet.size > 0
    ? pool.filter(i => !excludeSet.has(i._key))
    : pool;
  if (filtered.length === 0) filtered = pool; // all asked → allow repeats
  const total = filtered.reduce((s, i) => s + i.w, 0);
  let r = Math.random() * total;
  for (const item of filtered) { r -= item.w; if (r <= 0) return item; }
  return filtered[filtered.length - 1];
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

// ================================================================
// CHAT VIRTUEL (Tamagotchi)
// ================================================================
const CAT_ACTIONS = [
  { id: 'feed',   icon: '🍣', name: 'Nourrir', cost: 8,  stat: 'hunger',      boost: 30, msg: 'Miam miam !' },
  { id: 'cuddle', icon: '🤗', name: 'Câliner', cost: 8,  stat: 'happiness',   boost: 30, msg: 'Ronron...' },
  { id: 'bath',   icon: '🛁', name: 'Laver',   cost: 8,  stat: 'cleanliness', boost: 30, msg: 'Tout propre !' },
  { id: 'sleep',  icon: '😴', name: 'Dormir',  cost: 8,  stat: 'energy',      boost: 30, msg: 'Zzz...' },
  { id: 'play',   icon: '🧶', name: 'Jouer',   cost: 12, stat: 'happiness',   boost: 25, msg: 'Miaou !' }
];

const CAT_STAT_ICONS = { hunger: '🍣', happiness: '💕', cleanliness: '🛁', energy: '⚡' };
const CAT_STAT_NAMES = { hunger: 'Faim', happiness: 'Bonheur', cleanliness: 'Propreté', energy: 'Énergie' };
const CAT_DECAY_PER_HOUR = 3.3;

function loadCat(profileId) {
  const id = profileId || (currentProfile && currentProfile.id);
  if (!id) return newCat();
  try {
    const raw = JSON.parse(localStorage.getItem('champion_' + id + '_cat'));
    if (raw) { applyCatDecay(raw); return raw; }
  } catch(e) {}
  return newCat();
}

function newCat() {
  return { hunger: 80, happiness: 80, cleanliness: 80, energy: 80, coins: 0, lastUpdate: Date.now() };
}

function saveCat(cat, profileId) {
  const id = profileId || (currentProfile && currentProfile.id);
  if (!id) return;
  cat.lastUpdate = Date.now();
  localStorage.setItem('champion_' + id + '_cat', JSON.stringify(cat));
}

function applyCatDecay(cat) {
  const hours = (Date.now() - (cat.lastUpdate || Date.now())) / 3600000;
  const decay = Math.floor(hours * CAT_DECAY_PER_HOUR);
  if (decay > 0) {
    ['hunger','happiness','cleanliness','energy'].forEach(s => {
      cat[s] = Math.max(0, (cat[s] || 0) - decay);
    });
    cat.lastUpdate = Date.now();
  }
}

function getCatMood(cat) {
  const avg = ((cat.hunger||0) + (cat.happiness||0) + (cat.cleanliness||0) + (cat.energy||0)) / 4;
  if (avg > 80) return 'ecstatic';
  if (avg > 60) return 'happy';
  if (avg > 40) return 'content';
  if (avg > 20) return 'sad';
  return 'crying';
}

const CAT_MOOD_EMOJI = { ecstatic: '😻', happy: '😺', content: '😊', sad: '🥺', crying: '😿' };

function getCatMessage(cat) {
  const mood = getCatMood(cat);
  const stats = { hunger: cat.hunger||0, happiness: cat.happiness||0, cleanliness: cat.cleanliness||0, energy: cat.energy||0 };
  const lowest = Object.entries(stats).sort((a,b) => a[1] - b[1])[0];
  if (mood === 'ecstatic') return ['Ronron ! Je suis trop bien !', 'Je t\'adore !', 'Mrrr... le bonheur !'][Math.floor(Math.random()*3)];
  if (mood === 'happy') return ['Je suis content !', 'Miaou !', 'C\'est chouette !'][Math.floor(Math.random()*3)];
  if (mood === 'content') return 'Ça va ! Fais un quiz pour gagner des pièces !';
  const msgs = {
    hunger: mood === 'sad' ? 'Mon ventre gargouille...' : 'J\'ai tellement faim...',
    happiness: mood === 'sad' ? 'Je m\'ennuie un peu...' : 'Je suis triste... câline-moi !',
    cleanliness: mood === 'sad' ? 'Un bain me ferait du bien...' : 'Je suis tout sale...',
    energy: mood === 'sad' ? 'Je suis fatigué...' : 'J\'ai plus d\'énergie...'
  };
  return msgs[lowest[0]];
}

function doCatAction(cat, actionId) {
  const action = CAT_ACTIONS.find(a => a.id === actionId);
  if (!action || (cat.coins || 0) < action.cost) return null;
  cat.coins -= action.cost;
  cat[action.stat] = Math.min(100, (cat[action.stat] || 0) + action.boost);
  saveCat(cat);
  return action;
}

function earnCoins(cat, amount) {
  cat.coins = (cat.coins || 0) + amount;
  saveCat(cat);
}

function grantCatFriend(cat) {
  cat.friendUntil = Date.now() + 3 * 24 * 3600000; // 3 jours
  saveCat(cat);
}

function hasCatFriend(cat) {
  return cat.friendUntil && Date.now() < cat.friendUntil;
}

function getFriendSVG() {
  return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
  '<ellipse cx="60" cy="85" rx="30" ry="20" fill="#C8B0FF"/>' +
  '<circle cx="60" cy="50" r="28" fill="#C8B0FF"/>' +
  '<polygon points="38,30 30,5 50,22" fill="#C8B0FF"/>' +
  '<polygon points="40,27 34,12 48,22" fill="#E8D0FF"/>' +
  '<polygon points="82,30 90,5 70,22" fill="#C8B0FF"/>' +
  '<polygon points="80,27 86,12 72,22" fill="#E8D0FF"/>' +
  '<ellipse cx="48" cy="47" rx="5" ry="6" fill="#3E3E3E"/>' +
  '<ellipse cx="72" cy="47" rx="5" ry="6" fill="#3E3E3E"/>' +
  '<circle cx="50" cy="44" r="2" fill="white"/>' +
  '<circle cx="74" cy="44" r="2" fill="white"/>' +
  '<path d="M57,58 L60,62 L63,58 Z" fill="#FF9EB5"/>' +
  '<path d="M52,66 Q60,73 68,66" stroke="#3E3E3E" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
  '</svg>';
}

function getCatSVG() {
  return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
  '<path class="cat-tail" d="M155,155 C175,135 185,105 170,90" stroke="#FFD699" stroke-width="10" fill="none" stroke-linecap="round"/>' +
  '<ellipse cx="100" cy="160" rx="50" ry="35" fill="#FFD699"/>' +
  '<ellipse cx="72" cy="190" rx="16" ry="8" fill="#FFCC80"/>' +
  '<ellipse cx="128" cy="190" rx="16" ry="8" fill="#FFCC80"/>' +
  '<circle cx="100" cy="90" r="48" fill="#FFD699"/>' +
  '<polygon points="62,55 50,15 85,42" fill="#FFD699"/>' +
  '<polygon points="65,50 56,24 80,42" fill="#FFB5C5"/>' +
  '<polygon points="138,55 150,15 115,42" fill="#FFD699"/>' +
  '<polygon points="135,50 144,24 120,42" fill="#FFB5C5"/>' +
  '<g class="cat-eyes-happy"><ellipse cx="78" cy="85" rx="9" ry="10" fill="#3E3E3E"/><ellipse cx="122" cy="85" rx="9" ry="10" fill="#3E3E3E"/><circle cx="82" cy="81" r="3" fill="white"/><circle cx="126" cy="81" r="3" fill="white"/></g>' +
  '<g class="cat-eyes-ecstatic"><path d="M69,85 Q78,75 87,85" stroke="#3E3E3E" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M113,85 Q122,75 131,85" stroke="#3E3E3E" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>' +
  '<g class="cat-eyes-sad"><ellipse cx="78" cy="88" rx="9" ry="6" fill="#3E3E3E"/><ellipse cx="122" cy="88" rx="9" ry="6" fill="#3E3E3E"/><circle cx="81" cy="86" r="2" fill="white"/><circle cx="125" cy="86" r="2" fill="white"/></g>' +
  '<g class="cat-eyes-crying"><ellipse cx="78" cy="88" rx="9" ry="6" fill="#3E3E3E"/><ellipse cx="122" cy="88" rx="9" ry="6" fill="#3E3E3E"/><ellipse cx="72" cy="98" rx="3" ry="5" fill="#87CEEB" opacity="0.7" class="cat-tear"/><ellipse cx="128" cy="98" rx="3" ry="5" fill="#87CEEB" opacity="0.7" class="cat-tear"/></g>' +
  '<path d="M97,100 L100,105 L103,100 Z" fill="#FF9EB5"/>' +
  '<path class="cat-mouth-happy" d="M91,109 Q95,115 100,109 Q105,115 109,109" stroke="#3E3E3E" stroke-width="2" fill="none" stroke-linecap="round"/>' +
  '<path class="cat-mouth-ecstatic" d="M88,107 Q100,120 112,107" stroke="#3E3E3E" stroke-width="2" fill="none" stroke-linecap="round"/>' +
  '<path class="cat-mouth-content" d="M94,110 L106,110" stroke="#3E3E3E" stroke-width="2" stroke-linecap="round"/>' +
  '<path class="cat-mouth-sad" d="M92,113 Q100,107 108,113" stroke="#3E3E3E" stroke-width="2" fill="none" stroke-linecap="round"/>' +
  '<ellipse class="cat-blush" cx="62" cy="100" rx="9" ry="5" fill="#FFB5C5" opacity="0.35"/>' +
  '<ellipse class="cat-blush" cx="138" cy="100" rx="9" ry="5" fill="#FFB5C5" opacity="0.35"/>' +
  '<line x1="38" y1="95" x2="68" y2="100" stroke="#DDD" stroke-width="1.5"/>' +
  '<line x1="38" y1="108" x2="68" y2="105" stroke="#DDD" stroke-width="1.5"/>' +
  '<line x1="132" y1="100" x2="162" y2="95" stroke="#DDD" stroke-width="1.5"/>' +
  '<line x1="132" y1="105" x2="162" y2="108" stroke="#DDD" stroke-width="1.5"/>' +
  '</svg>';
}

// ================================================================
// SYNCHRONISATION FIREBASE
// ================================================================
var FIREBASE_URL = 'https://champion-scolaire-837f7-default-rtdb.europe-west1.firebasedatabase.app';
var ALL_SUBJECTS = ['conjugaison', 'grammaire', 'calcul', 'orthographe'];

async function syncToCloud() {
  if (!currentProfile) return false;

  try {
    // 1. Load remote data first
    var getRes = await fetch(FIREBASE_URL + '/champions/' + currentProfile.id + '.json');
    var remoteData = getRes.ok ? (await getRes.json()) || {} : {};

    // 2. Build merged data: keep the best of local vs remote
    var data = {};
    ALL_SUBJECTS.forEach(function(s) {
      var key = 'champion_' + currentProfile.id + '_' + s;
      var local;
      try { local = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      if (!local) local = newSave();
      var remote = remoteData[s];

      // Keep whichever has more questions answered
      if (!remote || (local.totalQ || 0) >= (remote.totalQ || 0)) {
        data[s] = local;
      } else {
        data[s] = remote;
      }
      // Merge stats: keep best per combo
      if (remote && remote.stats && local.stats) {
        Object.keys(remote.stats).forEach(function(k) {
          if (!data[s].stats[k] || remote.stats[k].asked > data[s].stats[k].asked) {
            data[s].stats[k] = remote.stats[k];
          }
        });
      }
    });

    // Merge cat: keep highest coins
    var localCat;
    try { localCat = JSON.parse(localStorage.getItem('champion_' + currentProfile.id + '_cat')); } catch(e) {}
    if (!localCat) localCat = newCat();
    var remoteCat = remoteData.cat || {};
    data.cat = (localCat.coins || 0) >= (remoteCat.coins || 0) ? localCat : remoteCat;
    // Keep friend status from either
    if (remoteCat.friendUntil && (!data.cat.friendUntil || remoteCat.friendUntil > data.cat.friendUntil)) {
      data.cat.friendUntil = remoteCat.friendUntil;
    }

    data.lastSync = new Date().toISOString();

    // 3. Write merged data
    var res = await fetch(FIREBASE_URL + '/champions/' + currentProfile.id + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      // Also update localStorage with merged data
      ALL_SUBJECTS.forEach(function(s) {
        localStorage.setItem('champion_' + currentProfile.id + '_' + s, JSON.stringify(data[s]));
      });
      localStorage.setItem('champion_' + currentProfile.id + '_cat', JSON.stringify(data.cat));
      localStorage.setItem('champion_lastSync', new Date().toISOString());
      updateSyncStatus(true);
      return true;
    }
    window._lastSyncError = 'HTTP ' + res.status;
  } catch(e) {
    window._lastSyncError = e.message || String(e);
    console.warn('Sync cloud échoué:', e);
  }
  return false;
}

async function loadFromCloud(profileId) {
  try {
    var res = await fetch(FIREBASE_URL + '/champions/' + profileId + '.json');
    if (!res.ok) return false;
    var remoteData = await res.json();
    if (!remoteData) return false;

    ALL_SUBJECTS.forEach(function(s) {
      var key = 'champion_' + profileId + '_' + s;
      var local;
      try { local = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      var remote = remoteData[s];

      if (!remote) return;
      if (!local || (remote.totalQ || 0) > (local.totalQ || 0)) {
        localStorage.setItem(key, JSON.stringify(remote));
      } else if (local && remote) {
        Object.keys(remote.stats || {}).forEach(function(k) {
          var rs = remote.stats[k];
          if (!local.stats[k]) {
            local.stats[k] = rs;
          } else if (rs.asked > local.stats[k].asked) {
            local.stats[k] = rs;
          }
        });
        localStorage.setItem(key, JSON.stringify(local));
      }
    });

    // Fusionner le chat
    if (remoteData.cat) {
      var catKey = 'champion_' + profileId + '_cat';
      var localCat;
      try { localCat = JSON.parse(localStorage.getItem(catKey)); } catch(e) {}
      if (!localCat || (remoteData.cat.coins || 0) > (localCat.coins || 0)) {
        localStorage.setItem(catKey, JSON.stringify(remoteData.cat));
      }
    }

    localStorage.setItem('champion_lastSync', new Date().toISOString());
    return true;
  } catch(e) {
    window._lastSyncError = 'load: ' + (e.message || String(e));
    console.warn('Chargement cloud échoué:', e);
  }
  return false;
}

function updateSyncStatus(success) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  if (success) {
    const last = localStorage.getItem('champion_lastSync');
    const d = last ? new Date(last) : null;
    const timeStr = d ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
    el.textContent = 'Synchro OK ' + timeStr;
    el.style.color = '#27ae60';
  } else {
    el.textContent = '📱 Local uniquement';
    el.style.color = '#888';
  }
}
