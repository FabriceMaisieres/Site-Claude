# ⚡ Aide-mémoire RAPIDE - Commandes Terminal

## 🚀 Démarrage rapide (première fois)

```bash
# 1. Créer le projet
npm create vite@latest chardonne-archives -- --template react

# 2. Aller dans le dossier
cd chardonne-archives

# 3. Installer les dépendances
npm install
npm install lucide-react

# 4. Remplacer src/App.jsx par le fichier fourni

# 5. Lancer !
npm run dev
```

**➡️ Ouvrir le navigateur sur : http://localhost:5173**

---

## 📌 Commandes quotidiennes

### Démarrer le site
```bash
cd chardonne-archives
npm run dev
```

### Arrêter le site
```bash
Ctrl + C
```

### Créer la version finale
```bash
npm run build
```

---

## 🔥 Commandes essentielles

| Ce que tu veux faire | Commande |
|---------------------|----------|
| **Démarrer le site** | `npm run dev` |
| **Arrêter le site** | `Ctrl + C` |
| **Build production** | `npm run build` |
| **Voir le build** | `npm run preview` |
| **Réinstaller tout** | `rm -rf node_modules && npm install` |
| **Vérifier le code** | `npm run lint` |

---

## 🌐 URLs locales

- **Développement** : http://localhost:5173
- **Preview build** : http://localhost:4173

---

## 🆘 Problèmes courants

### ❌ "Port already in use"
```bash
# Tuer le processus sur le port 5173
npx kill-port 5173
# OU changer le port dans vite.config.js
```

### ❌ "Module not found"
```bash
npm install
```

### ❌ Le site ne se recharge pas
```bash
Ctrl + C
npm run dev
```

### ❌ Erreurs bizarres
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📂 Structure simple

```
chardonne-archives/
├── src/
│   └── App.jsx        ← TON FICHIER ICI
├── package.json
└── vite.config.js
```

---

## ⚡ Workflow typique

```bash
# Matin
cd chardonne-archives
npm run dev

# Travail...
# Le site se recharge automatiquement quand tu modifies App.jsx

# Soir
Ctrl + C
```

---

## 🚢 Déployer en ligne

### Netlify (drag & drop)
```bash
npm run build
# Puis drag & drop du dossier dist/ sur netlify.com
```

### GitHub Pages
```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

---

## 💡 Tips

- ✅ Garde un terminal ouvert avec `npm run dev` pendant le développement
- ✅ Le site se recharge automatiquement à chaque sauvegarde
- ✅ Utilise `Ctrl + C` pour arrêter proprement
- ✅ Fait `npm run build` avant de déployer

---

**C'est tout ! Simple et efficace.** 🎯
