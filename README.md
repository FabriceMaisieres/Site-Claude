# 🏛️ Archives Institutionnelles - Commune de Chardonne

Site web des archives institutionnelles de la Commune de Chardonne (VD, Suisse)

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Commandes de développement](#commandes-de-développement)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
- [Technologies utilisées](#technologies-utilisées)

---

## 🔧 Prérequis

Avant de commencer, assure-toi d'avoir installé :

- **Node.js** version 18 ou supérieure
- **npm** (inclus avec Node.js) ou **yarn**

Vérifier les versions :
```bash
node --version   # doit afficher v18.x.x ou supérieur
npm --version    # doit afficher 9.x.x ou supérieur
```

---

## 📦 Installation

### Option 1 : Projet React existant (Create React App)

Si tu as déjà un projet React, remplace simplement le fichier `src/App.jsx` :

```bash
# Copier le fichier App.jsx dans ton projet
cp App.jsx /chemin/vers/ton/projet/src/App.jsx

# Installer les dépendances
cd /chemin/vers/ton/projet
npm install lucide-react
```

### Option 2 : Créer un nouveau projet depuis zéro

```bash
# 1. Créer un nouveau projet React avec Vite (recommandé)
npm create vite@latest chardonne-archives -- --template react

# 2. Aller dans le dossier
cd chardonne-archives

# 3. Installer les dépendances
npm install

# 4. Installer Lucide React (icônes)
npm install lucide-react

# 5. Copier le fichier App.jsx
cp /chemin/vers/App.jsx src/App.jsx

# 6. Lancer le serveur de développement
npm run dev
```

---

## 🚀 Commandes de développement

### Démarrer le serveur de développement

```bash
npm run dev
```
- Ouvre le navigateur sur `http://localhost:5173` (Vite) ou `http://localhost:3000` (CRA)
- Le site se recharge automatiquement à chaque modification
- Hot Module Replacement (HMR) activé

### Arrêter le serveur

```bash
# Dans le terminal, appuie sur :
Ctrl + C
```

### Build de production

```bash
npm run build
```
- Crée un dossier `dist/` (Vite) ou `build/` (CRA)
- Fichiers optimisés et minifiés
- Prêts pour le déploiement

### Prévisualiser le build

```bash
npm run preview
```
- Teste le build de production localement
- Simule l'environnement de production

### Linter (vérification du code)

```bash
npm run lint
```
- Vérifie les erreurs de syntaxe
- Applique les règles ESLint

---

## 📁 Structure du projet

```
chardonne-archives/
├── public/
│   └── vite.svg                 # Favicon par défaut
├── src/
│   ├── App.jsx                  # 🔥 Application principale
│   ├── main.jsx                 # Point d'entrée React
│   └── index.css                # Styles globaux (optionnel)
├── package.json                 # Dépendances du projet
├── vite.config.js               # Configuration Vite
└── README.md                    # Ce fichier
```

### Fichier principal : `App.jsx`

Le fichier `App.jsx` contient :
- ✅ Les 3 logos officiels (Suisse, Vaud, Chardonne) en base64
- ✅ Le règlement du Conseil communal complet
- ✅ Les commissions et leurs compositions
- ✅ Les documents officiels avec liens
- ✅ La carte avec 86 rues géolocalisées
- ✅ Date, heure et météo en temps réel
- ✅ Design responsive (mobile/desktop)

---

## 🌐 Déploiement

### Option 1 : Netlify (le plus simple)

```bash
# 1. Build le projet
npm run build

# 2. Installer Netlify CLI
npm install -g netlify-cli

# 3. Déployer
netlify deploy --prod
```

Ou drag & drop du dossier `dist/` sur netlify.com

### Option 2 : Vercel

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Déployer
vercel --prod
```

### Option 3 : GitHub Pages

```bash
# 1. Installer gh-pages
npm install --save-dev gh-pages

# 2. Ajouter dans package.json :
"homepage": "https://tonusername.github.io/chardonne-archives",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# 3. Déployer
npm run deploy
```

### Option 4 : Serveur web classique

```bash
# 1. Build le projet
npm run build

# 2. Upload le contenu de dist/ via FTP/SFTP
# vers ton serveur web (Apache, Nginx, etc.)
```

---

## 🛠️ Technologies utilisées

- **React 18** - Framework JavaScript
- **Vite** - Build tool moderne et rapide
- **Lucide React** - Bibliothèque d'icônes
- **JavaScript ES6+** - Langage de programmation

### Dépendances principales

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.446.0"
  }
}
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas

```bash
# 1. Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# 2. Réinstaller les dépendances
npm install

# 3. Relancer
npm run dev
```

### Port déjà utilisé

```bash
# Changer le port dans vite.config.js :
export default {
  server: {
    port: 3001
  }
}
```

### Erreur "Module not found: lucide-react"

```bash
npm install lucide-react
```

### Build échoue

```bash
# Vérifier qu'il n'y a pas d'erreurs dans le code
npm run lint

# Build avec logs détaillés
npm run build -- --debug
```

---

## 📝 Commandes utiles récapitulées

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Créer le build de production |
| `npm run preview` | Prévisualiser le build |
| `npm run lint` | Vérifier le code |
| `Ctrl + C` | Arrêter le serveur |
| `npm install` | Installer les dépendances |

---

## 📫 Contact

Pour toute question concernant le site :
- Site officiel : [www.chardonne.ch](https://www.chardonne.ch)
- Email : info@chardonne.ch

---

## 📄 Licence

Ce projet contient des données publiques de la Commune de Chardonne.
Les logos et armoiries sont la propriété de leurs détenteurs respectifs.

---

## 🎯 Notes importantes

### Logos intégrés en base64
Les 3 logos (Suisse, Vaud, Chardonne) sont encodés en base64 directement dans le fichier App.jsx. Cela rend l'application complètement autonome, mais augmente la taille du fichier (~190KB).

### Météo en temps réel
L'application récupère la météo de Chardonne via une API externe. Une connexion internet est nécessaire pour cette fonctionnalité.

### Design responsive
Le site s'adapte automatiquement aux écrans mobile et desktop grâce aux media queries CSS intégrées.

---

**Dernière mise à jour : Mai 2026**
