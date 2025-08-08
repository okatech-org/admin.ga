# Prompt Cursor pour Développer DEMARCHE.GA

## 🎯 Contexte du Projet

Tu es un développeur expert en Next.js/TypeScript chargé de créer **DEMARCHE.GA**, la plateforme centrale de démarches administratives pour les citoyens gabonais. Cette application doit s'intégrer avec **ADMINISTRATION.GA** (plateforme interne d'administration) et servir de guichet unique numérique pour toutes les démarches administratives.

## 📋 Architecture Globale

### Écosystème des Applications
```
ADMINISTRATION.GA (Back-office)      DEMARCHE.GA (Front-office citoyen)
├── Gestion interne                  ├── Portail public
├── 160+ organismes                  ├── Espace citoyen  
├── Super Admin système              ├── Suivi démarches
└── Données administratives          └── Interface agents
                    ↕️ API/Intégration ↕️
```

## 🚀 Instructions de Développement

### Phase 1: Initialisation du Projet

```bash
# Créer le projet Next.js avec TypeScript et App Router
npx create-next-app@latest demarche-ga --typescript --app --tailwind --eslint
cd demarche-ga

# Installer les dépendances essentielles
npm install @prisma/client prisma
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-tabs
npm install lucide-react clsx tailwind-merge
npm install next-auth @auth/prisma-adapter
npm install sonner react-hook-form @hookform/resolvers zod
npm install date-fns recharts
npm install @tanstack/react-query @tanstack/react-table

# Installer shadcn/ui
npx shadcn-ui@latest init
```

### Phase 2: Configuration de Base

Créer la structure de fichiers suivante:

```
demarche-ga/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                # Page d'accueil publique
│   │   ├── services/
│   │   │   ├── page.tsx            # Catalogue des services
│   │   │   └── [id]/page.tsx       # Détail d'un service
│   │   ├── aide/page.tsx           # Centre d'aide et FAQ
│   │   └── actualites/page.tsx     # Actualités
│   ├── auth/
│   │   ├── connexion/page.tsx      # Page de connexion
│   │   ├── inscription/page.tsx    # Inscription citoyens
│   │   └── reset-password/page.tsx # Récupération mot de passe
│   ├── citoyen/
│   │   ├── layout.tsx              # Layout protégé citoyens
│   │   ├── dashboard/page.tsx      # Tableau de bord citoyen
│   │   ├── demarches/
│   │   │   ├── page.tsx            # Mes démarches
│   │   │   ├── nouvelle/page.tsx   # Nouvelle démarche
│   │   │   └── [id]/page.tsx       # Détail/suivi démarche
│   │   ├── documents/page.tsx      # Portefeuille documents
│   │   └── profil/page.tsx         # Gestion profil
│   ├── agent/
│   │   ├── layout.tsx              # Layout protégé agents
│   │   ├── dashboard/page.tsx      # Dashboard agent
│   │   ├── dossiers/
│   │   │   ├── page.tsx            # File de traitement
│   │   │   └── [id]/page.tsx       # Traitement dossier
│   │   └── messagerie/page.tsx     # Communication citoyens
│   ├── admin/
│   │   ├── layout.tsx              # Layout admin service
│   │   ├── dashboard/page.tsx      # Dashboard admin
│   │   ├── agents/page.tsx         # Gestion agents
│   │   ├── services/page.tsx       # Configuration services
│   │   └── statistiques/page.tsx   # Analytics service
│   └── super-admin/
│       ├── layout.tsx              # Layout super admin
│       ├── dashboard/page.tsx      # Dashboard système
│       ├── organismes/page.tsx     # Gestion organismes
│       ├── utilisateurs/page.tsx   # Tous les utilisateurs
│       └── monitoring/page.tsx     # Monitoring système
├── lib/
│   ├── auth.ts                     # Configuration NextAuth
│   ├── prisma.ts                   # Client Prisma
│   ├── constants.ts                # Constantes application
│   ├── utils.ts                    # Utilitaires
│   └── data/
│       ├── services-catalog.ts     # Catalogue services
│       └── organismes-gabon.ts     # Données organismes
├── components/
│   ├── ui/                         # Composants shadcn/ui
│   ├── layout/                     # Headers, footers, navs
│   ├── forms/                      # Formulaires réutilisables
│   └── dashboard/                  # Composants dashboards
├── prisma/
│   └── schema.prisma               # Schéma base de données
└── middleware.ts                   # Protection routes
```

