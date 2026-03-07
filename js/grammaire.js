/* ================================================================
   Champion Scolaire — Données et logique GRAMMAIRE
   Basé sur les évaluations CM2 + extrapolations
   ================================================================ */

const GRAM_TYPES = {
  nature:    { nom: "Nature des mots",    icon: "🏷️" },
  fonction:  { nom: "Fonction des groupes", icon: "🔧" },
  pluriel:   { nom: "Pluriel des noms",   icon: "📚" },
  accord_pp: { nom: "Participe passé",    icon: "✍️" },
  accord_adj:{ nom: "Accord des adjectifs", icon: "🎨" }
};

const NATURES = ["nom commun","nom propre","verbe","adjectif","déterminant","pronom","adverbe","préposition","conjonction"];
const FONCTIONS = ["sujet","COD","COI","CC lieu","CC temps","CC manière","CDN","attribut du sujet","épithète"];

// ================================================================
// NATURE DES MOTS (choix multiples)
// ================================================================
const NATURE_QS = [
  { phrase:"Le chat dort sur le canapé.", mot:"chat", reponse:"nom commun", priority:true },
  { phrase:"Le chat dort sur le canapé.", mot:"dort", reponse:"verbe", priority:true },
  { phrase:"Le chat dort sur le canapé.", mot:"Le", reponse:"déterminant", priority:true },
  { phrase:"Le chat dort sur le canapé.", mot:"sur", reponse:"préposition", priority:true },
  { phrase:"Marianne préfère les chevaux magnifiques.", mot:"Marianne", reponse:"nom propre", priority:true },
  { phrase:"Marianne préfère les chevaux magnifiques.", mot:"magnifiques", reponse:"adjectif", priority:true },
  { phrase:"Marianne préfère les chevaux magnifiques.", mot:"préfère", reponse:"verbe", priority:false },
  { phrase:"Elle court rapidement dans le jardin.", mot:"Elle", reponse:"pronom", priority:true },
  { phrase:"Elle court rapidement dans le jardin.", mot:"rapidement", reponse:"adverbe", priority:true },
  { phrase:"Elle court rapidement dans le jardin.", mot:"dans", reponse:"préposition", priority:false },
  { phrase:"Pierre et Marie jouent ensemble.", mot:"et", reponse:"conjonction", priority:true },
  { phrase:"Pierre et Marie jouent ensemble.", mot:"Pierre", reponse:"nom propre", priority:false },
  { phrase:"Pierre et Marie jouent ensemble.", mot:"ensemble", reponse:"adverbe", priority:false },
  { phrase:"Les habitants cultivent la terre fertile.", mot:"habitants", reponse:"nom commun", priority:true },
  { phrase:"Les habitants cultivent la terre fertile.", mot:"fertile", reponse:"adjectif", priority:true },
  { phrase:"Ce bâtiment ancien est très grand.", mot:"ancien", reponse:"adjectif", priority:true },
  { phrase:"Ce bâtiment ancien est très grand.", mot:"très", reponse:"adverbe", priority:true },
  { phrase:"Ce bâtiment ancien est très grand.", mot:"Ce", reponse:"déterminant", priority:true },
  { phrase:"Il lui parle gentiment chaque matin.", mot:"lui", reponse:"pronom", priority:true },
  { phrase:"Il lui parle gentiment chaque matin.", mot:"gentiment", reponse:"adverbe", priority:false },
  { phrase:"Robert Sabatier écrit de beaux romans.", mot:"Robert Sabatier", reponse:"nom propre", priority:true },
  { phrase:"Nous marchons car il fait beau.", mot:"car", reponse:"conjonction", priority:true },
  { phrase:"Mon frère mange une pomme verte.", mot:"Mon", reponse:"déterminant", priority:false },
  { phrase:"Mon frère mange une pomme verte.", mot:"verte", reponse:"adjectif", priority:false },
  { phrase:"Hier, nous avons visité Paris.", mot:"Hier", reponse:"adverbe", priority:true },
  { phrase:"Hier, nous avons visité Paris.", mot:"Paris", reponse:"nom propre", priority:false },
  { phrase:"Le commissaire de police enquête.", mot:"commissaire", reponse:"nom commun", priority:true },
  { phrase:"Le commissaire de police enquête.", mot:"de", reponse:"préposition", priority:true },
  { phrase:"Je suis content mais fatigué.", mot:"mais", reponse:"conjonction", priority:true },
  { phrase:"Cette maison appartient à ma tante.", mot:"Cette", reponse:"déterminant", priority:true },
  { phrase:"Cette maison appartient à ma tante.", mot:"à", reponse:"préposition", priority:true },
  { phrase:"Les oiseaux chantent joyeusement.", mot:"chantent", reponse:"verbe", priority:false },
  { phrase:"Plusieurs élèves sont absents aujourd'hui.", mot:"Plusieurs", reponse:"déterminant", priority:true },
  { phrase:"Plusieurs élèves sont absents aujourd'hui.", mot:"aujourd'hui", reponse:"adverbe", priority:true },
  { phrase:"Je les vois souvent au parc.", mot:"les", reponse:"pronom", priority:true },
  { phrase:"La fillette blonde danse gracieusement.", mot:"blonde", reponse:"adjectif", priority:false },
  { phrase:"Olivier ou Marianne viendra demain.", mot:"ou", reponse:"conjonction", priority:true },
];

