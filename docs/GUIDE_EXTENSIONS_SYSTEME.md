# Guide des Extensions du Système

## 📋 Vue d'ensemble

Le module d'extensions permet d'**ajouter dynamiquement** des organismes, postes et utilisateurs personnalisés aux 141 organismes officiels gabonais. Cela offre une flexibilité totale pour adapter le système aux besoins spécifiques.

## 🎯 Capacités du système d'extensions

### Ce que vous pouvez faire
- ✅ **Ajouter des organismes personnalisés** (agences, cabinets, centres, etc.)
- ✅ **Créer des postes spécifiques** (Innovation Officer, Data Scientist, etc.)
- ✅ **Générer des utilisateurs supplémentaires** pour n'importe quel organisme
- ✅ **Créer des écosystèmes complets** (pôle innovation, pôle santé, etc.)
- ✅ **Renforcer les organismes existants** avec du personnel supplémentaire
- ✅ **Intégrer avec le système unifié** pour un accès transparent

## 📁 Architecture des extensions

```
lib/data/
├── systeme-complet-gabon.ts      # Système de base (141 organismes)
├── systeme-extensions.ts         # Module d'extensions
├── unified-system-data.ts        # Données unifiées de base
└── unified-system-extended.ts    # Données unifiées + extensions

scripts/
└── test-extensions-systeme.ts    # Tests des extensions
```

## 🚀 Guide d'utilisation rapide

### 1. Ajouter un organisme personnalisé

```typescript
import { ajouterOrganismePersonnalise } from '@/lib/data/systeme-extensions';

// Exemple simple
const organisme = ajouterOrganismePersonnalise({
  nom: 'Centre National de Cybersécurité',
  code: 'CNC_GABON',
  type: 'ETABLISSEMENT_PUBLIC',
  email_contact: 'contact@cnc.ga',
  couleur_principale: '#1E90FF'
});

console.log(`Organisme créé: ${organisme.nom} (${organisme.code})`);
```

### 2. Ajouter un poste personnalisé

```typescript
import { ajouterPostePersonnalise } from '@/lib/data/systeme-extensions';

const poste = ajouterPostePersonnalise({
  titre: 'Chief Innovation Officer',
  code: 'CIO',
  niveau: 1,
  organisme_types: ['ETABLISSEMENT_PUBLIC', 'ENTREPRISE_PUBLIQUE'],
  salaire_base: 1500000,
  responsabilites: [
    'Stratégie d\'innovation',
    'Transformation digitale',
    'Gestion des partenariats tech'
  ]
});
```

### 3. Générer des utilisateurs supplémentaires

```typescript
import { genererUtilisateursSupplementaires } from '@/lib/data/systeme-extensions';

// Ajouter 5 utilisateurs au ministère de l'économie
const nouveauxUtilisateurs = genererUtilisateursSupplementaires(
  'MIN_ECO_FIN',  // Code de l'organisme
  5,              // Nombre d'utilisateurs
  ['USER']        // Rôles (optionnel)
);

console.log(`${nouveauxUtilisateurs.length} utilisateurs ajoutés`);
```

## 📊 Utilisation avancée avec le gestionnaire

### Utiliser le gestionnaire d'extensions

```typescript
import { extensionsSysteme } from '@/lib/data/systeme-extensions';

// Ajouter plusieurs organismes en masse
const organismes = extensionsSysteme.ajouterOrganismesEnMasse([
  {
    nom: 'Agence Nationale de l\'Innovation',
    code: 'ANI_GABON',
    type: 'ETABLISSEMENT_PUBLIC'
  },
  {
    nom: 'Centre de Transformation Digitale',
    code: 'CTD_GABON',
    type: 'ETABLISSEMENT_PUBLIC'
  }
]);

// Ajouter plusieurs postes
const postes = extensionsSysteme.ajouterPostesEnMasse([
  {
    titre: 'Data Scientist',
    code: 'DS',
    niveau: 2,
    organisme_types: ['ETABLISSEMENT_PUBLIC']
  },
  {
    titre: 'DevOps Engineer',
    code: 'DO',
    niveau: 2,
    organisme_types: ['ETABLISSEMENT_PUBLIC', 'ENTREPRISE_PUBLIQUE']
  }
]);

// Générer des utilisateurs pour plusieurs organismes
const config = [
  { organismeCode: 'ANI_GABON', nombre: 3, roles: ['USER'] },
  { organismeCode: 'CTD_GABON', nombre: 2, roles: ['ADMIN', 'USER'] }
];

const utilisateurs = extensionsSysteme.genererUtilisateursEnMasse(config);

// Obtenir le système complet avec extensions
const systemeComplet = await extensionsSysteme.obtenirSystemeEtendu();
console.log(`Total: ${systemeComplet.organismes.length} organismes`);
```

