# 🚀 Guide d'Installation et Test - DEMARCHE.GA

## 📋 Prérequis

- Node.js 18+ installé
- Base de données PostgreSQL configurée
- Variable d'environnement `DATABASE_URL` définie

## 🛠️ Installation et Configuration

### 1. Génération du Client Prisma
```bash
npx prisma generate
```

### 2. Synchronisation de la Base de Données
```bash
npx prisma db push
```

### 3. Peuplement avec les Données de Test
```bash
npx tsx scripts/seed-demarche-ga.ts
```

## 🔐 Comptes de Test Disponibles

Tous les comptes utilisent le mot de passe : **`Test123!`**

### Citoyens
- **Email :** `citoyen1@exemple.com`
- **Accès :** Dashboard citoyen avec démarches en cours

### Agents
- **Email :** `agent1@dgdi.ga`
- **Organisme :** DGDI
- **Accès :** Interface de traitement des dossiers

### Administrateurs d'Organisme
- **Email :** `admin@dgdi.ga`
- **Organisme :** DGDI
- **Accès :** Gestion des agents et services

### Super Administrateur
- **Email :** `admin@demarche.ga`
- **Accès :** Administration système complète

## 🌐 URLs de Test

### Pages Publiques
- **Page d'accueil :** `http://localhost:3000/demarche`
- **Connexion :** `http://localhost:3000/demarche/auth/connexion`

### Dashboards par Rôle
- **Citoyen :** `http://localhost:3000/demarche/citoyen/dashboard`
- **Agent :** `http://localhost:3000/demarche/agent/dashboard`
- **Admin :** `http://localhost:3000/demarche/admin/dashboard`
- **Super Admin :** `http://localhost:3000/super-admin/dashboard`

## ✅ Test du Système

### 1. Tester la Page d'Accueil
1. Aller sur `http://localhost:3000/demarche`
2. Vérifier le chargement des catégories de services
3. Tester la recherche de services
4. Vérifier les statistiques affichées

### 2. Tester l'Authentification
1. Aller sur `http://localhost:3000/demarche/auth/connexion`
2. Ouvrir la section "🧪 Comptes de démonstration"
3. Cliquer sur un email pour le remplir automatiquement
4. Se connecter et vérifier la redirection

### 3. Tester les Dashboards
1. **Dashboard Citoyen :** Vérifier les démarches en cours, notifications
2. **Dashboard Agent :** Vérifier la file de traitement des dossiers
3. **Dashboard Admin :** Vérifier la gestion des équipes et services

## 🔧 Données de Test Incluses

- **160+ Organismes** : DGDI, DGI, CNSS, CNAMGS, Mairies, Ministères...
- **150+ Services** : CNI, Passeport, Actes d'état civil, Permis...
- **Démarches d'exemple** : CNI et Passeport en cours pour `citoyen1`
- **Utilisateurs de test** : Tous les rôles représentés

## 🐛 Dépannage

### Base de données non initialisée
```bash
npx prisma db reset
npx prisma db push
npx tsx scripts/seed-demarche-ga.ts
```

### Erreur de connexion
- Vérifier que `DATABASE_URL` est définie
- Vérifier que PostgreSQL est démarré
- Vérifier les permissions d'accès

### Page 404 ou erreur de route
- Vérifier que le serveur Next.js est démarré : `npm run dev`
- Vérifier l'URL exacte dans le navigateur

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs dans la console
2. Vérifier la base de données avec `npx prisma studio`
3. Redémarrer le serveur de développement

---

**DEMARCHE.GA** - Plateforme officielle des démarches administratives du Gabon 🇬🇦