// ================================================================
// FONCTION DES GROUPES (choix multiples)
// ================================================================
const FONCTION_QS = [
  { phrase:"Le chat mange la souris.", groupe:"Le chat", reponse:"sujet", priority:true },
  { phrase:"Le chat mange la souris.", groupe:"la souris", reponse:"COD", priority:true },
  { phrase:"Pierre parle à son ami.", groupe:"à son ami", reponse:"COI", priority:true },
  { phrase:"Pierre parle à son ami.", groupe:"Pierre", reponse:"sujet", priority:false },
  { phrase:"Elle travaille dans le jardin.", groupe:"dans le jardin", reponse:"CC lieu", priority:true },
  { phrase:"Il viendra demain.", groupe:"demain", reponse:"CC temps", priority:true },
  { phrase:"Elle chante merveilleusement.", groupe:"merveilleusement", reponse:"CC manière", priority:true },
  { phrase:"Le livre de Pierre est intéressant.", groupe:"de Pierre", reponse:"CDN", priority:true },
  { phrase:"Le livre de Pierre est intéressant.", groupe:"intéressant", reponse:"attribut du sujet", priority:true },
  { phrase:"Le grand arbre ombrage la cour.", groupe:"grand", reponse:"épithète", priority:true },
  { phrase:"Le grand arbre ombrage la cour.", groupe:"la cour", reponse:"COD", priority:false },
  { phrase:"Ma sœur semble fatiguée.", groupe:"fatiguée", reponse:"attribut du sujet", priority:true },
  { phrase:"Il pense à ses vacances.", groupe:"à ses vacances", reponse:"COI", priority:true },
  { phrase:"Le soir, nous regardons la télévision.", groupe:"Le soir", reponse:"CC temps", priority:true },
  { phrase:"Le soir, nous regardons la télévision.", groupe:"la télévision", reponse:"COD", priority:false },
  { phrase:"Le chapeau de paille protège du soleil.", groupe:"de paille", reponse:"CDN", priority:true },
  { phrase:"La jolie robe plaît à Marie.", groupe:"jolie", reponse:"épithète", priority:true },
  { phrase:"La jolie robe plaît à Marie.", groupe:"à Marie", reponse:"COI", priority:false },
  { phrase:"Avec courage, il a grimpé la montagne.", groupe:"Avec courage", reponse:"CC manière", priority:true },
  { phrase:"Avec courage, il a grimpé la montagne.", groupe:"la montagne", reponse:"COD", priority:false },
  { phrase:"Ce gâteau est délicieux.", groupe:"délicieux", reponse:"attribut du sujet", priority:false },
  { phrase:"Les enfants jouent dans la cour.", groupe:"Les enfants", reponse:"sujet", priority:false },
  { phrase:"Les enfants jouent dans la cour.", groupe:"dans la cour", reponse:"CC lieu", priority:false },
  { phrase:"Le matin, le facteur distribue le courrier.", groupe:"Le matin", reponse:"CC temps", priority:false },
  { phrase:"Le matin, le facteur distribue le courrier.", groupe:"le courrier", reponse:"COD", priority:false },
];