## 🔗 Intégration avec le système unifié

### Utiliser les données unifiées étendues

```typescript
import { 
  getUnifiedSystemDataExtended,
  addOrganismeToUnifiedSystem,
  addUsersToUnifiedSystem 
} from '@/lib/data/unified-system-extended';

// Obtenir les données complètes (base + extensions)
const data = await getUnifiedSystemDataExtended();

console.log(`Organismes total: ${data.statistics.totalOrganismes}`);
console.log(`Organismes ajoutés: ${data.extensions.statistiques.organismesAjoutes}`);
console.log(`Utilisateurs total: ${data.statistics.totalUsers}`);

// Ajouter un organisme et mettre à jour automatiquement
const dataUpdated = await addOrganismeToUnifiedSystem({
  nom: 'Nouveau Centre',
  code: 'NC_2025',
  type: 'ETABLISSEMENT_PUBLIC'
});

// Ajouter des utilisateurs et mettre à jour
const dataWithUsers = await addUsersToUnifiedSystem('NC_2025', 5, ['USER']);
```

## 🎨 Scénarios prédéfinis

### Créer un écosystème d'innovation

```typescript
import { creerEcosystemeInnovation } from '@/lib/data/systeme-extensions';

// Crée automatiquement :
// - 3 organismes d'innovation
// - 6 postes spécialisés
// - Équipes complètes pour chaque organisme
creerEcosystemeInnovation();
```

### Créer une structure gouvernementale complète

```typescript
import { creerStructureGouvernementaleComplete } from '@/lib/data/unified-system-extended';

// Crée :
// - Cabinets ministériels
// - Agences de régulation
// - Personnel supplémentaire pour ministères
const structure = await creerStructureGouvernementaleComplete();
```

### Créer un pôle santé

```typescript
import { creerPoleSante } from '@/lib/data/unified-system-extended';

// Crée :
// - CHU de Libreville
// - Institut de Recherche Médicale
// - Centre National de Transfusion Sanguine
// - Personnel médical et administratif
const poleSante = await creerPoleSante();
```

## 📝 Types d'organismes disponibles

```typescript
type TypeOrganisme = 
  | 'INSTITUTION_SUPREME'    // Présidence, SGG
  | 'MINISTERE'              // Ministères
  | 'DIRECTION_GENERALE'     // Directions générales
  | 'ETABLISSEMENT_PUBLIC'   // Agences, centres
  | 'ENTREPRISE_PUBLIQUE'    // Entreprises d'État
  | 'ETABLISSEMENT_SANTE'    // Hôpitaux, centres de santé
  | 'UNIVERSITE'             // Universités, écoles
  | 'GOUVERNORAT'            // Gouvernorats provinciaux
  | 'PREFECTURE'             // Préfectures
  | 'MAIRIE'                 // Mairies
  | 'AUTORITE_REGULATION'    // Autorités de régulation
  | 'FORCE_SECURITE';        // Forces de sécurité
```

## 🎯 Exemples concrets

### Exemple 1 : Créer une nouvelle agence avec équipe complète

```typescript
// 1. Créer l'organisme
const agence = ajouterOrganismePersonnalise({
  nom: 'Agence de Développement Urbain',
  code: 'ADU_GABON',
  type: 'ETABLISSEMENT_PUBLIC',
  description: 'Planification et développement urbain durable'
});

// 2. Créer des postes spécifiques
ajouterPostePersonnalise({
  titre: 'Urbaniste en Chef',
  code: 'UC',
  niveau: 1,
  organisme_types: ['ETABLISSEMENT_PUBLIC'],
  salaire_base: 1200000
});

ajouterPostePersonnalise({
  titre: 'Architecte Paysagiste',
  code: 'AP',
  niveau: 2,
  organisme_types: ['ETABLISSEMENT_PUBLIC'],
  salaire_base: 900000
});

// 3. Générer l'équipe
const equipe = genererUtilisateursSupplementaires('ADU_GABON', 5);
```

### Exemple 2 : Renforcer un ministère existant

