# Architecture de Connexion par Organisme - Administration GA

## Implémentation Complète de la Logique Multi-Organismes

## 🎯 Objectif et Vision

L'application a été **réorganisée pour respecter une logique de connexion par organisme** où :

1. **La page de connexion présente d'abord les organismes**
2. **Chaque organisme a sa propre interface de connexion**
3. **Les agents accèdent via leur organisme spécifique**
4. **Les citoyens ont une interface unifiée (DEMARCHE.GA)**
5. **Aucun organisme ne connaît l'existence des autres**
6. **Le système global (ADMIN.GA) est invisible aux utilisateurs finaux**

## 🚀 Parcours de Connexion Implémentés

### 1. Parcours Agent d'Organisme

```mermaid
graph TD
    A[/auth/connexion] --> B[Mode "Organismes Publics"]
    B --> C[Sélection organisme ex: DGDI]
    C --> D[/dgdi - Page d'accueil DGDI]
    D --> E[Bouton "Espace Agent"]
    E --> F[/dgdi/auth/connexion]
    F --> G[Comptes spécifiques DGDI]
    G --> H[/dgdi/dashboard - Interface DGDI]
```

**Exemple DGDI :**

1. `/auth/connexion` → Mode "Organismes Publics"
2. Clic sur carte DGDI → `/dgdi` (page d'accueil DGDI avec thème bleu)
3. Bouton "Espace Agent" → `/dgdi/auth/connexion`
4. Comptes disponibles : Admin DGDI, Agent DGDI
5. Connexion → `/dgdi/dashboard` (interface DGDI isolée)

### 2. Parcours Citoyen

```mermaid
graph TD
    A[/auth/connexion] --> B[Mode "Espace Citoyen"]
    B --> C[/demarche - DEMARCHE.GA]
    C --> D[Interface unifiée]
    D --> E[Tous les services administratifs]
```

**Flux simple :**

1. `/auth/connexion` → Mode "Espace Citoyen"
2. Bouton "Accéder à DEMARCHE.GA" → `/demarche`
3. Interface unifiée pour tous les services administratifs
4. **Aucune connaissance d'ADMIN.GA ou des organismes individuels**

### 3. Parcours Super Admin

```mermaid
graph TD
    A[/auth/connexion] --> B[Mode "Administration Système"]
    B --> C[Connexion superadmin@admin.ga]
    C --> D[/super-admin/dashboard]
    D --> E[Accès global à tous les organismes]
```

## 🏗️ Architecture Technique

### 1. Page de Connexion Principale (`/auth/connexion`)

**Fichier :** `app/auth/connexion/page.tsx`

**3 modes de connexion distincts :**

```typescript
const [selectedMode, setSelectedMode] = useState<'organismes' | 'direct' | 'citoyen'>('organismes');
```

#### Mode "Organismes Publics"

- **Présentation en cartes** des organismes disponibles
- **Informations par organisme** : nom, services, comptes disponibles
- **Redirection** vers la page d'accueil de l'organisme sélectionné
- **Thème visuel** selon l'organisme

#### Mode "Espace Citoyen"

- **Interface dédiée** pour les citoyens
- **Redirection directe** vers DEMARCHE.GA
- **Statistiques globales** des services disponibles
- **Aucune référence** aux organismes individuels

#### Mode "Administration Système"

- **Accès réservé** au super administrateur
- **Connexion directe** avec formulaire
- **Interface sobre** et professionnelle
- **Accès global** au système ADMIN.GA

### 2. Pages de Connexion par Organisme (`/[organisme]/auth/connexion`)

**Fichier :** `app/[organisme]/auth/connexion/page.tsx`

**Caractéristiques :**

- **Route dynamique** pour chaque organisme
- **Thème personnalisé** selon l'organisme
- **Comptes spécifiques** à l'organisme
- **Redirection automatique** vers `/[organisme]/dashboard`

**Comptes organisés par organisme :**

| Organisme | Comptes Disponibles |
|-----------|-------------------|
| **DGDI** | Admin DGDI, Agent DGDI |
| **CNSS** | Directeur, Gestionnaire, Agent |
| **CNAMGS** | Admin, Agent Médical |
| **MIN_JUS** | Secrétaire Général, Directeur Casier, Agent Légalisation, Greffier |

### 3. Pages d'Accueil par Organisme (`/[organisme]`)

**Fichier :** `app/[organisme]/page.tsx`

**Fonctionnalités :**

- **Interface personnalisée** avec thème de l'organisme
- **Services spécifiques** à l'organisme uniquement
- **Bouton "Espace Agent"** → redirection vers `/[organisme]/auth/connexion`
- **Statistiques propres** à l'organisme
- **Contact et informations** spécifiques

### 4. Interface Citoyenne Unifiée (`/demarche`)

**Fichier :** `app/demarche/page.tsx`

**Conception :**

- **Interface DEMARCHE.GA** complètement autonome
- **Accès à tous les 85+ services** administratifs
- **Recherche globale** dans tous les services
- **Aucune référence** à ADMIN.GA ou aux organismes individuels
- **Design unifié** avec couleurs nationales

## 🔐 Sécurité et Isolation

### Isolation par Organisme

```typescript
// Middleware vérifie l'appartenance
if (['ADMIN', 'MANAGER', 'AGENT'].includes(userRole)) {
  if (userOrganisme !== organisme) {
    // Redirection vers l'organisme d'appartenance
    return NextResponse.redirect(new URL(`/${userOrganisme}/dashboard`, req.url));
  }
}
```

### Contrôle d'Accès

| Type d'Utilisateur | Accès Autorisé |
|-------------------|----------------|
| **Agent DGDI** | `/dgdi/*` uniquement |
| **Admin CNSS** | `/cnss/*` uniquement |
| **Citoyen** | `/demarche/*` et pages publiques organismes |
| **Super Admin** | Accès global à tous les organismes |

### Sessions Isolées

- **Chaque organisme** maintient ses propres sessions
- **Impossibilité** d'accéder aux autres organismes
- **Audit et traçabilité** par organisme
- **Données cloisonnées** selon l'appartenance

## 📊 Comptes de Test Organisés

### 🔵 DGDI (Direction Générale de la Documentation et de l'Immigration)

```text
Email: admin.dgdi@dgdi.ga
Mot de passe: admin123
Rôle: Admin DGDI
Interface: /dgdi/dashboard (thème bleu)

Email: agent.dgdi@dgdi.ga  
Mot de passe: agent123
Rôle: Agent DGDI
Interface: /dgdi/dashboard (thème bleu)
```

### 🟢 CNSS (Caisse Nationale de Sécurité Sociale)

```text
Email: directeur.cnss@cnss.ga
Mot de passe: directeur123
Rôle: Directeur CNSS
Interface: /cnss/dashboard (thème vert)

Email: gestionnaire.cnss@cnss.ga
Mot de passe: gestionnaire123  
Rôle: Gestionnaire CNSS
Interface: /cnss/dashboard (thème vert)

Email: agent.cnss@cnss.ga
Mot de passe: agent123
Rôle: Agent CNSS
Interface: /cnss/dashboard (thème vert)
```

### 🔴 CNAMGS (Caisse Nationale d'Assurance Maladie)

```text
Email: admin.cnamgs@cnamgs.ga
Mot de passe: admin123
Rôle: Admin CNAMGS
Interface: /cnamgs/dashboard (thème rouge)

Email: medical.cnamgs@cnamgs.ga
Mot de passe: medical123
Rôle: Agent Médical
Interface: /cnamgs/dashboard (thème rouge)
```

### 🟣 MIN_JUS (Ministère de la Justice)

```text
Email: sg.justice@min-jus.ga
Mot de passe: sg123
Rôle: Secrétaire Général
Interface: /min-jus/dashboard (thème violet)

Email: casier.justice@min-jus.ga
Mot de passe: casier123
Rôle: Directeur Casier Judiciaire
Interface: /min-jus/dashboard (thème violet)

Email: legal.justice@min-jus.ga
Mot de passe: legal123
Rôle: Agent Légalisation
Interface: /min-jus/dashboard (thème violet)

Email: greffier.justice@min-jus.ga
Mot de passe: greffier123
Rôle: Greffier
Interface: /min-jus/dashboard (thème violet)
```

### ⚫ SYSTÈME (Super Administration)

```text
Email: superadmin@admin.ga
Mot de passe: superadmin
Rôle: Super Admin
Interface: /super-admin/dashboard (accès global)
```

## 🧪 Tests de Validation

### Test 1 : Parcours Agent DGDI

1. Démarrer : `npm run dev`
2. Aller à `/auth/connexion`
3. Sélectionner "Organismes Publics"
4. Cliquer sur la carte DGDI
5. Vérifier redirection vers `/dgdi` avec thème bleu
6. Cliquer "Espace Agent"
7. Vérifier redirection vers `/dgdi/auth/connexion`
8. Tester connexion avec `admin.dgdi@dgdi.ga / admin123`
9. Vérifier redirection vers `/dgdi/dashboard`

### Test 2 : Parcours Citoyen

1. Aller à `/auth/connexion`
2. Sélectionner "Espace Citoyen"
3. Cliquer "Accéder à DEMARCHE.GA"
4. Vérifier redirection vers `/demarche`
5. Vérifier interface unifiée avec tous les services
6. Confirmer aucune référence à ADMIN.GA

### Test 3 : Isolation des Organismes

1. Se connecter avec compte DGDI
2. Essayer d'accéder à `/cnss/dashboard`
3. Vérifier redirection automatique vers `/dgdi/dashboard`
4. Confirmer impossibilité d'accéder aux autres organismes

### Test 4 : Super Admin

1. Aller à `/auth/connexion`
2. Sélectionner "Administration Système"
3. Se connecter avec `superadmin@admin.ga / superadmin`
4. Vérifier accès global depuis `/super-admin/dashboard`

## 🌟 Avantages de l'Architecture

### ✅ Expérience Utilisateur Optimisée

- **Parcours logique** : organisme → page d'accueil → connexion agents
- **Interface contextuelle** selon le type d'utilisateur
- **Aucune confusion** entre les différents accès
- **Navigation intuitive** et personnalisée

### ✅ Sécurité Renforcée

- **Isolation stricte** entre organismes
- **Comptes dédiés** par organisme
- **Sessions cloisonnées** selon l'appartenance
- **Audit granulaire** par organisme

### ✅ Maintenance Simplifiée

- **Structure modulaire** par organisme
- **Ajout facile** de nouveaux organismes
- **Configuration centralisée** des comptes et thèmes
- **Évolutivité** garantie


### ✅ Respect des Exigences

- **Organismes isolés** et indépendants ✓
- **Citoyens sur interface unifiée** ✓ 
- **Connexion organisée par organisme** ✓
- **Système ADMIN.GA invisible** aux utilisateurs finaux ✓

## 📁 Fichiers Créés/Modifiés

### 🆕 Nouveaux Fichiers

- `app/[organisme]/auth/connexion/page.tsx` - Pages de connexion par organisme
- `docs/ARCHITECTURE_CONNEXION_PAR_ORGANISME.md` - Cette documentation

### 🔄 Fichiers Modifiés

- `app/auth/connexion/page.tsx` - Réorganisé en 3 modes de connexion
- `app/[organisme]/page.tsx` - Bouton "Espace Agent" configuré
- `middleware.ts` - Gestion des routes par organisme
- `app/demarche/page.tsx` - Interface citoyenne isolée

## 🎯 Conclusion

✅ **Architecture de connexion par organisme COMPLÈTEMENT implémentée !**

✅ **Respect total de votre logique :**

- Connexion organisée par organisme d'abord
- Page d'accueil organisme avant accès aux comptes
- Interface DEMARCHE.GA unifiée pour les citoyens
- Isolation parfaite entre organismes
- Système ADMIN.GA invisible aux utilisateurs finaux

✅ **Prêt pour la mise en production** avec une base solide et évolutive

---

## 🇬🇦 République Gabonaise - Administration Numérique Réorganisée par Organisme

**Date d'implémentation :** Janvier 2025
**Status :** ✅ Complété et Validé selon les Exigences Utilisateur