// ================================================================
// PLURIELS DES NOMS (saisie texte)
// ================================================================
const PLURIEL_QS = [
  // -ou → -oux (7 exceptions)
  { singulier:"un bijou", pluriel:"des bijoux", regle:"Les 7 noms en -ou qui prennent -x : bijou, caillou, chou, genou, hibou, joujou, pou", priority:true },
  { singulier:"un caillou", pluriel:"des cailloux", regle:"Les 7 noms en -ou qui prennent -x", priority:true },
  { singulier:"un genou", pluriel:"des genoux", regle:"Les 7 noms en -ou qui prennent -x", priority:true },
  { singulier:"un hibou", pluriel:"des hiboux", regle:"Les 7 noms en -ou qui prennent -x", priority:true },
  { singulier:"un chou", pluriel:"des choux", regle:"Les 7 noms en -ou qui prennent -x", priority:true },
  { singulier:"un joujou", pluriel:"des joujoux", regle:"Les 7 noms en -ou qui prennent -x", priority:true },
  { singulier:"un pou", pluriel:"des poux", regle:"Les 7 noms en -ou qui prennent -x", priority:true },
  { singulier:"un trou", pluriel:"des trous", regle:"Les noms en -ou prennent -s (sauf 7 exceptions)", priority:false },
  { singulier:"un clou", pluriel:"des clous", regle:"Les noms en -ou prennent -s (sauf 7 exceptions)", priority:false },
  // -al → -aux
  { singulier:"un journal", pluriel:"des journaux", regle:"Les noms en -al font -aux au pluriel", priority:true },
  { singulier:"un animal", pluriel:"des animaux", regle:"Les noms en -al font -aux au pluriel", priority:true },
  { singulier:"un cheval", pluriel:"des chevaux", regle:"Les noms en -al font -aux au pluriel", priority:true },
  { singulier:"un hôpital", pluriel:"des hôpitaux", regle:"Les noms en -al font -aux au pluriel", priority:false },
  // -al exceptions
  { singulier:"un bal", pluriel:"des bals", regle:"Exception : bal, carnaval, festival, récital → -als", priority:true },
  { singulier:"un carnaval", pluriel:"des carnavals", regle:"Exception : bal, carnaval, festival, récital → -als", priority:true },
  { singulier:"un festival", pluriel:"des festivals", regle:"Exception : bal, carnaval, festival, récital → -als", priority:true },
  { singulier:"un récital", pluriel:"des récitals", regle:"Exception : bal, carnaval, festival, récital → -als", priority:false },
  // -eau → -eaux
  { singulier:"un bateau", pluriel:"des bateaux", regle:"Les noms en -eau font -eaux au pluriel", priority:true },
  { singulier:"un chapeau", pluriel:"des chapeaux", regle:"Les noms en -eau font -eaux au pluriel", priority:false },
  { singulier:"un gâteau", pluriel:"des gâteaux", regle:"Les noms en -eau font -eaux au pluriel", priority:true },
  // -ail → -aux
  { singulier:"un travail", pluriel:"des travaux", regle:"Certains noms en -ail font -aux : travail, vitrail, corail, émail", priority:true },
  { singulier:"un vitrail", pluriel:"des vitraux", regle:"Certains noms en -ail font -aux", priority:true },
  { singulier:"un corail", pluriel:"des coraux", regle:"Certains noms en -ail font -aux", priority:false },
  // -ail régulier
  { singulier:"un détail", pluriel:"des détails", regle:"La plupart des noms en -ail prennent -s", priority:true },
  { singulier:"un portail", pluriel:"des portails", regle:"La plupart des noms en -ail prennent -s", priority:false },
  // Invariables
  { singulier:"une souris", pluriel:"des souris", regle:"Les noms terminés par -s sont invariables au pluriel", priority:true },
  { singulier:"une noix", pluriel:"des noix", regle:"Les noms terminés par -x sont invariables au pluriel", priority:true },
  { singulier:"un nez", pluriel:"des nez", regle:"Les noms terminés par -z sont invariables au pluriel", priority:true },
  // Irréguliers
  { singulier:"un œil", pluriel:"des yeux", regle:"Pluriel irrégulier", priority:true },
  { singulier:"monsieur", pluriel:"messieurs", regle:"Pluriel irrégulier", priority:true },
  { singulier:"madame", pluriel:"mesdames", regle:"Pluriel irrégulier", priority:false },
  // Réguliers
  { singulier:"un chat", pluriel:"des chats", regle:"Règle générale : on ajoute -s", priority:false },
  { singulier:"une maison", pluriel:"des maisons", regle:"Règle générale : on ajoute -s", priority:false },
  { singulier:"un voilier", pluriel:"des voiliers", regle:"Règle générale : on ajoute -s", priority:false },
];

