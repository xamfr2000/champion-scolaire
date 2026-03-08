/* ================================================================
   Champion Scolaire — Données et logique ORTHOGRAPHE
   Basé sur les évaluations CM2 + extrapolations
   ================================================================ */

const ORTHO_TYPES = {
  homophone:  { nom: "Homophones",        icon: "🔀" },
  mot:        { nom: "Dictée de mots",    icon: "📝" },
  accord_sv:  { nom: "Accord sujet-verbe", icon: "🔗" }
};

// ================================================================
// HOMOPHONES (choix multiples)
// ================================================================
const HOMOPHONE_QS = [
  // a / à
  { phrase:"Il ___ mangé une pomme.", options:["a","à"], reponse:"a", regle:"a = verbe avoir (on peut le remplacer par « avait »)", priority:true },
  { phrase:"Je vais ___ la piscine.", options:["a","à"], reponse:"à", regle:"à = préposition (on ne peut pas le remplacer par « avait »)", priority:true },
  { phrase:"Mon frère ___ dix ans.", options:["a","à"], reponse:"a", regle:"a = verbe avoir", priority:false },
  { phrase:"Elle pense ___ ses amis.", options:["a","à"], reponse:"à", regle:"à = préposition", priority:false },
  { phrase:"Le chat ___ attrapé la souris.", options:["a","à"], reponse:"a", regle:"a = auxiliaire avoir", priority:false },
  { phrase:"Il habite ___ Paris.", options:["a","à"], reponse:"à", regle:"à = préposition de lieu", priority:false },
  // et / est
  { phrase:"Le chat ___ noir.", options:["et","est"], reponse:"est", regle:"est = verbe être (on peut le remplacer par « était »)", priority:true },
  { phrase:"Pierre ___ Marie jouent.", options:["et","est"], reponse:"et", regle:"et = conjonction (« et puis »)", priority:true },
  { phrase:"Le ciel ___ bleu ___ dégagé.", options:["et","est"], reponse:"est", regle:"Premier blanc = verbe être", priority:true, phrase2:"Le ciel est bleu ___ dégagé.", reponse2:"et" },
  { phrase:"Mon père ___ ma mère sont partis.", options:["et","est"], reponse:"et", regle:"et = conjonction qui relie deux sujets", priority:false },
  { phrase:"Cette maison ___ très grande.", options:["et","est"], reponse:"est", regle:"est = verbe être", priority:false },
  // ou / où
  { phrase:"Tu veux du thé ___ du café ?", options:["ou","où"], reponse:"ou", regle:"ou = choix (on peut le remplacer par « ou bien »)", priority:true },
  { phrase:"La ville ___ j'habite est belle.", options:["ou","où"], reponse:"où", regle:"où = lieu ou moment (avec accent)", priority:true },
  { phrase:"Fromage ___ dessert ?", options:["ou","où"], reponse:"ou", regle:"ou = choix", priority:false },
  { phrase:"Le jour ___ il est né.", options:["ou","où"], reponse:"où", regle:"où = moment (avec accent)", priority:false },
  // on / ont
  { phrase:"___ va au cinéma.", options:["On","Ont"], reponse:"On", regle:"On = pronom (on peut le remplacer par « il »)", priority:true },
  { phrase:"Ils ___ mangé.", options:["on","ont"], reponse:"ont", regle:"ont = verbe avoir (on peut le remplacer par « avaient »)", priority:true },
  { phrase:"___ ne sait jamais.", options:["On","Ont"], reponse:"On", regle:"On = pronom sujet", priority:false },
  { phrase:"Les enfants ___ joué dehors.", options:["on","ont"], reponse:"ont", regle:"ont = auxiliaire avoir", priority:false },
  // son / sont
  { phrase:"___ cartable est lourd.", options:["Son","Sont"], reponse:"Son", regle:"Son = déterminant possessif (on peut le remplacer par « mon, ton »)", priority:true },
  { phrase:"Ils ___ partis.", options:["son","sont"], reponse:"sont", regle:"sont = verbe être (on peut le remplacer par « étaient »)", priority:true },
  { phrase:"Elle a oublié ___ manteau.", options:["son","sont"], reponse:"son", regle:"Son = déterminant possessif", priority:false },
  { phrase:"Les pommes ___ mûres.", options:["son","sont"], reponse:"sont", regle:"sont = verbe être", priority:false },
  // ce / se
  { phrase:"___ garçon est gentil.", options:["Ce","Se"], reponse:"Ce", regle:"Ce = déterminant démonstratif (devant un nom)", priority:true },
  { phrase:"Il ___ lave les mains.", options:["ce","se"], reponse:"se", regle:"se = pronom réfléchi (devant un verbe pronominal)", priority:true },
  { phrase:"___ matin, il fait froid.", options:["Ce","Se"], reponse:"Ce", regle:"Ce = déterminant démonstratif", priority:false },
  { phrase:"Elle ___ promène dans le parc.", options:["ce","se"], reponse:"se", regle:"se = pronom réfléchi", priority:false },
  // ces / ses
  { phrase:"___ chaussures sont à Pierre.", options:["Ces","Ses"], reponse:"Ses", regle:"Ses = possessif (les siennes) — on peut dire « les chaussures de Pierre »", priority:true },
  { phrase:"Regarde ___ fleurs magnifiques !", options:["ces","ses"], reponse:"ces", regle:"Ces = démonstratif (celles-ci) — on montre, on désigne", priority:true },
  { phrase:"Elle a perdu ___ clés.", options:["ces","ses"], reponse:"ses", regle:"Ses = possessif (les siennes)", priority:false },
  { phrase:"___ nuages annoncent la pluie.", options:["Ces","Ses"], reponse:"Ces", regle:"Ces = démonstratif (on désigne ces nuages-là)", priority:false },
  // leur / leurs
  { phrase:"Je ___ ai donné un cadeau.", options:["leur","leurs"], reponse:"leur", regle:"leur = pronom (devant un verbe, invariable) = à eux", priority:true },
  { phrase:"___ enfants sont sages.", options:["Leur","Leurs"], reponse:"Leurs", regle:"Leurs = déterminant possessif pluriel (devant un nom pluriel)", priority:true },
  { phrase:"Elle ___ parle doucement.", options:["leur","leurs"], reponse:"leur", regle:"leur = pronom devant un verbe → invariable", priority:false },
  { phrase:"___ maison est grande.", options:["Leur","Leurs"], reponse:"Leur", regle:"Leur = déterminant possessif singulier (devant un nom singulier)", priority:false },
  // la / là / l'a
  { phrase:"Il ___ vue hier.", options:["la","là","l'a"], reponse:"l'a", regle:"l'a = le/la + a (auxiliaire avoir) — on peut dire « l'avait »", priority:true },
  { phrase:"Pose-le ___.", options:["la","là","l'a"], reponse:"là", regle:"là = adverbe de lieu (ici/là)", priority:true },
  { phrase:"Je ___ connais bien.", options:["la","là","l'a"], reponse:"la", regle:"la = pronom COD ou déterminant", priority:true },
  { phrase:"Pierre ___ rencontrée au parc.", options:["la","là","l'a"], reponse:"l'a", regle:"l'a = le/la + a (auxiliaire avoir)", priority:false },
];

