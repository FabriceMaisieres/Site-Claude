#!/usr/bin/env node
/*
 * Met à jour src/data/votations.json avec les résultats officiels VoteInfo.
 *
 * Source : open data de la Confédération (Office fédéral de la statistique),
 *          publié sur opendata.swiss / voteinfo-app.ch.
 *
 * Usage :  node scripts/update-votations.mjs
 * Requis : Node 18 ou plus récent (la commande `fetch` doit exister).
 *
 * Le script récupère les dernières votations fédérales (résultat Suisse +
 * canton de Vaud + commune de Chardonne) et, si disponibles, les dernières
 * votations cantonales vaudoises. Il n'a PAS besoin du niveau communal.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// --- Paramètres -----------------------------------------------------------
const OFS_CHARDONNE = '5882';   // numéro OFS de la commune de Chardonne
const NO_CANTON_VAUD = '22';    // numéro du canton de Vaud
const NB_DATES = 4;             // nombre de dates de votation à récupérer

const DATASETS = {
  federal: 'echtzeitdaten-am-abstimmungstag-zu-eidgenoessischen-abstimmungsvorlagen',
  cantonal: 'echtzeitdaten-am-abstimmungstag-zu-kantonalen-abstimmungsvorlagen',
};

const MOIS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// --- Petits utilitaires ---------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(__dirname, '..', 'src', 'data', 'votations.json');

const toNum = (v) => (v == null || v === '' ? null : Number(v));
const pct1 = (v) => (v == null || v === '' ? null : Math.round(Number(v) * 10) / 10);
const eq = (a, b) => String(a) === String(b);

function dateLabelFr(yyyymmdd) {
  const y = yyyymmdd.slice(0, 4);
  const m = parseInt(yyyymmdd.slice(4, 6), 10);
  const d = parseInt(yyyymmdd.slice(6, 8), 10);
  return `${d} ${MOIS_FR[m - 1]} ${y}`;
}
const isoDate = (yyyymmdd) =>
  `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}

// Récupère et trie les ressources (une par date) d'un dataset opendata.swiss
async function listerDates(datasetId) {
  const url = `https://opendata.swiss/api/3/action/package_show?id=${datasetId}`;
  const data = await getJson(url);
  const resources = data?.result?.resources || [];
  const datees = resources
    .map((r) => {
      const u = r.download_url || r.url || '';
      const m = u.match(/(20\d{6})/); // une date AAAAMMJJ dans l'URL
      return m ? { date: m[1], url: u } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date));
  // dédoublonnage par date (on garde la première URL trouvée)
  const vues = new Set();
  return datees.filter((x) => (vues.has(x.date) ? false : vues.add(x.date)));
}

function titreFr(vorlage) {
  const arr = vorlage.vorlagenTitel || vorlage.vorlageTitel || [];
  const fr = arr.find((t) => (t.langKey || t.lang) === 'fr');
  return (fr?.text || arr[0]?.text || vorlage.vorlagenName || 'Objet sans titre').trim();
}

// Transforme un bloc "resultat" brut en valeurs exploitables
function lireResultat(r) {
  if (!r) return null;
  const oui = pct1(r.jaStimmenInProzent);
  const accepteOfficiel = r.vorlageAngenommen != null ? !!r.vorlageAngenommen : null;
  return {
    oui,
    accepte: accepteOfficiel != null ? accepteOfficiel : (oui != null ? oui > 50 : null),
    participation: pct1(r.stimmbeteiligungInProzent),
    ouiAbs: toNum(r.jaStimmenAbsolut),
    nonAbs: toNum(r.neinStimmenAbsolut),
  };
}

// --- Extraction FÉDÉRALE --------------------------------------------------
function extraireFederal(data) {
  const vorlagen = data?.schweiz?.vorlagen || data?.vorlagen || [];
  const objets = [];
  for (const v of vorlagen) {
    const national = lireResultat(v.resultat);
    if (!national || national.oui == null) continue;

    const kantone = v.kantone || v.schweiz?.kantone || [];
    const vaudK = kantone.find((k) => eq(k.geoLevelnummer, NO_CANTON_VAUD));
    const vaud = lireResultat(vaudK?.resultat);

    let chardonne = null;
    if (vaudK) {
      const gem = (vaudK.gemeinden || []).find((g) => eq(g.geoLevelnummer, OFS_CHARDONNE));
      chardonne = lireResultat(gem?.resultat);
    }

    const lieux = [];
    if (chardonne) lieux.push({ cle: 'chardonne', nom: 'Chardonne', ...chardonne });
    if (vaud) lieux.push({ cle: 'vaud', nom: 'Vaud', ...vaud });
    lieux.push({ cle: 'suisse', nom: 'Suisse', ...national });

    objets.push({
      niveau: 'federal',
      titre: titreFr(v),
      reference: { lieu: 'Suisse', oui: national.oui, accepte: national.accepte },
      lieux,
    });
  }
  return objets;
}

// --- Extraction CANTONALE (Vaud) — best effort ----------------------------
function extraireCantonalVaud(data) {
  // Le dataset cantonal regroupe les objets par canton.
  const kantone = data?.kantone || (data?.kanton ? [data.kanton] : []);
  const vaudK = kantone.find((k) => eq(k.geoLevelnummer, NO_CANTON_VAUD));
  if (!vaudK) return [];

  const vorlagen = vaudK.vorlagen || [];
  const objets = [];
  for (const v of vorlagen) {
    const cantonal = lireResultat(v.resultat);
    if (!cantonal || cantonal.oui == null) continue;

    const gem = (v.gemeinden || []).find((g) => eq(g.geoLevelnummer, OFS_CHARDONNE));
    const chardonne = lireResultat(gem?.resultat);

    const lieux = [];
    if (chardonne) lieux.push({ cle: 'chardonne', nom: 'Chardonne', ...chardonne });
    lieux.push({ cle: 'vaud', nom: 'Vaud', ...cantonal });

    objets.push({
      niveau: 'cantonal',
      titre: titreFr(v),
      reference: { lieu: 'Vaud', oui: cantonal.oui, accepte: cantonal.accepte },
      lieux,
    });
  }
  return objets;
}

// --- Programme principal --------------------------------------------------
async function main() {
  console.log('Mise à jour des votations depuis VoteInfo…\n');
  const parDate = new Map(); // 'AAAAMMJJ' -> { date, dateLabel, objets: [] }

  const ajoute = (yyyymmdd, objets) => {
    if (!objets.length) return;
    if (!parDate.has(yyyymmdd)) {
      parDate.set(yyyymmdd, { date: isoDate(yyyymmdd), dateLabel: dateLabelFr(yyyymmdd), objets: [] });
    }
    parDate.get(yyyymmdd).objets.push(...objets);
  };

  // 1) Fédéral (toujours disponible)
  try {
    const dates = await listerDates(DATASETS.federal);
    console.log(`Fédéral : ${dates.length} dates trouvées. Traitement des ${Math.min(NB_DATES, dates.length)} plus récentes.`);
    for (const d of dates.slice(0, NB_DATES)) {
      process.stdout.write(`  • ${dateLabelFr(d.date)} … `);
      try {
        const data = await getJson(d.url);
        const objets = extraireFederal(data);
        ajoute(d.date, objets);
        const ch = objets[0]?.lieux.find((l) => l.cle === 'chardonne');
        console.log(`${objets.length} objet(s)` + (ch ? `, Chardonne ${ch.oui}% oui` : ', Chardonne non trouvée'));
      } catch (e) {
        console.log(`échec (${e.message})`);
      }
    }
  } catch (e) {
    console.error('Erreur fédéral :', e.message);
  }

  // 2) Cantonal vaudois (best effort — peut être absent)
  try {
    const dates = await listerDates(DATASETS.cantonal);
    console.log(`\nCantonal : ${dates.length} dates trouvées. Recherche des objets vaudois sur les ${Math.min(NB_DATES, dates.length)} plus récentes.`);
    for (const d of dates.slice(0, NB_DATES)) {
      process.stdout.write(`  • ${dateLabelFr(d.date)} … `);
      try {
        const data = await getJson(d.url);
        const objets = extraireCantonalVaud(data);
        ajoute(d.date, objets);
        console.log(objets.length ? `${objets.length} objet(s) vaudois` : 'pas d\'objet vaudois');
      } catch (e) {
        console.log(`échec (${e.message})`);
      }
    }
  } catch (e) {
    console.log('\nCantonal indisponible :', e.message);
  }

  // 3) Construction du fichier final (dates les plus récentes d'abord)
  const votations = [...parDate.values()].sort((a, b) => b.date.localeCompare(a.date));
  // fédéral avant cantonal à l'intérieur d'une même date
  for (const v of votations) {
    v.objets.sort((a, b) => (a.niveau === b.niveau ? 0 : a.niveau === 'federal' ? -1 : 1));
  }

  if (!votations.length) {
    console.error('\nAucune donnée récupérée. Le fichier votations.json n\'a pas été modifié.');
    process.exit(1);
  }

  const sortie = {
    miseAJour: new Date().toISOString().slice(0, 10),
    demo: false,
    votations,
  };

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(sortie, null, 2) + '\n', 'utf8');

  const nbObjets = votations.reduce((n, v) => n + v.objets.length, 0);
  console.log(`\n✓ Écrit : ${OUT_FILE}`);
  console.log(`  ${votations.length} date(s), ${nbObjets} objet(s) au total.`);
  console.log('\nProchaine étape : vérifier le site (npm run dev), puis git add/commit/push pour déployer.');
}

main().catch((e) => {
  console.error('Erreur inattendue :', e);
  process.exit(1);
});