### Phase 3: Schéma Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Énumérations
enum UserRole {
  CITOYEN
  AGENT
  ADMIN
  SUPER_ADMIN
}

enum DemarcheStatus {
  BROUILLON
  SOUMISE
  EN_TRAITEMENT
  EN_ATTENTE_INFO
  VALIDEE
  REJETEE
  COMPLETEE
}

enum OrganismeType {
  MINISTERE
  DIRECTION_GENERALE
  PREFECTURE
  MAIRIE
  PROVINCE
  INSTITUTION
  ORGANISME_SOCIAL
  SERVICE_SPECIALISE
}

enum ServiceCategory {
  ETAT_CIVIL
  IDENTITE
  JUDICIAIRE
  MUNICIPAL
  SOCIAL
  PROFESSIONNEL
  FISCAL
  EDUCATION
  SANTE
  TRANSPORT
}

// Modèles
model User {
  id              String    @id @default(cuid())
  email           String    @unique
  password        String
  role            UserRole  @default(CITOYEN)
  nom             String
  prenom          String
  telephone       String?
  dateNaissance   DateTime?
  lieuNaissance   String?
  adresse         String?
  ville           String?
  province        String?
  
  // Relations
  organisme       Organisme?  @relation(fields: [organismeId], references: [id])
  organismeId     String?
  demarches       Demarche[]
  documents       Document[]
  messages        Message[]
  notifications   Notification[]
  
  // Metadata
  emailVerified   DateTime?
  image           String?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  lastLogin       DateTime?
  isActive        Boolean    @default(true)
}