// ================================================================
// DICTÉE DE MOTS (saisie texte) — mots des évaluations
// ================================================================
const DICTEE_QS = [
  // Tirés des évaluations
  { definition:"Grand édifice religieux chrétien avec des vitraux", reponse:"cathédrale", priority:true },
  { definition:"Action de quitter un navire pour aller à terre", reponse:"débarquement", priority:true },
  { definition:"Ensemble des feuilles d'un arbre", reponse:"feuillage", priority:true },
  { definition:"Personne qui accompagne quelqu'un", reponse:"accompagnateur", priority:true },
  { definition:"Unité de mesure de masse valant 1 000 grammes", reponse:"kilogramme", priority:true },
  { definition:"Ce qui n'était pas prévu, qui arrive par surprise", reponse:"imprévu", priority:true },
  { definition:"Qui produit de bons résultats, qui est performant", reponse:"efficace", priority:true },
  { definition:"Troubler la vue par un éclat de lumière trop vif", reponse:"éblouir", priority:true },
  { definition:"Mot ou phrase qui se lit de la même façon à l'endroit et à l'envers", reponse:"palindrome", priority:true },
  { definition:"Partie du corps entre le thorax et le bassin", reponse:"abdomen", priority:true },
  { definition:"Vêtement qui protège de la pluie", reponse:"imperméable", priority:true },
  { definition:"État de lassitude physique ou morale", reponse:"fatigue", priority:true },
  { definition:"Personne dont le métier est d'éteindre les incendies", reponse:"pompier", priority:true },
  { definition:"Ajouter des dessins, des images à un texte", reponse:"illustrer", priority:true },
  { definition:"Cavité profonde et abrupte dans le sol", reponse:"gouffre", priority:true },
  { definition:"Désir de manger, envie de nourriture", reponse:"appétit", priority:true },
  { definition:"Lieu où l'on fabrique des objets en série", reponse:"fabrique", priority:false },
  { definition:"Siège long et étroit, souvent en bois, sans dossier", reponse:"banc", priority:false },
  { definition:"Maison individuelle avec jardin en banlieue", reponse:"pavillon", priority:false },
  // Mots supplémentaires CM2
  { definition:"Qui dure très longtemps, qui semble ne jamais finir", reponse:"éternel", priority:false },
  { definition:"Vaste étendue d'eau salée qui couvre la Terre", reponse:"océan", priority:false },
  { definition:"Instrument qui sert à mesurer la température", reponse:"thermomètre", priority:false },
  { definition:"Science qui étudie les astres et l'univers", reponse:"astronomie", priority:false },
  { definition:"Action de respirer : inspiration et expiration", reponse:"respiration", priority:false },
  { definition:"Qui ne peut pas être vaincu", reponse:"invincible", priority:false },
  { definition:"Terrain entouré d'eau de tous côtés", reponse:"île", priority:false },
  { definition:"Sentiment de peur devant un danger", reponse:"frayeur", priority:false },
  { definition:"Période de l'année où il fait très chaud", reponse:"canicule", priority:false },
  { definition:"Ensemble des règles qui organisent la vie en société", reponse:"constitution", priority:false },
  { definition:"Récit imaginaire avec des personnages merveilleux", reponse:"conte", priority:false },
  { definition:"Ligne imaginaire qui partage la Terre en deux hémisphères", reponse:"équateur", priority:false },
  { definition:"Qui arrive à l'heure, qui ne se met jamais en retard", reponse:"ponctuel", priority:false },
  { definition:"Habitant d'une ville ou d'un pays", reponse:"citoyen", priority:false },
];