// ================================================================
// ACCORD DU PARTICIPE PASSÉ (saisie texte)
// ================================================================
const ACCORD_PP_QS = [
  // Avec être → accord avec le sujet
  { phrase:"Elle est (partir)", reponse:"partie", explication:"Avec être, le PP s'accorde avec le sujet (elle = fém. sing.)", priority:true },
  { phrase:"Ils sont (venir)", reponse:"venus", explication:"Avec être, le PP s'accorde avec le sujet (ils = masc. plur.)", priority:true },
  { phrase:"Elles sont (sortir)", reponse:"sorties", explication:"Avec être, le PP s'accorde avec le sujet (elles = fém. plur.)", priority:true },
  { phrase:"Nous sommes (arriver) à l'heure.", reponse:"arrivés", explication:"Avec être, le PP s'accorde avec le sujet (nous = masc. plur.)", priority:true },
  { phrase:"Marie est (tomber) dans la cour.", reponse:"tombée", explication:"Avec être, le PP s'accorde avec le sujet (Marie = fém. sing.)", priority:true },
  { phrase:"Les filles sont (entrer) en classe.", reponse:"entrées", explication:"Avec être, le PP s'accorde avec le sujet (les filles = fém. plur.)", priority:true },
  { phrase:"Il est (devenir) médecin.", reponse:"devenu", explication:"Avec être, le PP s'accorde avec le sujet (il = masc. sing.)", priority:false },
  { phrase:"Nous sommes (revenir) tard.", reponse:"revenus", explication:"Avec être, le PP s'accorde avec le sujet (nous = masc. plur.)", priority:false },
  // Avec avoir sans COD avant → pas d'accord
  { phrase:"J'ai (manger) des pommes.", reponse:"mangé", explication:"Avec avoir, pas d'accord quand le COD est après le verbe", priority:true },
  { phrase:"Elle a (prendre) un livre.", reponse:"pris", explication:"Avec avoir, pas d'accord quand le COD est après le verbe", priority:true },
  { phrase:"Nous avons (chanter) une chanson.", reponse:"chanté", explication:"Avec avoir, pas d'accord quand le COD est après le verbe", priority:false },
  { phrase:"Ils ont (écrire) une lettre.", reponse:"écrit", explication:"Avec avoir, pas d'accord quand le COD est après le verbe", priority:false },
  { phrase:"Tu as (voir) le film.", reponse:"vu", explication:"Avec avoir, pas d'accord quand le COD est après le verbe", priority:false },
  // Avec avoir + COD avant → accord avec le COD
  { phrase:"Les pommes que j'ai (manger)", reponse:"mangées", explication:"Avec avoir, accord avec le COD placé avant (les pommes = fém. plur.)", priority:true },
  { phrase:"La lettre qu'il a (écrire)", reponse:"écrite", explication:"Avec avoir, accord avec le COD placé avant (la lettre = fém. sing.)", priority:true },
  { phrase:"Les fleurs que tu as (cueillir)", reponse:"cueillies", explication:"Avec avoir, accord avec le COD placé avant (les fleurs = fém. plur.)", priority:true },
  { phrase:"Les livres que nous avons (lire)", reponse:"lus", explication:"Avec avoir, accord avec le COD placé avant (les livres = masc. plur.)", priority:true },
  { phrase:"La chanson qu'elle a (chanter)", reponse:"chantée", explication:"Avec avoir, accord avec le COD placé avant (la chanson = fém. sing.)", priority:true },
  { phrase:"Les gâteaux que vous avez (préparer)", reponse:"préparés", explication:"Avec avoir, accord avec le COD placé avant (les gâteaux = masc. plur.)", priority:false },
  { phrase:"La route qu'ils ont (prendre)", reponse:"prise", explication:"Avec avoir, accord avec le COD placé avant (la route = fém. sing.)", priority:false },
];

