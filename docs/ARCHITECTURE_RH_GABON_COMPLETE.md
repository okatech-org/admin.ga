# 🏛️ ARCHITECTURE DU SYSTÈME RH - ADMINISTRATION PUBLIQUE GABONAISE

## 📅 Date : Janvier 2025
## 🎯 Objectif : Implémenter la logique réelle de gestion des ressources humaines

---

## 📋 CONCEPTS FONDAMENTAUX

### 🔑 Définitions Clés

La logique administrative gabonaise repose sur **3 concepts distincts** :

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    📋 POSTES    │       │ 👤 FONCTIONNAIRES│       │   🔐 COMPTES    │
│   (Fonctions)   │   +   │   (Personnes)   │   =   │    (Actifs)     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ • Peuvent être  │       │ • Peuvent être  │       │ • Association   │
│   - Occupés     │       │   - En poste    │       │   Poste +       │
│   - Vacants     │       │   - En attente  │       │   Titulaire     │
│   - Gelés       │       │   - Détachés    │       │ • Toujours      │
│                 │       │   - Suspendus   │       │   occupés       │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### 📊 Répartition Réelle

```
141 ORGANISMES OFFICIELS
        │
        ├── 1298 POSTES CRÉÉS
        │    ├── 791 Postes Occupés → 791 COMPTES ACTIFS
        │    └── 507 Postes Vacants → OFFRES D'EMPLOI
        │
        └── 908 FONCTIONNAIRES
             ├── 791 En Poste (avec affectation)
             └── 117 En Attente (sans affectation)
```

---

## 🏗️ ARCHITECTURE TECHNIQUE

### 1. **Interface PosteOrganisme**

```typescript
interface PosteOrganisme {
  id: string;
  organisme_code: string;
  poste_id: string;
  poste_titre: string;
  niveau: 1 | 2 | 3;  // Direction, Encadrement, Exécution
  statut: 'OCCUPE' | 'VACANT' | 'GELE';
  titulaire_id?: string;  // Si occupé
  date_vacance?: Date;    // Si vacant
  salaire_base?: number;
  prerequis: string[];
}
```

### 2. **Interface Fonctionnaire**

```typescript
interface Fonctionnaire {
  id: string;
  matricule: string;  // Unique, format: MAT2025000001
  nom: string;
  prenom: string;
  
  // Situation administrative
  statut: 'EN_POSTE' | 'EN_ATTENTE' | 'DETACHE' | 'RETRAITE' | 'SUSPENDU';
  grade: 'A1' | 'A2' | 'B1' | 'B2' | 'C';
  anciennete_annees: number;
  
  // Si EN_POSTE
  poste_actuel?: {
    organisme_code: string;
    poste_id: string;
    poste_titre: string;
    date_affectation: Date;
  };
  
  // Historique et compétences
  affectations_precedentes: AffectationHistorique[];
  diplomes: Diplome[];
  competences: string[];
}
```

### 3. **Interface CompteActif**

```typescript
interface CompteActif {
  id: string;
  fonctionnaire_id: string;      // Lien vers le fonctionnaire
  poste_id: string;              // Lien vers le poste
  organisme_code: string;
  
  role_systeme: 'ADMIN' | 'MANAGER' | 'USER' | 'RECEPTIONIST';
  
  date_affectation: Date;
  statut: 'ACTIF' | 'INACTIF' | 'SUSPENDU';
  
  permissions: string[];
  derniere_evaluation?: Evaluation;
}
```

---

## 📈 QUOTAS ET RÈGLES PAR TYPE D'ORGANISME

### Configuration des Quotas