```typescript
// Ajouter 10 agents supplémentaires au Ministère de l'Économie
const agents = genererUtilisateursSupplementaires(
  'MIN_ECO_FIN',
  10,
  ['USER']  // Uniquement des utilisateurs standards
);

// Ajouter un poste spécialisé
ajouterPostePersonnalise({
  titre: 'Analyste Financier Senior',
  code: 'AFS',
  niveau: 2,
  organisme_types: ['MINISTERE'],
  salaire_base: 1100000,
  prerequis: ['Master Finance', '5+ ans expérience']
});
```

## 🔄 Gestion et réinitialisation

### Obtenir un résumé des extensions

```typescript
const resume = extensionsSysteme.obtenirResume();

console.log(`Organismes ajoutés: ${resume.organismesAjoutes}`);
console.log(`Postes créés: ${resume.postesAjoutes}`);
console.log(`Utilisateurs ajoutés: ${resume.utilisateursAjoutes}`);
```

### Réinitialiser toutes les extensions

```typescript
// Supprime tous les ajouts personnalisés
extensionsSysteme.reinitialiser();
```

## ⚠️ Validation et erreurs

### Codes d'organismes uniques

```typescript
try {
  // Tentative d'ajout avec un code existant
  ajouterOrganismePersonnalise({ 
    code: 'PRESIDENCE',  // Code déjà existant
    nom: 'Test' 
  });
} catch (error) {
  console.error(error); // "Le code d'organisme PRESIDENCE existe déjà"
}
```

### Vérification de l'existence d'un organisme

```typescript
try {
  genererUtilisateursSupplementaires('CODE_INEXISTANT', 5);
} catch (error) {
  console.error(error); // "Organisme avec le code CODE_INEXISTANT non trouvé"
}
```

## 📊 Statistiques après extensions

Avec les extensions, le système peut passer de :
- **141 → 200+** organismes
- **440 → 1000+** utilisateurs
- **36 → 100+** types de postes

### Exemple de statistiques étendues

```
📊 SYSTÈME ÉTENDU:
• Organismes officiels: 141
• Organismes personnalisés: 15
• TOTAL: 156 organismes

👥 Utilisateurs:
• Base: 440
• Supplémentaires: 85
• TOTAL: 525 utilisateurs

🎯 Postes:
• Base: 36
• Personnalisés: 12
• TOTAL: 48 postes
```

## 🧪 Tests

```bash
# Tester les extensions
bun run scripts/test-extensions-systeme.ts
```

Résultat attendu :
```
✅ TOUS LES TESTS D'EXTENSIONS SONT PASSÉS!
• 148 organismes au total (141 + 7)
• 461 utilisateurs générés
• 46 postes disponibles
• Extensions totalement intégrées
```

## 💡 Conseils et bonnes pratiques

1. **Codes d'organismes** : Utilisez des codes descriptifs en MAJUSCULES (ex: `CNC_GABON`)
2. **Types cohérents** : Respectez les types d'organismes existants
3. **Validation** : Toujours vérifier l'unicité des codes avant ajout
4. **Batch operations** : Préférez les ajouts en masse pour la performance
5. **Réinitialisation** : Pensez à réinitialiser entre les tests

## 🔮 Cas d'usage avancés

### Simulation d'une réorganisation administrative

```typescript
// 1. Réinitialiser le système
await resetUnifiedSystemExtensions();

// 2. Créer les nouvelles structures
const nouvellesStructures = [
  { nom: 'Ministère du Numérique', code: 'MIN_NUM', type: 'MINISTERE' },
  { nom: 'Agence de Cyberdéfense', code: 'ACD', type: 'AUTORITE_REGULATION' },
  // ...
];

// 3. Ajouter en masse
nouvellesStructures.forEach(s => addOrganismeToUnifiedSystem(s));

// 4. Générer le personnel
// ...
```

### Création d'un environnement de test

```typescript
// Créer des organismes fictifs pour tests
const testOrgs = Array.from({ length: 10 }, (_, i) => ({
  nom: `Organisme Test ${i + 1}`,
  code: `TEST_${i + 1}`,
  type: 'ETABLISSEMENT_PUBLIC' as const
}));

extensionsSysteme.ajouterOrganismesEnMasse(testOrgs);
```

---

*Module d'extensions pour le système administratif gabonais*
*Flexibilité totale • Validation intégrée • Performance optimisée*
