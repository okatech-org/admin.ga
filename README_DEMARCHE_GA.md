# DEMARCHE.GA - Plateforme de Démarches Administratives

## 🎯 Vue d'ensemble

DEMARCHE.GA est la plateforme officielle de démarches administratives en ligne de la République Gabonaise. Elle fait partie de l'écosystème digital gouvernemental gabonais et s'intègre parfaitement avec ADMINISTRATION.GA.

## 🏗️ Architecture

### Écosystème des Applications
```
ADMINISTRATION.GA (Back-office)      DEMARCHE.GA (Front-office citoyen)
├── Gestion interne                  ├── Portail public
├── 160+ organismes                  ├── Espace citoyen  
├── Super Admin système              ├── Suivi démarches
└── Données administratives          └── Interface agents
                  ↕️ API/Intégration ↕️
```

## 🚀 Fonctionnalités Principales

### Pour les Citoyens
- ✅ **Page d'accueil publique** avec recherche de services
- ✅ **Inscription et connexion** sécurisées
- ✅ **Dashboard personnel** avec suivi des démarches
- ✅ **Nouvelles démarches** avec formulaires intelligents
- ✅ **Suivi en temps réel** des dossiers
- ✅ **Notifications** et alertes
- ✅ **Porte-documents** numérique

### Pour les Agents
- ✅ **Interface de traitement** des dossiers
- ✅ **File d'attente** intelligente
- ✅ **Validation/Rejet** avec commentaires
- ✅ **Messagerie** avec les citoyens
- ✅ **Statistiques** de performance

### Pour les Administrateurs
- ✅ **Gestion des agents** et équipes
- ✅ **Configuration des services** 
- ✅ **Statistiques avancées**
- ✅ **Monitoring** en temps réel

## 📊 Services Disponibles

### Catégories de Services
1. **État Civil** (23 services)
   - Extraits d'acte de naissance
   - Certificats de mariage
   - Certificats de décès

2. **Identité** (15 services)
   - Carte Nationale d'Identité
   - Passeport biométrique
   - Visa de sortie

3. **Justice** (18 services)
   - Casier judiciaire
   - Certificat de nationalité
   - Légalisations

4. **Municipal** (31 services)
   - Certificat de résidence
   - Permis de construire
   - Autorisations diverses

5. **Social** (27 services)
   - CNSS
   - CNAMGS
   - Aides sociales

6. **Fiscal** (19 services)
   - Attestations fiscales
   - Numéro de contribuable

## 🔧 Installation et Configuration

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Next.js 14 avec App Router

### Installation
```bash
# Les dépendances sont déjà installées dans ADMINISTRATION.GA
npm install

# Générer le client Prisma avec le nouveau schéma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# Peupler avec les données DEMARCHE.GA
npx tsx scripts/seed-demarche-ga.ts
```