| Type d'Organisme | Min Postes | Max Postes | Taux Occupation Cible | Postes Obligatoires |
|------------------|------------|------------|----------------------|---------------------|
| **INSTITUTION_SUPREME** | 20 | 50 | 85% | Président, SG, DC, Réceptionniste |
| **MINISTERE** | 15 | 40 | 80% | Ministre, SG, DC, Réceptionniste |
| **DIRECTION_GENERALE** | 10 | 25 | 75% | DG, DGA, Réceptionniste |
| **ETABLISSEMENT_PUBLIC** | 8 | 20 | 70% | DG, Comptable, Réceptionniste |
| **GOUVERNORAT** | 8 | 15 | 85% | Gouverneur, SG, Réceptionniste |
| **MAIRIE** | 8 | 20 | 75% | Maire, SG, DST, Réceptionniste |

---

## 🔄 PROCESSUS D'AFFECTATION

### Algorithme d'Attribution

```
1. CRÉER TOUS LES POSTES
   └── Pour chaque organisme (141)
       ├── Créer postes obligatoires
       └── Ajouter postes supplémentaires selon quota

2. GÉNÉRER FONCTIONNAIRES
   └── Créer 70% du nombre de postes
       ├── 15% Grade A1
       ├── 15% Grade A2
       ├── 20% Grade B1
       ├── 25% Grade B2
       └── 25% Grade C

3. AFFECTER AUX POSTES
   └── Trier par priorité
       ├── Postes niveau 1 en premier
       ├── Fonctionnaires A1 en premier
       └── Vérifier compatibilité grade/poste

4. RÉSULTAT
   ├── Postes Occupés → COMPTES ACTIFS
   ├── Postes Vacants → OFFRES D'EMPLOI
   └── Fonctionnaires non affectés → EN ATTENTE
```

---

## 📊 STATISTIQUES DU SYSTÈME

### Vue d'Ensemble Actuelle

```
🏢 ORGANISMES
• 141 organismes officiels gabonais
• 65 organismes critiques (>50% postes vacants)

📋 POSTES
• 1298 postes créés (9.2 par organisme)
• 791 postes occupés (61%)
• 507 postes vacants (39%)

👥 FONCTIONNAIRES
• 908 fonctionnaires total
• 791 en poste (87%)
• 117 en attente d'affectation (13%)

🔐 COMPTES ACTIFS
• 791 comptes créés
• 60 Administrateurs
• 41 Managers
• 549 Utilisateurs
• 141 Réceptionnistes
```

### Top 5 Besoins de Recrutement

| Poste | Nombre Vacant | Priorité |
|-------|---------------|----------|
| Directeur de Département (DD) | 115 | 🔴 HAUTE |
| Informaticien (INFO) | 88 | 🔴 HAUTE |
| Comptable (COMPT) | 52 | 🔴 HAUTE |
| Directeur Général (DG) | 51 | 🔴 HAUTE |
| DG Adjoint (DGA) | 51 | 🔴 HAUTE |

---

## 🛠️ FONCTIONNALITÉS AVANCÉES

### 1. **Recherche de Postes Vacants**

```typescript
// Rechercher des postes de direction
const postesDirection = rechercherPostesVacants(systeme, { 
  niveau: 1 
});

// Rechercher des postes bien rémunérés
const postesBienPayes = rechercherPostesVacants(systeme, { 
  salaire_min: 500000 
});

// Rechercher dans un organisme spécifique
const postesMinistere = rechercherPostesVacants(systeme, { 
  organisme_code: 'MIN_SANTE' 
});
```

### 2. **Propositions d'Affectation**

```typescript
// Proposer automatiquement des postes aux fonctionnaires en attente
const propositions = proposerAffectations(systeme);

// Pour chaque fonctionnaire compatible
propositions.forEach(prop => {
  console.log(`${prop.fonctionnaire.nom}: ${prop.postes_proposes.length} postes disponibles`);
});
```

### 3. **Génération de Rapports**

```typescript
const rapport = genererRapportRH(systeme);
// Génère un rapport complet avec :
// - Vue d'ensemble
// - Situation des postes
// - Ressources humaines
// - Besoins prioritaires
// - Alertes
```

---

## 🔗 INTÉGRATION AVEC LE SYSTÈME EXISTANT

### Migration Progressive