// ================================================================
// ACCORD SUJET-VERBE (saisie texte) — basé sur évaluations
// ================================================================
const ACCORD_SV_QS = [
  { phrase:"Les oies et les coqs ___ (accompagner, présent)", reponse:"accompagnent", explication:"Deux sujets au pluriel → verbe au pluriel (3e pers.)", priority:true },
  { phrase:"Les poules ___ (caqueter, présent)", reponse:"caquètent", explication:"Sujet au pluriel → verbe au pluriel", priority:true },
  { phrase:"Les marins ___ (débarquer, imparfait)", reponse:"débarquaient", explication:"Sujet au pluriel + imparfait → -aient", priority:true },
  { phrase:"Le commissaire de police ___ (enquêter, présent)", reponse:"enquête", explication:"Le sujet est « le commissaire » → singulier", priority:true },
  { phrase:"Les moines ___ (se réjouir, présent)", reponse:"se réjouissent", explication:"Sujet au pluriel → verbe au pluriel", priority:true },
  { phrase:"Les habitants et les agriculteurs ___ (cultiver, présent)", reponse:"cultivent", explication:"Plusieurs sujets = pluriel → -ent", priority:true },
  { phrase:"Pierre et moi ___ (jouer, présent)", reponse:"jouons", explication:"Pierre et moi = nous → 1re pers. pluriel", priority:true },
  { phrase:"Toi et Marie ___ (chanter, futur)", reponse:"chanterez", explication:"Toi et Marie = vous → 2e pers. pluriel", priority:true },
  { phrase:"Le groupe d'élèves ___ (travailler, présent)", reponse:"travaille", explication:"Le sujet est « le groupe » → singulier (3e pers.)", priority:true },
  { phrase:"La foule des spectateurs ___ (applaudir, imparfait)", reponse:"applaudissait", explication:"Le sujet est « la foule » → singulier", priority:false },
  { phrase:"Les enfants ___ (courir, passé composé)", reponse:"ont couru", explication:"Sujet pluriel + passé composé avec avoir", priority:false },
  { phrase:"Ma sœur et sa copine ___ (partir, passé composé)", reponse:"sont parties", explication:"Deux sujets féminins = elles → être + PP fém. plur.", priority:true },
  { phrase:"Le chien et le chat ___ (dormir, présent)", reponse:"dorment", explication:"Deux sujets = ils → 3e pers. pluriel", priority:false },
  { phrase:"Personne ne ___ (venir, futur)", reponse:"viendra", explication:"Personne = singulier → 3e pers. sing.", priority:false },
  { phrase:"Les élèves de cette classe ___ (progresser, présent)", reponse:"progressent", explication:"Le sujet est « les élèves » → pluriel", priority:false },
  { phrase:"Mon père ___ (préparer, imparfait) le repas.", reponse:"préparait", explication:"Sujet singulier + imparfait → -ait", priority:false },
  { phrase:"Les policiers ___ (enquêter, futur) sur l'affaire.", reponse:"enquêteront", explication:"Sujet pluriel + futur → -eront", priority:false },
];