// ================================================================
// ACCORD DES ADJECTIFS (saisie texte)
// ================================================================
const ACCORD_ADJ_QS = [
  // Couleurs normales
  { groupe:"des robes (bleu)", reponse:"bleues", explication:"Adjectif de couleur simple → accord normal (fém. plur.)", priority:true },
  { groupe:"des yeux (vert)", reponse:"verts", explication:"Adjectif de couleur simple → accord normal (masc. plur.)", priority:true },
  { groupe:"une jupe (rouge)", reponse:"rouge", explication:"Rouge finit déjà par -e, pas de changement au féminin", priority:false },
  { groupe:"des chemises (blanc)", reponse:"blanches", explication:"Blanc → blanche au fém., blanches au fém. plur.", priority:true },
  { groupe:"des murs (gris)", reponse:"gris", explication:"Gris finit par -s, invariable au masc. plur.", priority:true },
  { groupe:"une porte (noir)", reponse:"noire", explication:"Noir → noire au féminin", priority:false },
  // Couleurs invariables (noms)
  { groupe:"des chaussures (orange)", reponse:"orange", explication:"Orange = nom de fruit → adjectif de couleur invariable", priority:true },
  { groupe:"des gants (marron)", reponse:"marron", explication:"Marron = nom de fruit → adjectif de couleur invariable", priority:true },
  { groupe:"des écharpes (crème)", reponse:"crème", explication:"Crème = nom → adjectif de couleur invariable", priority:true },
  { groupe:"des pulls (turquoise)", reponse:"turquoise", explication:"Turquoise = nom de pierre → adjectif de couleur invariable", priority:true },
  // Couleurs composées (invariables)
  { groupe:"des yeux (bleu clair)", reponse:"bleu clair", explication:"Adjectif de couleur composé → toujours invariable", priority:true },
  { groupe:"des rubans (vert foncé)", reponse:"vert foncé", explication:"Adjectif de couleur composé → toujours invariable", priority:true },
  { groupe:"des jupes (bleu marine)", reponse:"bleu marine", explication:"Adjectif de couleur composé → toujours invariable", priority:false },
  // Adjectifs qualificatifs
  { groupe:"des filles (content)", reponse:"contentes", explication:"Content → contente au fém., contentes au fém. plur.", priority:false },
  { groupe:"une femme (heureux)", reponse:"heureuse", explication:"Heureux → heureuse au féminin", priority:true },
  { groupe:"des maisons (beau)", reponse:"belles", explication:"Beau → belle au fém., belles au fém. plur.", priority:true },
  { groupe:"une histoire (long)", reponse:"longue", explication:"Long → longue au féminin", priority:true },
  { groupe:"des exercices (difficile)", reponse:"difficiles", explication:"Difficile finit par -e, on ajoute juste -s au plur.", priority:false },
  { groupe:"des garçons (sportif)", reponse:"sportifs", explication:"Sportif → sportifs au masc. plur.", priority:false },
  { groupe:"une fille (sportif)", reponse:"sportive", explication:"Sportif → sportive au féminin", priority:true },
  { groupe:"des routes (dangereux)", reponse:"dangereuses", explication:"Dangereux → dangereuse au fém., dangereuses au fém. plur.", priority:false },
  { groupe:"un garçon (gentil)", reponse:"gentil", explication:"Masc. sing. → pas de changement", priority:false },
  { groupe:"des enfants (attentif)", reponse:"attentifs", explication:"Attentif → attentifs au masc. plur.", priority:false },
];