```typescript
// 1. ANCIEN SYSTÈME (systeme-complet-gabon.ts)
// Génère automatiquement utilisateurs avec postes

// 2. NOUVEAU SYSTÈME (systeme-rh-gabon.ts)
// Sépare postes, fonctionnaires et comptes

// 3. BRIDGE D'INTÉGRATION
import { SystemeRHComplet } from './systeme-rh-gabon';

// Convertir vers l'ancien format si nécessaire
function convertirVersAncienFormat(systemeRH: SystemeRHComplet) {
  return systemeRH.comptes_actifs.map(compte => ({
    id: compte.id,
    nom: // ... récupérer depuis fonctionnaire
    role: compte.role_systeme,
    organisme_code: compte.organisme_code,
    // ...
  }));
}
```

### APIs Compatibles

```typescript
// API pour les postes vacants (offres d'emploi)
GET /api/rh/postes-vacants
→ Liste des 507 postes disponibles

// API pour les fonctionnaires en attente
GET /api/rh/fonctionnaires-attente
→ Liste des 117 fonctionnaires sans affectation

// API pour les comptes actifs
GET /api/rh/comptes-actifs
→ Liste des 791 comptes opérationnels
```

---

## 🎯 CAS D'USAGE PRATIQUES

### 1. **Recrutement**
```
Ministère X a besoin d'un Directeur
→ Créer le poste (statut: VACANT)
→ Publier l'offre
→ Sélectionner un fonctionnaire
→ Créer le compte actif
```

### 2. **Mutation**
```
Fonctionnaire A change d'organisme
→ Libérer le poste actuel (statut: VACANT)
→ Affecter au nouveau poste
→ Mettre à jour le compte
→ Archiver l'ancienne affectation
```

### 3. **Gestion des Vacances**
```
Identifier organismes critiques
→ Prioriser les recrutements
→ Proposer des affectations
→ Réduire les postes vacants
```

---

## ✅ AVANTAGES DE CETTE ARCHITECTURE

### 1. **Réalisme**
- Reflète la vraie structure administrative gabonaise
- Distingue clairement postes, personnes et comptes
- Permet de gérer les vacances de postes

### 2. **Flexibilité**
- Postes peuvent exister sans titulaire
- Fonctionnaires peuvent attendre une affectation
- Mutations et réorganisations faciles

### 3. **Transparence**
- Vue claire des besoins en recrutement
- Identification des organismes en sous-effectif
- Suivi des fonctionnaires non affectés

### 4. **Performance**
- Optimisation des affectations
- Réduction du temps de vacance
- Meilleure allocation des ressources

---

## 📝 COMMANDES UTILES

```bash
# Tester le système RH
bun run scripts/test-systeme-rh-gabon.ts

# Générer un rapport complet
bun run scripts/generer-rapport-rh.ts

# Simuler des affectations
bun run scripts/simuler-affectations.ts

# Exporter les données
bun run scripts/export-donnees-rh.ts
```

---

## 🚀 PROCHAINES ÉTAPES

1. **Interface Web**
   - Page de gestion des postes
   - Interface d'affectation
   - Tableau de bord RH

2. **Automatisation**
   - Propositions d'affectation intelligentes
   - Alertes pour postes critiques
   - Workflow de validation

3. **Reporting**
   - Tableaux de bord dynamiques
   - Exports Excel/PDF
   - Statistiques en temps réel

---

## 📚 CONCLUSION

Le système RH gabonais est maintenant **parfaitement modélisé** avec :

- ✅ **1298 postes** dans 141 organismes
- ✅ **908 fonctionnaires** (791 en poste, 117 en attente)
- ✅ **791 comptes actifs** (postes occupés)
- ✅ **507 offres d'emploi** (postes vacants)
- ✅ **Logique administrative réelle** respectée

La séparation claire entre **Postes**, **Fonctionnaires** et **Comptes** permet une gestion flexible et réaliste des ressources humaines de l'administration publique gabonaise.

---

*Documentation générée le : Janvier 2025*  
*Système : Administration Publique Gabonaise*  
*Version : 2.0 - Architecture RH Complète*
