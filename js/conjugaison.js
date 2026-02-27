/* ================================================================
   Champion Scolaire — Données et logique CONJUGAISON
   ================================================================ */

// ================================================================
// AUXILIAIRES
// ================================================================
const ETRE_AUX = {
  PR:  ['suis','es','est','sommes','êtes','sont'],
  IMP: ['étais','étais','était','étions','étiez','étaient'],
  FS:  ['serai','seras','sera','serons','serez','seront']
};
const AVOIR_AUX = {
  PR:  ['ai','as','a','avons','avez','ont'],
  IMP: ['avais','avais','avait','avions','aviez','avaient'],
  FS:  ['aurai','auras','aura','aurons','aurez','auront']
};

const PRONOMS      = ['je','tu','il','nous','vous','ils'];
const PRONOMS_FULL = ["je / j'", 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];

const TEMPS = {
  PR:  { nom: 'Présent',          simple: true },
  IMP: { nom: 'Imparfait',        simple: true },
  FS:  { nom: 'Futur Simple',     simple: true },
  PS:  { nom: 'Passé Simple',     simple: true },
  PC:  { nom: 'Passé Composé',    simple: false, auxT: 'PR'  },
  PQP: { nom: 'Plus-que-parfait', simple: false, auxT: 'IMP' },
  FA:  { nom: 'Futur Antérieur',  simple: false, auxT: 'FS'  }
};

// ================================================================
// DONNÉES VERBES
// ================================================================
const V = {};
function addV(inf, g, pp, PR, IMP, FS, PS, priority) {
  V[inf] = { g, pp, priority: !!priority,
    PR: PR.split(','), IMP: IMP.split(','),
    FS: FS.split(','), PS: PS.split(',') };
}

