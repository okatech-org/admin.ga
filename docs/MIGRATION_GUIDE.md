# 🗄️ Guide de Migration Base de Données - Administration.GA

## Vue d'ensemble

Ce guide détaille les migrations de base de données pour Administration.GA, incluant les nouvelles fonctionnalités d'IA et de base de connaissances.

## 📋 Nouvelles fonctionnalités

### 🤖 Système d'IA intégré
- **Recherche intelligente** des intervenants d'organismes
- **Base de connaissances** enrichie pour chaque organisme
- **Analyses SWOT** automatiques générées par l'IA
- **Gestion des postes administratifs** détectés automatiquement
- **Configuration des API** (Gemini, OpenAI, etc.)

### 📊 Tables ajoutées

1. **`api_configurations`** - Configuration des API d'IA
2. **`ai_search_logs`** - Logs des recherches d'IA effectuées
3. **`postes_administratifs`** - Postes administratifs détectés/gérés
4. **`ai_intervenants`** - Intervenants trouvés par l'IA
5. **`organisme_knowledge`** - Base de connaissances par organisme
6. **`knowledge_analyses`** - Analyses SWOT et insights générés

## 🚀 Instructions de migration

### 1. Prérequis

```bash
# Vérifier Node.js et npm
node --version  # v18+
npm --version

# Vérifier Prisma
npx prisma --version

# Variables d'environnement requises
echo $DATABASE_URL  # Doit être configurée
```

### 2. Migration automatique (recommandée)

```bash
# Migration complète en une commande
./scripts/migrate.sh full
```

Cette commande exécute automatiquement :
- ✅ Backup de la base actuelle
- ✅ Génération des migrations
- ✅ Application des migrations
- ✅ Seeding des données de base
- ✅ Validation post-migration
- ✅ Nettoyage des anciens backups

### 3. Migration étape par étape (avancée)

```bash
# 1. Backup manuel
./scripts/migrate.sh backup

# 2. Générer la migration
./scripts/migrate.sh generate ai_knowledge_base

# 3. Appliquer les migrations
./scripts/migrate.sh apply

# 4. Seeding des données
./scripts/migrate.sh seed

# 5. Validation
./scripts/migrate.sh validate
```

### 4. Gestion des erreurs

```bash
# Voir l'état des migrations
./scripts/migrate.sh status

# Rollback en cas de problème
./scripts/migrate.sh rollback

# Reset complet (⚠️ ATTENTION)
./scripts/migrate.sh reset
```

## 📝 Détails des nouvelles tables

### APIConfiguration
Configuration des services d'IA externes

```sql
CREATE TABLE "api_configurations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL UNIQUE,
    "provider" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "apiKey" TEXT,
    "model" TEXT,
    "temperature" DOUBLE PRECISION DEFAULT 0.7,
    "maxTokens" INTEGER DEFAULT 2048,
    -- ... autres champs
);
```

**Données de base :**
- Configuration Gemini Pro
- Configuration Gemini Vision
- Paramètres de rate limiting

### PosteAdministratif
Gestion hiérarchique des postes

```sql
CREATE TABLE "postes_administratifs" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "code" TEXT UNIQUE,
    "level" "PosteLevel" NOT NULL,
    "parentId" TEXT,
    "isAIDetected" BOOLEAN DEFAULT false,
    -- ... autres champs
);
```

**Niveaux hiérarchiques :**
- `DIRECTION` - Directeur, Ministre, Président
- `CHEF_SERVICE` - Chef de service/bureau
- `RESPONSABLE` - Responsable d'unité
- `AGENT` - Agent administratif
- `STAGIAIRE` - Stagiaire/apprenti

### OrganismeKnowledge
Base de connaissances enrichie

```sql
CREATE TABLE "organisme_knowledge" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL UNIQUE,
    "category" "KnowledgeSegmentCategory" NOT NULL,
    "importance" "KnowledgeImportance" NOT NULL,
    "completude" INTEGER DEFAULT 0,
    "aiConfidence" DOUBLE PRECISION DEFAULT 0.0,
    -- ... métriques et insights
);
```

**Segmentation intelligente :**
- **Catégorie :** STRATEGIQUE, OPERATIONNEL, SUPPORT, TECHNIQUE
- **Importance :** CRITIQUE, IMPORTANTE, NORMALE, FAIBLE
- **Complexité :** HAUTE, MOYENNE, FAIBLE
- **Taille :** GRANDE, MOYENNE, PETITE

### AISearchLog
Traçabilité des recherches IA

```sql
CREATE TABLE "ai_search_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "status" "AISearchStatus" DEFAULT 'PENDING',
    "intervenantsFound" INTEGER DEFAULT 0,
    "confidenceScore" DOUBLE PRECISION,
    -- ... métadonnées de recherche
);
```

### AIIntervenant
Intervenants détectés par l'IA

```sql
CREATE TABLE "ai_intervenants" (
    "id" TEXT NOT NULL,
    "searchLogId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT,
    "posteTitre" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION DEFAULT 0.0,
    "isValidated" BOOLEAN DEFAULT false,
    -- ... données de validation
);
```

### KnowledgeAnalysis
Analyses SWOT et insights