// ================================================================
// LOGIQUE GRAMMAIRE
// ================================================================
const GRAM_MODE = {
  nature: 'choice', fonction: 'choice',
  pluriel: 'text', accord_pp: 'text', accord_adj: 'text'
};

function getGramChoices(type) {
  if (type === 'nature') return shuffle([...NATURES]);
  if (type === 'fonction') return shuffle([...FONCTIONS]);
  return [];
}

const ALL_GRAM_QS = [];
function _buildGramQs() {
  const types = { nature: NATURE_QS, fonction: FONCTION_QS, pluriel: PLURIEL_QS, accord_pp: ACCORD_PP_QS, accord_adj: ACCORD_ADJ_QS };
  Object.entries(types).forEach(([type, qs]) => {
    qs.forEach((q, i) => ALL_GRAM_QS.push({ ...q, type, id: `${type}_${i}` }));
  });
}
_buildGramQs();

function gramQuestionDisplay(q) {
  switch(q.type) {
    case 'nature':
      return { typeName: GRAM_TYPES.nature.nom, instruction: "Quelle est la nature du mot souligné ?", phrase: q.phrase, highlight: q.mot };
    case 'fonction':
      return { typeName: GRAM_TYPES.fonction.nom, instruction: "Quelle est la fonction du groupe souligné ?", phrase: q.phrase, highlight: q.groupe };
    case 'pluriel':
      return { typeName: GRAM_TYPES.pluriel.nom, instruction: "Écris au pluriel :", phrase: q.singulier, highlight: null };
    case 'accord_pp':
      return { typeName: GRAM_TYPES.accord_pp.nom, instruction: "Écris le participe passé correctement accordé :", phrase: q.phrase, highlight: null };
    case 'accord_adj':
      return { typeName: GRAM_TYPES.accord_adj.nom, instruction: "Accorde l'adjectif entre parenthèses :", phrase: q.groupe, highlight: null };
  }
}

function checkGramAnswer(q, userAnswer) {
  const n = s => (s || '').toLowerCase().trim().replace(/\s+/g, ' ');
  return n(userAnswer) === n(q.reponse);
}

function gramDisplayAnswer(q) { return q.reponse; }
function gramExplanation(q) { return q.explication || q.regle || ''; }
function gramComboKey(q) { return q.id; }

function buildGramNormalPool(stats) {
  return ALL_GRAM_QS.map(q => {
    const s = getStat(stats, gramComboKey(q));
    const rate = s.asked > 0 ? s.wrong / s.asked : 0;
    let w = q.priority ? 1.4 : 0.7;
    if (s.asked === 0) w *= 0.8;
    else w *= (1 + rate * 2.5);
    return { q, w };
  });
}

function buildGramRevisionPool(errorCombos) {
  const qMap = {};
  ALL_GRAM_QS.forEach(q => qMap[gramComboKey(q)] = q);
  const pool = [];
  errorCombos.forEach(e => { if (qMap[e.key]) pool.push({ q: qMap[e.key], w: 2 + e.rate * 3 }); });
  ALL_GRAM_QS.forEach(q => pool.push({ q, w: 0.15 }));
  return pool;
}