// --- Verbes des évaluations (priority=true) ---
addV('accueillir','avoir','accueilli','accueille,accueilles,accueille,accueillons,accueillez,accueillent','accueillais,accueillais,accueillait,accueillions,accueilliez,accueillaient','accueillerai,accueilleras,accueillera,accueillerons,accueillerez,accueilleront','accueillis,accueillis,accueillit,accueillîmes,accueillîtes,accueillirent',true);
addV('acquérir','avoir','acquis','acquiers,acquiers,acquiert,acquérons,acquérez,acquièrent','acquérais,acquérais,acquérait,acquérions,acquériez,acquéraient','acquerrai,acquerras,acquerra,acquerrons,acquerrez,acquerront','acquis,acquis,acquit,acquîmes,acquîtes,acquirent',true);
addV('conduire','avoir','conduit','conduis,conduis,conduit,conduisons,conduisez,conduisent','conduisais,conduisais,conduisait,conduisions,conduisiez,conduisaient','conduirai,conduiras,conduira,conduirons,conduirez,conduiront','conduisis,conduisis,conduisit,conduisîmes,conduisîtes,conduisirent',true);
addV('comprendre','avoir','compris','comprends,comprends,comprend,comprenons,comprenez,comprennent','comprenais,comprenais,comprenait,comprenions,compreniez,comprenaient','comprendrai,comprendras,comprendra,comprendrons,comprendrez,comprendront','compris,compris,comprit,comprîmes,comprîtes,comprirent',true);
addV('connaître','avoir','connu','connais,connais,connaît,connaissons,connaissez,connaissent','connaissais,connaissais,connaissait,connaissions,connaissiez,connaissaient','connaîtrai,connaîtras,connaîtra,connaîtrons,connaîtrez,connaîtront','connus,connus,connut,connûmes,connûtes,connurent',true);
addV('craindre','avoir','craint','crains,crains,craint,craignons,craignez,craignent','craignais,craignais,craignait,craignions,craigniez,craignaient','craindrai,craindras,craindra,craindrons,craindrez,craindront','craignis,craignis,craignit,craignîmes,craignîtes,craignirent',true);
addV('devenir','être','devenu','deviens,deviens,devient,devenons,devenez,deviennent','devenais,devenais,devenait,devenions,deveniez,devenaient','deviendrai,deviendras,deviendra,deviendrons,deviendrez,deviendront','devins,devins,devint,devînmes,devîntes,devinrent',true);
addV('écrire','avoir','écrit','écris,écris,écrit,écrivons,écrivez,écrivent','écrivais,écrivais,écrivait,écrivions,écriviez,écrivaient','écrirai,écriras,écrira,écrirons,écrirez,écriront','écrivis,écrivis,écrivit,écrivîmes,écrivîtes,écrivirent',true);
addV('obtenir','avoir','obtenu','obtiens,obtiens,obtient,obtenons,obtenez,obtiennent','obtenais,obtenais,obtenait,obtenions,obteniez,obtenaient','obtiendrai,obtiendras,obtiendra,obtiendrons,obtiendrez,obtiendront','obtins,obtins,obtint,obtînmes,obtîntes,obtinrent',true);
addV('recevoir','avoir','reçu','reçois,reçois,reçoit,recevons,recevez,reçoivent','recevais,recevais,recevait,recevions,receviez,recevaient','recevrai,recevras,recevra,recevrons,recevrez,recevront','reçus,reçus,reçut,reçûmes,reçûtes,reçurent',true);
addV('réduire','avoir','réduit','réduis,réduis,réduit,réduisons,réduisez,réduisent','réduisais,réduisais,réduisait,réduisions,réduisiez,réduisaient','réduirai,réduiras,réduira,réduirons,réduirez,réduiront','réduisis,réduisis,réduisit,réduisîmes,réduisîtes,réduisirent',true);
addV('résoudre','avoir','résolu','résous,résous,résout,résolvons,résolvez,résolvent','résolvais,résolvais,résolvait,résolvions,résolviez,résolvaient','résoudrai,résoudras,résoudra,résoudrons,résoudrez,résoudront','résolus,résolus,résolut,résolûmes,résolûtes,résolurent',true);
addV('revenir','être','revenu','reviens,reviens,revient,revenons,revenez,reviennent','revenais,revenais,revenait,revenions,reveniez,revenaient','reviendrai,reviendras,reviendra,reviendrons,reviendrez,reviendront','revins,revins,revint,revînmes,revîntes,revinrent',true);
addV('traduire','avoir','traduit','traduis,traduis,traduit,traduisons,traduisez,traduisent','traduisais,traduisais,traduisait,traduisions,traduisiez,traduisaient','traduirai,traduiras,traduira,traduirons,traduirez,traduiront','traduisis,traduisis,traduisit,traduisîmes,traduisîtes,traduisirent',true);
addV('vivre','avoir','vécu','vis,vis,vit,vivons,vivez,vivent','vivais,vivais,vivait,vivions,viviez,vivaient','vivrai,vivras,vivra,vivrons,vivrez,vivront','vécus,vécus,vécut,vécûmes,vécûtes,vécurent',true);
addV('voir','avoir','vu','vois,vois,voit,voyons,voyez,voient','voyais,voyais,voyait,voyions,voyiez,voyaient','verrai,verras,verra,verrons,verrez,verront','vis,vis,vit,vîmes,vîtes,virent',true);
addV('partir','être','parti','pars,pars,part,partons,partez,partent','partais,partais,partait,partions,partiez,partaient','partirai,partiras,partira,partirons,partirez,partiront','partis,partis,partit,partîmes,partîtes,partirent',true);
addV('apercevoir','avoir','aperçu','aperçois,aperçois,aperçoit,apercevons,apercevez,aperçoivent','apercevais,apercevais,apercevait,apercevions,aperceviez,apercevaient','apercevrai,apercevras,apercevra,apercevrons,apercevrez,apercevront','aperçus,aperçus,aperçut,aperçûmes,aperçûtes,aperçurent',true);
addV('suspendre','avoir','suspendu','suspends,suspends,suspend,suspendons,suspendez,suspendent','suspendais,suspendais,suspendait,suspendions,suspendiez,suspendaient','suspendrai,suspendras,suspendra,suspendrons,suspendrez,suspendront','suspendis,suspendis,suspendit,suspendîmes,suspendîtes,suspendirent',true);
addV('répondre','avoir','répondu','réponds,réponds,répond,répondons,répondez,répondent','répondais,répondais,répondait,répondions,répondiez,répondaient','répondrai,répondras,répondra,répondrons,répondrez,répondront','répondis,répondis,répondit,répondîmes,répondîtes,répondirent',true);
addV('attendre','avoir','attendu','attends,attends,attend,attendons,attendez,attendent','attendais,attendais,attendait,attendions,attendiez,attendaient','attendrai,attendras,attendra,attendrons,attendrez,attendront','attendis,attendis,attendit,attendîmes,attendîtes,attendirent',true);
addV('inviter','avoir','invité','invite,invites,invite,invitons,invitez,invitent','invitais,invitais,invitait,invitions,invitiez,invitaient','inviterai,inviteras,invitera,inviterons,inviterez,inviteront','invitai,invitas,invita,invitâmes,invitâtes,invitèrent',true);
addV('suivre','avoir','suivi','suis,suis,suit,suivons,suivez,suivent','suivais,suivais,suivait,suivions,suiviez,suivaient','suivrai,suivras,suivra,suivrons,suivrez,suivront','suivis,suivis,suivit,suivîmes,suivîtes,suivirent',true);
addV('entrer','être','entré','entre,entres,entre,entrons,entrez,entrent','entrais,entrais,entrait,entrions,entriez,entraient','entrerai,entreras,entrera,entrerons,entrerez,entreront','entrai,entras,entra,entrâmes,entrâtes,entrèrent',true);
addV('accepter','avoir','accepté','accepte,acceptes,accepte,acceptons,acceptez,acceptent','acceptais,acceptais,acceptait,acceptions,acceptiez,acceptaient','accepterai,accepteras,acceptera,accepterons,accepterez,accepteront','acceptai,acceptas,accepta,acceptâmes,acceptâtes,acceptèrent',true);
addV('utiliser','avoir','utilisé','utilise,utilises,utilise,utilisons,utilisez,utilisent','utilisais,utilisais,utilisait,utilisions,utilisiez,utilisaient','utiliserai,utiliseras,utilisera,utiliserons,utiliserez,utiliseront','utilisai,utilisas,utilisa,utilisâmes,utilisâtes,utilisèrent',true);
addV('appuyer','avoir','appuyé','appuie,appuies,appuie,appuyons,appuyez,appuient','appuyais,appuyais,appuyait,appuyions,appuyiez,appuyaient','appuierai,appuieras,appuiera,appuierons,appuierez,appuieront','appuyai,appuyas,appuya,appuyâmes,appuyâtes,appuyèrent',true);
addV('essayer','avoir','essayé','essaie,essaies,essaie,essayons,essayez,essaient','essayais,essayais,essayait,essayions,essayiez,essayaient','essaierai,essaieras,essaiera,essaierons,essaierez,essaieront','essayai,essayas,essaya,essayâmes,essayâtes,essayèrent',true);
addV('obéir','avoir','obéi','obéis,obéis,obéit,obéissons,obéissez,obéissent','obéissais,obéissais,obéissait,obéissions,obéissiez,obéissaient','obéirai,obéiras,obéira,obéirons,obéirez,obéiront','obéis,obéis,obéit,obéîmes,obéîtes,obéirent',true);
addV('trouver','avoir','trouvé','trouve,trouves,trouve,trouvons,trouvez,trouvent','trouvais,trouvais,trouvait,trouvions,trouviez,trouvaient','trouverai,trouveras,trouvera,trouverons,trouverez,trouveront','trouvai,trouvas,trouva,trouvâmes,trouvâtes,trouvèrent',true);
addV('penser','avoir','pensé','pense,penses,pense,pensons,pensez,pensent','pensais,pensais,pensait,pensions,pensiez,pensaient','penserai,penseras,pensera,penserons,penserez,penseront','pensai,pensas,pensa,pensâmes,pensâtes,pensèrent',true);
addV('soutenir','avoir','soutenu','soutiens,soutiens,soutient,soutenons,soutenez,soutiennent','soutenais,soutenais,soutenait,soutenions,souteniez,soutenaient','soutiendrai,soutiendras,soutiendra,soutiendrons,soutiendrez,soutiendront','soutins,soutins,soutint,soutînmes,soutîntes,soutinrent',true);
addV('offrir','avoir','offert','offre,offres,offre,offrons,offrez,offrent','offrais,offrais,offrait,offrions,offriez,offraient','offrirai,offriras,offrira,offrirons,offrirez,offriront','offris,offris,offrit,offrîmes,offrîtes,offrirent',true);
addV('croquer','avoir','croqué','croque,croques,croque,croquons,croquez,croquent','croquais,croquais,croquait,croquions,croquiez,croquaient','croquerai,croqueras,croquera,croquerons,croquerez,croqueront','croquai,croquas,croqua,croquâmes,croquâtes,croquèrent',true);
addV('croiser','avoir','croisé','croise,croises,croise,croisons,croisez,croisent','croisais,croisais,croisait,croisions,croisiez,croisaient','croiserai,croiseras,croisera,croiserons,croiserez,croiseront','croisai,croisas,croisa,croisâmes,croisâtes,croisèrent',true);
addV('préparer','avoir','préparé','prépare,prépares,prépare,préparons,préparez,préparent','préparais,préparais,préparait,préparions,prépariez,préparaient','préparerai,prépareras,préparera,préparerons,préparerez,prépareront','préparai,préparas,prépara,préparâmes,préparâtes,préparèrent',true);
addV('apprendre','avoir','appris','apprends,apprends,apprend,apprenons,apprenez,apprennent','apprenais,apprenais,apprenait,apprenions,appreniez,apprenaient','apprendrai,apprendras,apprendra,apprendrons,apprendrez,apprendront','appris,appris,apprit,apprîmes,apprîtes,apprirent',true);