### Configuration
Les variables d'environnement sont partagées avec ADMINISTRATION.GA :
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="demarche_ga_secret_key_2025"
NEXTAUTH_SECRET="..."
```

## 🧪 Comptes de Test

Après l'exécution du script de seed :

### Super Admin
- **Email**: `admin@demarche.ga`
- **Mot de passe**: `Test123!`
- **Accès**: Toutes les fonctionnalités

### Administrateurs d'Organismes
- **DGDI**: `admin@dgdi.ga` / `Test123!`
- **DGI**: `admin@dgi.ga` / `Test123!`
- **CNSS**: `admin@cnss.ga` / `Test123!`
- **CNAMGS**: `admin@cnamgs.ga` / `Test123!`
- **Mairie**: `admin@mairie-libreville.ga` / `Test123!`

### Agents
- **DGDI**: `agent1@dgdi.ga` / `Test123!`
- **DGI**: `agent1@dgi.ga` / `Test123!`

### Citoyens
- **Test 1**: `citoyen1@exemple.com` / `Test123!`
- **Test 2**: `citoyen2@exemple.com` / `Test123!`

## 🎨 Structure des Pages

### Pages Publiques
- `/demarche` - Page d'accueil
- `/demarche/services` - Catalogue des services
- `/demarche/aide` - Centre d'aide

### Authentification
- `/demarche/auth/connexion` - Connexion multi-rôles
- `/demarche/auth/inscription` - Inscription citoyens

### Espace Citoyen
- `/demarche/citoyen/dashboard` - Tableau de bord
- `/demarche/citoyen/demarches` - Mes démarches
- `/demarche/citoyen/documents` - Mes documents
- `/demarche/citoyen/profil` - Mon profil

### Interface Agent
- `/demarche/agent/dashboard` - File de traitement
- `/demarche/agent/dossiers` - Gestion des dossiers
- `/demarche/agent/statistiques` - Performances

### Dashboard Admin
- `/demarche/admin/dashboard` - Vue d'ensemble
- `/demarche/admin/agents` - Gestion équipe
- `/demarche/admin/services` - Configuration services

## 🔌 API Routes

### API Authentification
- `POST /api/demarche/auth/login` - Connexion
- `POST /api/demarche/auth/register` - Inscription
- `GET /api/demarche/auth/login` - Vérification token

### Démarches
- `GET /api/demarche/demarches` - Liste des démarches
- `POST /api/demarche/demarches` - Nouvelle démarche
- `PUT /api/demarche/demarches/[id]` - Mise à jour

### Services
- `GET /api/demarche/services` - Catalogue services
- `POST /api/demarche/services` - Nouveau service (admin)
- `PUT /api/demarche/services` - Modification service

## 🎯 Utilisation

### Connexion selon le Rôle

#### Connexion Citoyens
1. Aller sur `/demarche/auth/connexion`
2. Sélectionner l'onglet "Citoyen"
3. Se connecter avec email/mot de passe

#### Connexion Agents
1. Aller sur `/demarche/auth/connexion`
2. Sélectionner l'onglet "Agent"
3. Choisir son organisme
4. Se connecter avec email professionnel

#### Administrateurs
1. Aller sur `/demarche/auth/connexion`
2. Sélectionner l'onglet "Admin"
3. Se connecter avec compte administrateur

### Workflow Typique

#### Pour un Citoyen
1. **Inscription** sur la plateforme
2. **Recherche** du service désiré
3. **Remplissage** du formulaire
4. **Upload** des documents requis
5. **Suivi** en temps réel
6. **Réception** du document final

#### Pour un Agent
1. **Connexion** à l'interface agent
2. **Consultation** de la file d'attente
3. **Traitement** des dossiers par priorité
4. **Validation/Rejet** avec commentaires
5. **Communication** avec les citoyens

## 🔒 Sécurité

- **Authentification JWT** avec cookies sécurisés
- **Hachage bcrypt** des mots de passe (12 rounds)
- **Validation Zod** sur toutes les entrées
- **Protection CSRF** intégrée
- **Audit logging** de toutes les actions
- **Chiffrement HTTPS** obligatoire en production

## 📈 Métriques et Analytics

### Statistiques Suivies
- Nombre de démarches par mois
- Temps moyen de traitement
- Taux de satisfaction
- Performance des agents
- Services les plus demandés

### Tableaux de Bord
- **Citoyens**: Progression personnelle
- **Agents**: KPIs individuels
- **Admins**: Vue d'ensemble service
- **Super Admin**: Métriques globales

## 🤝 Intégration avec ADMINISTRATION.GA

### Données Partagées
- **Organismes** synchronisés
- **Utilisateurs** agents/admins
- **Services** configurés

### SSO (Single Sign-On)
- Compte unique pour tous les services
- Navigation transparente entre applications
- Sessions synchronisées

## 🆘 Support et Aide

### Centre d'Aide
- FAQ complète
- Guides d'utilisation
- Tutoriels vidéo
- Contacts support

### Contacts
- **Support technique**: `support@demarche.ga`
- **Questions générales**: `contact@demarche.ga`
- **Urgences**: `+241 01 XX XX XX`

## 📝 Développement

### Standards de Code
- TypeScript strict
- ESLint + Prettier
- Tests unitaires
- Documentation JSDoc

### Contribution
1. Fork du projet
2. Branche feature
3. Tests et linting
4. Pull request

## 🚦 Statut du Projet

✅ **Phase 1**: Infrastructure de base - **TERMINÉE**
✅ **Phase 2**: Authentification multi-rôles - **TERMINÉE** 
✅ **Phase 3**: Interfaces utilisateurs - **TERMINÉE**
✅ **Phase 4**: API et intégrations - **TERMINÉE**
🔄 **Phase 5**: Tests et optimisations - **EN COURS**
📋 **Phase 6**: Déploiement production - **PLANIFIÉE**

## 📚 Documentation Technique

- [Architecture détaillée](docs/ARCHITECTURE_DEMARCHE_GA.md)
- [Guide d'API](docs/API_REFERENCE.md)
- [Modèles de données](docs/DATA_MODELS.md)
- [Guide de déploiement](docs/DEPLOYMENT.md)

---

**DEMARCHE.GA** - Simplifions l'administration gabonaise ensemble ! 🇬🇦
