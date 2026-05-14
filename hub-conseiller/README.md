# Hub Conseiller Communal - Chardonne

Site web centralisé pour rassembler toutes les informations relatives au mandat de conseiller communal à Chardonne.

## 📋 Contenu du Hub

- **Accueil** : Vue d'ensemble avec statistiques et accès rapide
- **Plan d'action** : 4 phases pour préparer et réussir votre mandat
- **Commissions** : Détails complets sur toutes les commissions (Finances, Gestion, Recours, Ad hoc)
- **Règlement** : Structure complète du règlement du Conseil communal
- **Ressources** : Liens vers l'aide-mémoire cantonal, site officiel, législation, formations
- **Mes notes** : Espace personnel pour vos réflexions

## 🚀 Installation

### Prérequis

- [Node.js](https://nodejs.org/) version 16 ou supérieure
- npm (inclus avec Node.js)

### Étapes d'installation

1. **Téléchargez le dossier complet** du projet sur votre ordinateur

2. **Ouvrez un terminal** dans le dossier du projet

3. **Installez les dépendances** :
   ```bash
   npm install
   ```

4. **Lancez le serveur de développement** :
   ```bash
   npm run dev
   ```

5. **Ouvrez votre navigateur** à l'adresse affichée (généralement http://localhost:3000)

## 🛠️ Commandes disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Crée une version optimisée pour la production
- `npm run preview` : Prévisualise la version de production localement

## 🌐 Déploiement (hébergement en ligne)

Vous avez plusieurs options gratuites pour héberger votre site :

### Option 1 : Netlify (Recommandé - Le plus simple)

1. Créez un compte gratuit sur [Netlify](https://www.netlify.com/)
2. Connectez votre compte GitHub/GitLab (ou téléchargez directement)
3. Sélectionnez votre projet
4. Configuration automatique détectée
5. Déployez en 1 clic !

**Ou en ligne de commande** :
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Option 2 : Vercel

1. Créez un compte gratuit sur [Vercel](https://vercel.com/)
2. Installez Vercel CLI :
   ```bash
   npm install -g vercel
   ```
3. Déployez :
   ```bash
   npm run build
   vercel --prod
   ```

### Option 3 : GitHub Pages

1. Créez un repository GitHub pour votre projet
2. Modifiez `vite.config.js` pour ajouter la base URL :
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/nom-de-votre-repo/'
   })
   ```
3. Installez gh-pages :
   ```bash
   npm install --save-dev gh-pages
   ```
4. Ajoutez ces scripts dans `package.json` :
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
5. Déployez :
   ```bash
   npm run deploy
   ```

### Option 4 : Cloudflare Pages

1. Créez un compte sur [Cloudflare Pages](https://pages.cloudflare.com/)
2. Connectez votre repository Git
3. Configuration de build :
   - Build command : `npm run build`
   - Build output directory : `dist`
4. Déployez !

## 📁 Structure du projet

```
hub-conseiller/
├── index.html          # Page HTML principale
├── package.json        # Dépendances et scripts
├── vite.config.js      # Configuration Vite
├── src/
│   ├── main.jsx        # Point d'entrée React
│   ├── App.jsx         # Composant principal du Hub
│   └── index.css       # Styles globaux et variables CSS
└── README.md           # Ce fichier
```

## 🎨 Personnalisation

Le site utilise des **variables CSS** pour les couleurs et s'adapte automatiquement au mode clair/sombre de votre système.

Pour personnaliser les couleurs, modifiez les variables dans `src/index.css`.

## 🔄 Mise à jour du contenu

Pour ajouter ou modifier du contenu :

1. Ouvrez `src/App.jsx`
2. Modifiez les objets de données :
   - `commissions` : Liste des commissions
   - `planAction` : Phases du plan d'action
   - `ressources` : Liens externes
   - `reglement` : Structure du règlement
3. Sauvegardez, le site se recharge automatiquement en mode développement

## 📱 Support mobile

Le site est entièrement responsive et fonctionne parfaitement sur mobile, tablette et ordinateur.

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que Node.js est bien installé : `node --version`
2. Supprimez `node_modules` et réinstallez : 
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Vérifiez les erreurs dans la console du navigateur (F12)

## 📝 Licence

Ce projet est créé pour un usage personnel dans le cadre du mandat de conseiller communal à Chardonne.

---

**Créé avec ❤️ pour faciliter votre mandat de conseiller communal**