// --- Verbes supplémentaires ---
addV('être','avoir','été','suis,es,est,sommes,êtes,sont','étais,étais,était,étions,étiez,étaient','serai,seras,sera,serons,serez,seront','fus,fus,fut,fûmes,fûtes,furent',false);
addV('avoir','avoir','eu','ai,as,a,avons,avez,ont','avais,avais,avait,avions,aviez,avaient','aurai,auras,aura,aurons,aurez,auront','eus,eus,eut,eûmes,eûtes,eurent',false);
addV('aller','être','allé','vais,vas,va,allons,allez,vont','allais,allais,allait,allions,alliez,allaient','irai,iras,ira,irons,irez,iront','allai,allas,alla,allâmes,allâtes,allèrent',false);
addV('faire','avoir','fait','fais,fais,fait,faisons,faites,font','faisais,faisais,faisait,faisions,faisiez,faisaient','ferai,feras,fera,ferons,ferez,feront','fis,fis,fit,fîmes,fîtes,firent',false);
addV('venir','être','venu','viens,viens,vient,venons,venez,viennent','venais,venais,venait,venions,veniez,venaient','viendrai,viendras,viendra,viendrons,viendrez,viendront','vins,vins,vint,vînmes,vîntes,vinrent',false);
addV('prendre','avoir','pris','prends,prends,prend,prenons,prenez,prennent','prenais,prenais,prenait,prenions,preniez,prenaient','prendrai,prendras,prendra,prendrons,prendrez,prendront','pris,pris,prit,prîmes,prîtes,prirent',false);
addV('sortir','être','sorti','sors,sors,sort,sortons,sortez,sortent','sortais,sortais,sortait,sortions,sortiez,sortaient','sortirai,sortiras,sortira,sortirons,sortirez,sortiront','sortis,sortis,sortit,sortîmes,sortîtes,sortirent',false);
addV('courir','avoir','couru','cours,cours,court,courons,courez,courent','courais,courais,courait,courions,couriez,couraient','courrai,courras,courra,courrons,courrez,courront','courus,courus,courut,courûmes,courûtes,coururent',false);
addV('mentir','avoir','menti','mens,mens,ment,mentons,mentez,mentent','mentais,mentais,mentait,mentions,mentiez,mentaient','mentirai,mentiras,mentira,mentirons,mentirez,mentiront','mentis,mentis,mentit,mentîmes,mentîtes,mentirent',false);
addV('ouvrir','avoir','ouvert','ouvre,ouvres,ouvre,ouvrons,ouvrez,ouvrent','ouvrais,ouvrais,ouvrait,ouvrions,ouvriez,ouvraient','ouvrirai,ouvriras,ouvrira,ouvrirons,ouvrirez,ouvriront','ouvris,ouvris,ouvrit,ouvrîmes,ouvrîtes,ouvrirent',false);
addV('nourrir','avoir','nourri','nourris,nourris,nourrit,nourrissons,nourrissez,nourrissent','nourrissais,nourrissais,nourrissait,nourrissions,nourrissiez,nourrissaient','nourrirai,nourriras,nourrira,nourrirons,nourrirez,nourriront','nourris,nourris,nourrit,nourrîmes,nourrîtes,nourrirent',false);
addV('cueillir','avoir','cueilli','cueille,cueilles,cueille,cueillons,cueillez,cueillent','cueillais,cueillais,cueillait,cueillions,cueilliez,cueillaient','cueillerai,cueilleras,cueillera,cueillerons,cueillerez,cueilleront','cueillis,cueillis,cueillit,cueillîmes,cueillîtes,cueillirent',false);