```sql
CREATE TABLE "knowledge_analyses" (
    "id" TEXT NOT NULL,
    "knowledgeId" TEXT NOT NULL,
    "analysisType" TEXT DEFAULT 'SWOT',
    "strengths" JSONB NOT NULL,
    "weaknesses" JSONB NOT NULL,
    "opportunities" JSONB NOT NULL,
    "threats" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    -- ... métriques calculées
);
```

## 🔧 Index de performance

Les index suivants sont automatiquement créés :

```sql
-- Recherches IA
CREATE INDEX "ai_search_logs_userId_createdAt_idx" ON "ai_search_logs"("userId", "createdAt");
CREATE INDEX "ai_search_logs_organizationId_status_idx" ON "ai_search_logs"("organizationId", "status");

-- Base de connaissances
CREATE INDEX "organisme_knowledge_category_importance_idx" ON "organisme_knowledge"("category", "importance");
CREATE INDEX "knowledge_analyses_knowledgeId_analysisType_idx" ON "knowledge_analyses"("knowledgeId", "analysisType");

-- Postes administratifs
CREATE INDEX "postes_administratifs_level_isActive_idx" ON "postes_administratifs"("level", "isActive");
CREATE INDEX "postes_administratifs_isAIDetected_createdAt_idx" ON "postes_administratifs"("isAIDetected", "createdAt");

-- Intervenants IA
CREATE INDEX "ai_intervenants_organizationId_isValidated_idx" ON "ai_intervenants"("organizationId", "isValidated");
CREATE INDEX "ai_intervenants_email_idx" ON "ai_intervenants"("email");
```

## 📊 Données de seeding

### Configurations API
- **Gemini Pro** : Recherche textuelle (60 req/min)
- **Gemini Vision** : Analyse d'images (30 req/min)

### Postes administratifs (12 postes de base)
- Président de la République
- Premier Ministre  
- Ministre
- Directeur Général
- Secrétaire Général
- Chef de Service
- Agent
- Stagiaire
- etc.

### Organisations (7 organismes)
- Présidence de la République
- Primature
- Ministère de l'Économie et des Finances
- Ministère de la Santé
- Ministère de l'Éducation Nationale
- DGDI
- Mairie de Libreville

### Comptes démonstration
```
admin@administration.ga / Admin2024!
demo.citoyen@administration.ga / Demo2024!
demo.agent@administration.ga / Demo2024!
```

### Base de connaissances
- 7 bases de connaissances (1 par organisme)
- 7 analyses SWOT de base
- Configurations système pour l'IA

## 🔍 Validation post-migration

### Vérifications automatiques

```bash
# Test des nouvelles tables
SELECT count(*) FROM api_configurations;        -- Doit retourner 2
SELECT count(*) FROM postes_administratifs;     -- Doit retourner 12
SELECT count(*) FROM organisme_knowledge;       -- Doit retourner 7
SELECT count(*) FROM knowledge_analyses;        -- Doit retourner 7
```

### Test du client Prisma

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Test connexion
const users = await prisma.user.count();
console.log('Utilisateurs:', users);

// Test nouvelles tables
const apiConfigs = await prisma.aPIConfiguration.findMany();
console.log('Configs API:', apiConfigs.length);

// Test relations
const orgWithKnowledge = await prisma.organization.findFirst({
  include: { knowledge: true }
});
console.log('Organisation avec base de connaissances:', !!orgWithKnowledge?.knowledge);
```

## 🚨 Troubleshooting

### Erreurs fréquentes

#### 1. "DATABASE_URL not configured"
```bash
# Vérifier la variable
echo $DATABASE_URL

# Configurer si nécessaire
export DATABASE_URL="postgresql://user:password@localhost:5432/administration_ga"
```

#### 2. "Cannot find module '@prisma/client'"
```bash
# Regénérer le client
npx prisma generate
```

#### 3. "Migration conflicts"
```bash
# Voir l'état
npx prisma migrate status

# Résoudre les conflits
npx prisma migrate resolve --applied "20241127_ai_knowledge_base"
```

#### 4. "Table already exists"
```bash
# Marquer comme appliqué
npx prisma db push --accept-data-loss
```

### Logs détaillés

Les logs de migration sont dans :
- `logs/migration.log` - Logs des scripts
- `backups/migrations/` - Backups automatiques

### Rollback d'urgence

```bash
# Rollback automatique
./scripts/migrate.sh rollback

# Rollback manuel
psql $DATABASE_URL -f backups/migrations/backup_YYYYMMDD_HHMMSS.sql
```

## 📈 Performance

### Métriques attendues
- **Temps de migration** : 2-5 minutes
- **Taille base étendue** : +15-20MB
- **Index créés** : 8 nouveaux index
- **Requêtes optimisées** : <100ms pour recherches IA

### Optimisations incluses
- Index composites pour jointures fréquentes
- JSONB pour stockage flexible des métadonnées
- Contraintes de performance sur les relations
- Partitioning ready pour les logs d'IA

## 🎯 Prochaines étapes

Après migration réussie :

1. **Configurer l'API Gemini** dans `/super-admin/configuration`
2. **Tester la recherche IA** dans `/super-admin/utilisateurs`
3. **Vérifier les permissions** d'accès aux nouvelles fonctionnalités
4. **Former les utilisateurs** aux nouveaux outils IA
5. **Monitorer les performances** via les dashboards

---

✅ **Migration prête et testée !**

En cas de problème, consultez les logs ou contactez l'équipe technique : devops@administration.ga 
