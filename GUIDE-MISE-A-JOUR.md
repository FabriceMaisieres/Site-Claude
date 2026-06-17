# Mémo du Conseiller communal — Récap & guide de mise à jour

Site en ligne : https://maisieres.ch
Dépôt GitHub : FabriceMaisieres/Site-Claude (branche `main`)
Hébergement : Netlify (déploiement automatique à chaque `git push`)

---

## Ce qui a été fait (session du 20 mai 2026)

- Mise en ligne du site sur Netlify, connecté au dépôt GitHub.
- Nom de domaine **maisieres.ch** (+ www) raccordé via Infomaniak, avec HTTPS automatique.
- Authentification à deux facteurs (2FA) activée sur GitHub et Netlify, codes de récupération sauvegardés.
- Nouvelle section **Votations** (fédérales + cantonales) avec, pour chaque objet, le résultat de Chardonne comparé à Vaud et à la Suisse. Données officielles VoteInfo.
- Script de mise à jour des résultats de votation (`npm run update:votations`).
- Nouvelle section **Instruments du conseiller communal** (postulat, motion, projet de règlement, interpellation, amendement, pétition) dans la page Règlements communaux, avec les bases légales et la source officielle DGAIC.
- Correction de la configuration Netlify (`netlify.toml`) pour que les déploiements automatiques fonctionnent.

---

## Commandes utiles (à garder sous la main)

Toujours travailler dans le dossier du projet. Deux dossiers à connaître :
- Racine (pour Git) : `/Users/fabricemmacbookair/Documents/Site-Claude`
- Application (pour npm) : `/Users/fabricemmacbookair/Documents/Site-Claude/hub-conseiller`

### Voir le site en local (sur ton ordinateur)

```
cd /Users/fabricemmacbookair/Documents/Site-Claude/hub-conseiller
npm run dev
```

Puis ouvrir l'adresse affichée (http://localhost:3000 ou 3001). Pour arrêter : `Ctrl + C`.

### Mettre à jour les résultats de votation

À faire après un dimanche de votation, quand les résultats officiels sont publiés :

```
cd /Users/fabricemmacbookair/Documents/Site-Claude/hub-conseiller
npm run update:votations
```

### Publier les changements en ligne (Git → Netlify)

```
cd /Users/fabricemmacbookair/Documents/Site-Claude
git add .
git commit -m "Description de ce qui a changé"
git push
```

Netlify reconstruit et met le site à jour automatiquement (1 à 3 min). À suivre dans l'onglet « Deploys » de Netlify.

### En cas de message « index.lock : File exists » dans Git

```
rm -f /Users/fabricemmacbookair/Documents/Site-Claude/.git/index.lock
```

Puis refaire les commandes Git.

---

## Infos techniques clés

- Numéro OFS de Chardonne : **5882**
- Numéro du canton de Vaud : **22**
- Source des votations : VoteInfo / opendata.swiss (Confédération)
- Source des instruments du conseiller : aide-mémoire DGAIC, État de Vaud
- Données votations stockées dans : `hub-conseiller/src/data/votations.json`
- Script de mise à jour : `hub-conseiller/scripts/update-votations.mjs`

---

## Prochaine amélioration : automatiser le rafraîchissement des votations

Aujourd'hui, mettre à jour les résultats demande deux étapes manuelles : lancer `npm run update:votations`, puis committer/pousser. On peut rendre ça automatique. Deux pistes possibles, à étudier ensemble la prochaine fois :

**Piste 1 — Rafraîchir à chaque build Netlify (la plus simple).**
On modifie la commande de build Netlify pour qu'elle récupère les données fraîches avant de construire le site :
`npm run update:votations && npm run build`.
Combiné à un déclenchement planifié de Netlify (par ex. chaque dimanche soir de votation), le site se mettrait à jour tout seul, sans aucune manipulation de ta part et sans commit.

**Piste 2 — Automatisation via GitHub (GitHub Actions).**
Un petit programme planifié récupère les données, puis commit et pousse automatiquement les soirs de votation. Avantage : l'historique des résultats reste enregistré dans Git. Léger surcroît de configuration.

Recommandation : commencer par la piste 1, plus simple et sans risque. À implémenter quand tu veux.

---

## Points en suspens (pour plus tard, optionnels)

- Automatiser le rafraîchissement des votations (voir ci-dessus).
- Ajouter éventuellement la « question / simple vœu » comme 7e fiche d'instrument.
- Migration éventuelle du bloc `<style jsx>` vers un fichier CSS séparé.
- Ajouter Touch ID (passkey) sur GitHub et Netlify pour se connecter plus vite.