model Organisme {
  id              String         @id @default(cuid())
  code            String         @unique
  nom             String
  type            OrganismeType
  description     String?
  adresse         String?
  ville           String?
  province        String?
  telephone       String?
  email           String?
  siteWeb         String?
  
  // Relations
  services        Service[]
  agents          User[]
  demarches       Demarche[]
  
  // Metadata
  isActive        Boolean        @default(true)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model Service {
  id              String         @id @default(cuid())
  code            String         @unique
  nom             String
  description     String
  category        ServiceCategory
  
  // Informations service
  cout            Float?
  dureeEstimee    Int?          // En jours
  documentsRequis Json?         // Liste des documents requis
  procedure       String?       // Description de la procédure
  
  // Relations
  organisme       Organisme     @relation(fields: [organismeId], references: [id])
  organismeId     String
  demarches       Demarche[]
  formulaires     Formulaire[]
  
  // Metadata
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model Demarche {
  id              String         @id @default(cuid())
  numero          String         @unique // Format: DEM-2025-000001
  status          DemarcheStatus @default(BROUILLON)
  
  // Relations
  citoyen         User          @relation(fields: [citoyenId], references: [id])
  citoyenId       String
  service         Service       @relation(fields: [serviceId], references: [id])
  serviceId       String
  organisme       Organisme     @relation(fields: [organismeId], references: [id])
  organismeId     String
  agentTraitant   User?         @relation("AgentTraitant", fields: [agentId], references: [id])
  agentId         String?
  
  // Données
  donneesFormulaire Json
  documents       Document[]
  messages        Message[]
  historique      Historique[]
  
  // Dates importantes
  dateSoumission  DateTime?
  dateTraitement  DateTime?
  dateCompletion  DateTime?
  dateExpiration  DateTime?
  
  // Metadata
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model Document {
  id              String        @id @default(cuid())
  nom             String
  type            String        // Type MIME
  taille          Int           // En bytes
  url             String        // URL de stockage
  
  // Relations
  proprietaire    User          @relation(fields: [userId], references: [id])
  userId          String
  demarche        Demarche?     @relation(fields: [demarcheId], references: [id])
  demarcheId      String?
  
  // Metadata
  isPublic        Boolean       @default(false)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model Message {
  id              String        @id @default(cuid())
  contenu         String
  
  // Relations
  expediteur      User          @relation(fields: [expediteurId], references: [id])
  expediteurId    String
  demarche        Demarche      @relation(fields: [demarcheId], references: [id])
  demarcheId      String
  
  // Metadata
  lu              Boolean       @default(false)
  createdAt       DateTime      @default(now())
}

model Notification {
  id              String        @id @default(cuid())
  type            String
  titre           String
  message         String
  
  // Relations
  destinataire    User          @relation(fields: [userId], references: [id])
  userId          String
  
  // Metadata
  lu              Boolean       @default(false)
  createdAt       DateTime      @default(now())
}

model Formulaire {
  id              String        @id @default(cuid())
  nom             String
  description     String?
  schema          Json          // Schéma JSON du formulaire
  
  // Relations
  service         Service       @relation(fields: [serviceId], references: [id])
  serviceId       String
  
  // Metadata
  version         Int           @default(1)
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model Historique {
  id              String        @id @default(cuid())
  action          String
  details         String?
  
  // Relations
  demarche        Demarche      @relation(fields: [demarcheId], references: [id])
  demarcheId      String
  acteur          User?         @relation(fields: [acteurId], references: [id])
  acteurId        String?
  
  // Metadata
  createdAt       DateTime      @default(now())
}
```

### Phase 4: Configuration NextAuth

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organisme: true }
        })

        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.prenom} ${user.nom}`,
          role: user.role,
          organisme: user.organisme
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.organisme = user.organisme
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.organisme = token.organisme
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/connexion",
    error: "/auth/erreur",
  }
}
```

### Phase 5: Composants Clés à Développer

#### 1. Page d'Accueil Publique
```typescript
// app/(public)/page.tsx
// - Hero section avec recherche de services
// - Catégories de services populaires
// - Statistiques (services disponibles, démarches traitées)
// - Guide de démarrage rapide
// - Actualités et annonces
```

#### 2. Dashboard Citoyen
```typescript
// app/citoyen/dashboard/page.tsx
// - Vue d'ensemble des démarches (en cours, complétées)
// - Notifications récentes
// - Actions rapides (nouvelle démarche, documents)
// - Graphique de progression des démarches
```

#### 3. Formulaire de Démarche Intelligent
```typescript
// components/forms/formulaire-demarche.tsx
// - Formulaire dynamique basé sur le service sélectionné
// - Upload de documents avec preview
// - Validation en temps réel
// - Sauvegarde automatique des brouillons
// - Indicateur de progression
```

#### 4. Interface Agent de Traitement
```typescript
// app/agent/dossiers/[id]/page.tsx
// - Visualisation complète du dossier
// - Timeline des actions
// - Outils de validation/rejet
// - Messagerie intégrée avec le citoyen
// - Génération de documents officiels
```

#### 5. Dashboard Super Admin
```typescript
// app/super-admin/dashboard/page.tsx
// - Métriques système en temps réel
// - Monitoring des services
// - Gestion des organismes (CRUD)
// - Configuration globale
// - Logs et audit trail
```

### Phase 6: Intégration avec ADMINISTRATION.GA

```typescript
// lib/api/administration-ga.ts
export class AdministrationGAAPI {
  private baseURL = process.env.ADMIN_GA_API_URL

  // Récupérer la liste des organismes
  async getOrganismes() {
    const response = await fetch(`${this.baseURL}/api/organismes`)
    return response.json()
  }

  // Synchroniser les services
  async syncServices(organismeId: string) {
    const response = await fetch(`${this.baseURL}/api/organismes/${organismeId}/services`)
    return response.json()
  }

  // Vérifier les credentials d'un agent
  async verifyAgent(email: string, organismeCode: string) {
    const response = await fetch(`${this.baseURL}/api/agents/verify`, {
      method: 'POST',
      body: JSON.stringify({ email, organismeCode })
    })
    return response.json()
  }
}
```

### Phase 7: Données Initiales

```typescript
// lib/data/services-catalog.ts
export const servicesGabon = [
  // État Civil
  {
    code: "EC001",
    nom: "Acte de naissance",
    category: "ETAT_CIVIL",
    organismeType: "MAIRIE",
    cout: 2500,
    dureeEstimee: 3,
    documentsRequis: [
      "Certificat d'accouchement",
      "Pièce d'identité des parents",
      "Livret de famille"
    ]
  },
  // Identité
  {
    code: "ID001",
    nom: "Carte Nationale d'Identité",
    category: "IDENTITE",
    organismeType: "DIRECTION_GENERALE",
    organismeCode: "DGDI",
    cout: 5000,
    dureeEstimee: 7,
    documentsRequis: [
      "Acte de naissance",
      "Certificat de nationalité",
      "2 photos d'identité",
      "Justificatif de domicile"
    ]
  },
  // ... Plus de 150 services
]
```

### Phase 8: Scripts de Déploiement

```bash
# Script d'initialisation de la base de données
npx prisma generate
npx prisma db push

# Script de seed pour les données initiales
npx prisma db seed

# Build et déploiement
npm run build
npm run start
```

## 🎨 Design System

### Palette de Couleurs
```css
:root {
  --primary: #00A86B;        /* Vert gabonais */
  --secondary: #FFD700;      /* Or */
  --accent: #0055A4;         /* Bleu */
  --background: #F5F5F5;
  --foreground: #1A1A1A;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
}
```

### Composants UI Prioritaires
1. **Cards** pour les services et démarches
2. **Stepper** pour les formulaires multi-étapes
3. **Timeline** pour le suivi des démarches
4. **DataTable** pour la gestion des dossiers
5. **Charts** pour les statistiques
6. **Notifications** toast pour les feedbacks

## 🔐 Sécurité et Performance

### Sécurité
- Authentification JWT avec refresh tokens
- Protection CSRF
- Rate limiting sur les API
- Validation des inputs (Zod)
- Chiffrement des documents sensibles
- Audit logging de toutes les actions

### Performance
- SSR/SSG avec Next.js App Router
- Optimisation des images (next/image)
- Lazy loading des composants
- Mise en cache Redis
- Pagination des listes
- Optimistic UI updates

## 📝 Prompts Spécifiques pour Cursor

### Pour créer un nouveau service
```
"Créer un nouveau service administratif pour [NOM_SERVICE] dans la catégorie [CATEGORY] avec:
- Formulaire dynamique avec les champs: [LISTE_CHAMPS]
- Validation Zod
- Upload de documents requis: [LISTE_DOCUMENTS]
- Workflow de traitement en 3 étapes
- Notifications email/SMS aux étapes clés"
```

### Pour implémenter une fonctionnalité
```
"Implémenter [FONCTIONNALITÉ] avec:
- Interface utilisateur moderne (shadcn/ui)
- Gestion d'état avec React Query
- API route Next.js avec validation
- Gestion des erreurs et loading states
- Tests unitaires
- Responsive design"
```

### Pour optimiser
```
"Optimiser [COMPOSANT/PAGE] pour:
- Améliorer le temps de chargement
- Réduire les re-renders inutiles
- Implémenter le lazy loading
- Ajouter la mise en cache
- Optimiser les requêtes Prisma"
```

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev                  # Lancer le serveur de développement
npm run build               # Build de production
npm run start               # Lancer la production
npm run lint                # Vérifier le code
npm run test                # Lancer les tests

# Base de données
npx prisma studio           # Interface graphique BDD
npx prisma generate         # Générer le client Prisma
npx prisma db push          # Synchroniser le schéma
npx prisma db seed          # Peupler la BDD

# Composants
npx shadcn-ui add [component]  # Ajouter un composant UI
```

## 📚 Documentation et Ressources

- [Next.js 14 App Router](https://nextjs.org/docs)
- [Prisma avec PostgreSQL](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

## ✅ Checklist de Développement

- [ ] Configuration initiale du projet
- [ ] Schéma Prisma et base de données
- [ ] Authentification multi-rôles
- [ ] Pages publiques (accueil, services, aide)
- [ ] Espace citoyen complet
- [ ] Interface agent de traitement
- [ ] Dashboard administrateur service
- [ ] Super admin système
- [ ] Intégration ADMINISTRATION.GA
- [ ] Upload et gestion des documents
- [ ] Système de notifications
- [ ] Messagerie interne
- [ ] Génération de rapports
- [ ] Tests et optimisations
- [ ] Documentation utilisateur
- [ ] Déploiement production

---

**Note**: Ce prompt est conçu pour être utilisé avec Cursor AI. Copie-colle les sections pertinentes selon la fonctionnalité que tu développes. L'application doit être développée de manière itérative, en commençant par les fonctionnalités de base puis en ajoutant progressivement les modules avancés.