const PRIORITY_VERBS = Object.keys(V).filter(k => V[k].priority);
const ALL_VERBS  = Object.keys(V);
const ALL_TENSES = Object.keys(TEMPS);

// ================================================================
// CONJUGAISON : logique
// ================================================================
function getConj(inf, tense, person) {
  const d = V[inf]; if (!d) return '?';
  const t = TEMPS[tense];
  if (t.simple) return d[tense][person];
  const isEtre = d.g === 'être';
  return (isEtre ? ETRE_AUX : AVOIR_AUX)[t.auxT][person] + ' ' + d.pp;
}

function getDisplayConj(inf, tense, person) {
  const d = V[inf]; if (!d) return '?';
  const t = TEMPS[tense];
  if (t.simple) return d[tense][person];
  const isEtre = d.g === 'être';
  const aux = (isEtre ? ETRE_AUX : AVOIR_AUX)[t.auxT][person];
  const pp = d.pp;
  if (!isEtre) return `${aux} ${pp}`;
  return [`${aux} ${pp}(e)`,`${aux} ${pp}(e)`,`${aux} ${pp} / ${pp}e`,
    `${aux} ${pp}s/(es)`,`${aux} ${pp}(e)(s)`,`${aux} ${pp}s / ${pp}es`][person];
}

