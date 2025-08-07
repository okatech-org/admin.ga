# TRAVAIL.GA - Documentation Complète

## Vue d'ensemble

TRAVAIL.GA est la plateforme officielle de l'emploi public au Gabon, intégrée avec le système ADMINISTRATION.GA. Cette plateforme permet aux administrations publiques de publier des offres d'emploi et aux citoyens de postuler à ces opportunités.

## Architecture du système

### 1. Structure des composants

```
app/travail/
├── page.tsx                    # Page d'accueil de TRAVAIL.GA
├── offres/
│   ├── page.tsx               # Liste des offres d'emploi
│   └── [id]/
│       └── page.tsx           # Détail d'une offre
└── recruteur/
    └── page.tsx               # Espace recruteur pour les administrations
```

### 2. APIs développées

```
app/api/emploi/
├── offres/
│   ├── route.ts              # GET (liste), POST (création)
│   └── [id]/
│       └── route.ts          # GET (détail), PUT (modification), DELETE
├── candidatures/
│   └── route.ts              # GET (liste), POST (nouvelle candidature)
└── statistiques/
    └── route.ts              # GET (statistiques globales)
```

### 3. Types de données

Définis dans `lib/types/emploi.ts`:
- `OffreEmploi`: Structure complète d'une offre d'emploi
- `Candidature`: Données d'une candidature
- `FiltresOffres`: Paramètres de filtrage
- `StatistiquesEmploi`: Métriques et analyses

## Fonctionnalités principales

### Pour les citoyens (candidats)

1. **Consultation des offres**
   - Page d'accueil avec offres récentes
   - Recherche avancée avec filtres multiples
   - Détail complet de chaque offre

2. **Système de candidature**
   - Formulaire de candidature intégré
   - Upload de CV (PDF)
   - Lettre de motivation
   - Suivi des candidatures

3. **Filtres disponibles**
   - Type de contrat (CDI, CDD, stage, etc.)
   - Niveau d'études requis
   - Localisation
   - Fourchette salariale
   - Organisme recruteur

### Pour les administrations (recruteurs)

1. **Gestion des offres**
   - Création d'offres détaillées
   - Modification et suppression
   - Suivi du nombre de candidatures

2. **Gestion des candidatures**
   - Vue d'ensemble des candidatures reçues
   - Tri et filtrage par statut
   - Export des données

3. **Tableau de bord analytique**
   - Statistiques de recrutement
   - Taux de conversion
   - Délai moyen de recrutement

## Intégration avec ADMINISTRATION.GA

### Flux de données

1. **Publication d'offres**
   - Les postes vacants identifiés dans ADMINISTRATION.GA peuvent être publiés sur TRAVAIL.GA
   - Synchronisation automatique des informations d'organisme

2. **Gestion des accès**
   - Les responsables RH des administrations ont accès à l'espace recruteur
   - Authentification unifiée avec le système principal

3. **Reporting centralisé**
   - Les statistiques d'emploi remontent vers le dashboard super-admin
   - Vision globale de l'emploi public

## Guide d'utilisation

### Pour un candidat

1. **Accéder à TRAVAIL.GA**
   ```
   https://travail.ga
   ```

2. **Rechercher une offre**
   - Utiliser la barre de recherche principale
   - Appliquer les filtres selon vos critères
   - Consulter les détails de l'offre

3. **Postuler**
   - Cliquer sur "Postuler maintenant"
   - Remplir le formulaire de candidature
   - Joindre votre CV en PDF
   - Valider l'envoi

### Pour un recruteur

1. **Accéder à l'espace recruteur**
   ```
   https://travail.ga/recruteur
   ```

2. **Publier une offre**
   - Cliquer sur "Nouvelle offre"
   - Remplir tous les champs requis
   - Définir la date limite de candidature
   - Publier l'offre

3. **Gérer les candidatures**
   - Consulter l'onglet "Candidatures"
   - Filtrer par statut
   - Traiter les nouvelles candidatures

## Exemples d'offres actuelles

### Offres types disponibles

1. **Directeur des Ressources Humaines**
   - Ministère de la Fonction Publique
   - CDI - Libreville
   - Bac+5 requis
   - 2.5M - 3.5M FCFA/mois

2. **Analyste Programmeur**
   - Ministère de l'Économie Numérique
   - CDD - Libreville
   - Bac+3 requis
   - 800k - 1.2M FCFA/mois

3. **Chargé de Communication Digitale**
   - Ministère de la Communication
   - CDI - Port-Gentil
   - Bac+3 requis
   - 600k - 900k FCFA/mois

4. **Juriste Spécialisé en Droit Public**
   - Ministère de la Justice
   - CDI - Libreville
   - Bac+5 requis
   - 1.5M - 2M FCFA/mois

5. **Comptable Senior**
   - Ministère des Finances
   - CDI - Franceville
   - Bac+3 requis
   - 1.2M - 1.8M FCFA/mois

6. **Stage - Assistant Marketing Digital**
   - Ministère du Tourisme
   - Stage - Libreville
   - Bac+2 requis
   - 150k FCFA/mois

## Sécurité et confidentialité

### Protection des données

- Les CV sont stockés de manière sécurisée
- Les données personnelles sont protégées selon la réglementation
- Accès restreint aux candidatures par organisme

### Authentification

- Connexion sécurisée pour les recruteurs
- Validation des emails des candidats
- Traçabilité des actions

## Évolutions futures

### Court terme (Q1 2025)
- [ ] Système de notifications par email
- [ ] Espace candidat avec suivi des candidatures
- [ ] Export PDF des offres
- [ ] Alertes emploi personnalisées

### Moyen terme (Q2-Q3 2025)
- [ ] Application mobile TRAVAIL.GA
- [ ] Tests de compétences en ligne
- [ ] Système de recommandation IA
- [ ] Intégration avec les universités

### Long terme (2026)
- [ ] Plateforme de formation continue
- [ ] Bourse de stages étudiants
- [ ] Réseau professionnel public
- [ ] Statistiques prédictives d'emploi

## Support technique

### Contact
- Email: support@travail.ga
- Téléphone: +241 01 72 34 56
- Horaires: Lun-Ven 8h-17h

### FAQ

**Q: Comment modifier mon CV après candidature?**
R: Une fois envoyée, une candidature ne peut être modifiée. Vous devez postuler à nouveau.

**Q: Combien de temps une offre reste-t-elle active?**
R: Les offres restent actives jusqu'à leur date d'expiration définie par le recruteur.

**Q: Puis-je postuler à plusieurs offres?**
R: Oui, vous pouvez postuler à autant d'offres que vous souhaitez.

**Q: Comment savoir si ma candidature a été reçue?**
R: Un email de confirmation est envoyé automatiquement après chaque candidature.

## Conclusion

TRAVAIL.GA représente une avancée majeure dans la modernisation du recrutement public au Gabon. La plateforme offre transparence, efficacité et égalité des chances pour tous les citoyens souhaitant servir dans l'administration publique.