// ================================================================
// LOGIQUE ORTHOGRAPHE
// ================================================================
const ORTHO_MODE = {
  homophone: 'choice', mot: 'text', accord_sv: 'text'
};

const ALL_ORTHO_QS = [];
function _buildOrthoQs() {
  HOMOPHONE_QS.forEach((q, i) => ALL_ORTHO_QS.push({ ...q, type:'homophone', id:`homo_${i}` }));
  DICTEE_QS.forEach((q, i) => ALL_ORTHO_QS.push({ ...q, type:'mot', id:`mot_${i}` }));
  ACCORD_SV_QS.forEach((q, i) => ALL_ORTHO_QS.push({ ...q, type:'accord_sv', id:`accord_sv_${i}` }));
}
_buildOrthoQs();

function orthoQuestionDisplay(q) {
  switch(q.type) {
    case 'homophone':
      return { typeName: ORTHO_TYPES.homophone.nom, instruction:"Complète avec le bon mot :", phrase: q.phrase, highlight: null };
    case 'mot':
      return { typeName: ORTHO_TYPES.mot.nom, instruction:"Écris le mot correspondant à la définition :", phrase: q.definition, highlight: null };
    case 'accord_sv':
      return { typeName: ORTHO_TYPES.accord_sv.nom, instruction:"Conjugue le verbe entre parenthèses :", phrase: q.phrase, highlight: null };
  }
}

function getOrthoChoices(q) {
  if (q.type === 'homophone') return shuffle([...q.options]);
  return [];
}

function checkOrthoAnswer(q, userAnswer) {
  const n = s => (s || '').toLowerCase().trim().replace(/\s+/g, ' ').replace(/['']/g, "'");
  if (q.type === 'homophone') return n(userAnswer) === n(q.reponse);
  if (q.type === 'mot') {
    const u = n(userAnswer), e = n(q.reponse);
    // Accept without accents for partial credit display but strict check
    return u === e;
  }
  return n(userAnswer) === n(q.reponse);
}

function orthoDisplayAnswer(q) { return q.reponse; }
function orthoExplanation(q) { return q.explication || q.regle || ''; }
function orthoComboKey(q) { return q.id; }

function buildOrthoNormalPool(stats) {
  return ALL_ORTHO_QS.map(q => {
    const s = getStat(stats, orthoComboKey(q));
    const rate = s.asked > 0 ? s.wrong / s.asked : 0;
    let w = q.priority ? 1.4 : 0.7;
    if (s.asked === 0) w *= 0.8;
    else w *= (1 + rate * 2.5);
    return { q, w, _key: orthoComboKey(q) };
  });
}

function buildOrthoRevisionPool(errorCombos) {
  const qMap = {};
  ALL_ORTHO_QS.forEach(q => qMap[orthoComboKey(q)] = q);
  const pool = [];
  errorCombos.forEach(e => { if (qMap[e.key]) pool.push({ q: qMap[e.key], w: 2 + e.rate * 3, _key: e.key }); });
  ALL_ORTHO_QS.forEach(q => pool.push({ q, w: 0.15, _key: orthoComboKey(q) }));
  return pool;
}