function checkConjCorrect(userInput, inf, tense, person) {
  const expected = norm(getConj(inf, tense, person));
  const user = norm(userInput);
  if (user === expected) return true;
  const d = V[inf];
  if (d && d.g === 'être' && !TEMPS[tense].simple) {
    const pp = d.pp;
    const aux = norm((ETRE_AUX[TEMPS[tense].auxT] || [])[person] || '');
    for (const v of [pp, pp+'e', pp+'s', pp+'es']) {
      if (user === `${aux} ${v}`) return true;
    }
  }
  return false;
}

// ================================================================
// QUESTION POOLS
// ================================================================
function buildNormalPool(stats) {
  const pool = [];
  ALL_VERBS.forEach(inf => {
    ALL_TENSES.forEach(tense => {
      for (let p = 0; p < 6; p++) {
        const s = getStat(stats, comboKey([inf, tense, p]));
        const rate = s.asked > 0 ? s.wrong / s.asked : 0;
        let w = V[inf].priority ? 1.4 : 0.7;
        if (s.asked === 0) w *= 0.8;
        else w *= (1 + rate * 2.5);
        pool.push({ inf, tense, person: p, w });
      }
    });
  });
  return pool;
}

function buildRevisionPool(errorCombos) {
  const pool = [];
  errorCombos.forEach(e => {
    const [inf, tense, p] = e.key.split('|');
    pool.push({ inf, tense, person: parseInt(p), w: 2 + e.rate * 3 });
  });
  ALL_VERBS.forEach(inf => {
    ALL_TENSES.forEach(tense => {
      for (let p = 0; p < 6; p++) pool.push({ inf, tense, person: p, w: 0.15 });
    });
  });
  return pool;
}
