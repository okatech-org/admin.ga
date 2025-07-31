# 🔐 Configuration des Secrets GitHub

Ce guide explique comment configurer les secrets GitHub pour éviter les erreurs de workflow et permettre un déploiement automatisé complet.

## 📋 Secrets Requis

### 🔧 Secrets d'Application (Obligatoires pour la build)
```
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-chars
NEXTAUTH_URL=https://your-domain.com
```

### 🛡️ Sécurité (Optionnel)
```
SNYK_TOKEN=your-snyk-token-for-security-scanning
```

### 🚀 Déploiement Staging (Optionnel)
```
STAGING_HOST=staging.your-domain.com
STAGING_USER=deploy-user
STAGING_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----...
STAGING_URL=https://staging.your-domain.com
```

### 🏭 Déploiement Production (Optionnel)
```
PRODUCTION_HOST=your-domain.com
PRODUCTION_USER=deploy-user
PRODUCTION_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----...
PRODUCTION_URL=https://your-domain.com
```

### 📢 Notifications (Optionnel)
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
MONITORING_WEBHOOK=https://your-monitoring-service.com/webhook
```

## 🛠️ Comment Configurer les Secrets

### 1. Accéder aux Paramètres du Repository
1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** (⚙️)
3. Dans la sidebar, cliquez sur **Secrets and variables**
4. Sélectionnez **Actions**

### 2. Ajouter un Secret
1. Cliquez sur **New repository secret**
2. Entrez le nom du secret (ex: `DATABASE_URL`)
3. Entrez la valeur du secret
4. Cliquez sur **Add secret**

### 3. Secrets par Environnement
Vous pouvez aussi créer des **Environment secrets** pour :
- `staging` : Secrets spécifiques au staging
- `production` : Secrets spécifiques à la production

## ⚡ Gestion des Secrets Manquants

Les workflows ont été configurés avec `continue-on-error: true` pour les étapes optionnelles :

### ✅ Comportement Actuel
- **Secrets manquants** : Les étapes sont ignorées avec un avertissement
- **Build continue** : Le projet se compile avec des valeurs par défaut
- **Déploiement ignoré** : Les étapes de déploiement sont sautées si les secrets SSH ne sont pas configurés

### 🔍 Workflow de Validation
Utilisez le workflow `validate-secrets.yml` pour vérifier vos secrets :

```bash
# Via GitHub UI : Actions > Validate Secrets > Run workflow
# Ou via CLI GitHub :
gh workflow run validate-secrets.yml
```

## 🎯 Configuration Minimale

Pour une configuration minimale fonctionnelle :

```bash
# Secrets essentiels pour la build
DATABASE_URL=postgresql://localhost:5432/administration_ga
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
```

## 🚨 Sécurité des Secrets

### ⚠️ Bonnes Pratiques
- ✅ Utilisez des clés fortes et uniques
- ✅ Rotation régulière des secrets
- ✅ Accès limité aux collaborateurs nécessaires
- ✅ Surveillance des logs d'accès

### ❌ À Éviter
- ❌ Secrets hardcodés dans le code
- ❌ Secrets partagés entre environnements
- ❌ Secrets simples ou prévisibles

## 🔧 Génération des Secrets

### NextAuth Secret
```bash
openssl rand -base64 32
```

### Clé SSH pour Déploiement
```bash
ssh-keygen -t ed25519 -C "github-actions@your-domain.com"
# Utilisez la clé privée pour STAGING_SSH_KEY/PRODUCTION_SSH_KEY
# Ajoutez la clé publique sur vos serveurs
```

### Database URL
```bash
# Format PostgreSQL
postgresql://username:password@host:port/database

# Exemple local
postgresql://postgres:password@localhost:5432/administration_ga

# Exemple production
postgresql://admin:securepass@db.your-domain.com:5432/administration_ga
```

## 📞 Support

En cas de problème avec la configuration des secrets :
1. Vérifiez les logs des workflows GitHub Actions
2. Utilisez le workflow `validate-secrets.yml`
3. Consultez la documentation GitHub Actions

## 🔄 Mise à Jour des Secrets

Pour modifier un secret existant :
1. Allez dans Settings > Secrets and variables > Actions
2. Cliquez sur le nom du secret à modifier
3. Cliquez sur **Update**
4. Entrez la nouvelle valeur
5. Cliquez sur **Update secret**

---

> **💡 Astuce** : Les workflows continueront de fonctionner même sans tous les secrets configurés. Ajoutez-les progressivement selon vos besoins de déploiement. 
