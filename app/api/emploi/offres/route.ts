import { NextRequest, NextResponse } from 'next/server';
import type { OffreEmploi } from '@/lib/types/emploi';

// Données mockées pour le moment
const offresEmploi: OffreEmploi[] = [
  {
    id: '1',
    titre: 'Directeur des Ressources Humaines',
    description: `Nous recherchons un Directeur des Ressources Humaines expérimenté pour rejoindre le Ministère de la Fonction Publique.

    Le candidat idéal aura une solide expérience en gestion des ressources humaines dans le secteur public et sera capable de diriger une équipe dynamique.

    Responsabilités principales:
    - Élaborer et mettre en œuvre la stratégie RH
    - Gérer les processus de recrutement et de sélection
    - Superviser la gestion des carrières et la mobilité interne
    - Assurer la conformité avec la réglementation du travail`,
    organismeId: 'min-fonction-publique',
    organismeNom: 'Ministère de la Fonction Publique',
    localisation: 'Libreville',
    typeContrat: 'CDI',
    niveauEtude: 'bac+5',
    experienceRequise: 'Minimum 10 ans d\'expérience en gestion RH dont 5 ans à un poste de direction',
    competences: ['Gestion RH', 'Leadership', 'Droit du travail', 'Management d\'équipe', 'Stratégie RH'],
    missions: [
      'Définir et mettre en œuvre la politique RH de l\'administration',
      'Manager une équipe de 15 personnes',
      'Piloter les projets de transformation RH',
      'Représenter l\'administration auprès des partenaires sociaux'
    ],
    avantages: [
      'Salaire attractif',
      'Véhicule de fonction',
      'Assurance santé complète',
      'Formation continue',
      'Évolution de carrière'
    ],
    salaire: {
      min: 2500000,
      max: 3500000,
      devise: 'FCFA',
      periode: 'mois'
    },
    datePublication: new Date('2025-01-15'),
    dateExpiration: new Date('2025-02-28'),
    statut: 'active',
    nombrePostes: 1,
    nombreCandidatures: 12,
    reference: 'MFP-DRH-2025-001',
    contact: {
      nom: 'Service Recrutement',
      email: 'recrutement@fonction-publique.ga',
      telephone: '+241 01 72 34 56'
    },
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: '2',
    titre: 'Analyste Programmeur',
    description: `Le Ministère de l\'Économie Numérique recherche un Analyste Programmeur pour renforcer son équipe technique.

    Mission: Développer et maintenir les applications de l\'administration numérique.`,
    organismeId: 'min-economie-numerique',
    organismeNom: 'Ministère de l\'Économie Numérique',
    localisation: 'Libreville',
    typeContrat: 'CDD',
    niveauEtude: 'bac+3',
    experienceRequise: '3 ans minimum en développement web',
    competences: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'TypeScript'],
    missions: [
      'Développer de nouvelles fonctionnalités',
      'Maintenir les applications existantes',
      'Participer aux revues de code',
      'Rédiger la documentation technique'
    ],
    avantages: [
      'Formation aux nouvelles technologies',
      'Télétravail partiel possible',
      'Équipe jeune et dynamique'
    ],
    salaire: {
      min: 800000,
      max: 1200000,
      devise: 'FCFA',
      periode: 'mois'
    },
    datePublication: new Date('2025-01-20'),
    dateExpiration: new Date('2025-03-15'),
    statut: 'active',
    nombrePostes: 2,
    nombreCandidatures: 45,
    reference: 'MEN-DEV-2025-002',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20')
  },
  {
    id: '3',
    titre: 'Chargé de Communication Digitale',
    description: `Rejoignez l\'équipe de communication du Ministère de la Communication pour gérer la présence digitale de l\'institution.`,
    organismeId: 'min-communication',
    organismeNom: 'Ministère de la Communication',
    localisation: 'Port-Gentil',
    typeContrat: 'CDI',
    niveauEtude: 'bac+3',
    experienceRequise: '2 ans en communication digitale',
    competences: ['Community Management', 'Création de contenu', 'SEO', 'Analytics', 'Photoshop'],
    missions: [
      'Gérer les réseaux sociaux institutionnels',
      'Créer du contenu multimédia',
      'Analyser les performances digitales',
      'Coordonner les campagnes de communication'
    ],
    avantages: [
      'Environnement de travail moderne',
      'Formation continue',
      'Évolution rapide'
    ],
    salaire: {
      min: 600000,
      max: 900000,
      devise: 'FCFA',
      periode: 'mois'
    },
    datePublication: new Date('2025-01-18'),
    dateExpiration: new Date('2025-02-28'),
    statut: 'active',
    nombrePostes: 1,
    nombreCandidatures: 23,
    reference: 'MC-COM-2025-003',
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-18')
  },
  {
    id: '4',
    titre: 'Juriste Spécialisé en Droit Public',
    description: `Le Ministère de la Justice recherche un juriste spécialisé pour renforcer son équipe juridique.`,
    organismeId: 'min-justice',
    organismeNom: 'Ministère de la Justice',
    localisation: 'Libreville',
    typeContrat: 'CDI',
    niveauEtude: 'bac+5',
    experienceRequise: '5 ans en droit public',
    competences: ['Droit administratif', 'Contentieux', 'Rédaction juridique', 'Conseil juridique'],
    missions: [
      'Conseiller sur les questions de droit public',
      'Rédiger des avis juridiques',
      'Représenter l\'administration en justice',
      'Participer à l\'élaboration des textes réglementaires'
    ],
    avantages: [
      'Carrière dans la fonction publique',
      'Formation spécialisée',
      'Stabilité de l\'emploi'
    ],
    salaire: {
      min: 1500000,
      max: 2000000,
      devise: 'FCFA',
      periode: 'mois'
    },
    datePublication: new Date('2025-01-22'),
    dateExpiration: new Date('2025-03-01'),
    statut: 'active',
    nombrePostes: 2,
    nombreCandidatures: 8,
    reference: 'MJ-JUR-2025-004',
    createdAt: new Date('2025-01-22'),
    updatedAt: new Date('2025-01-22')
  },
  {
    id: '5',
    titre: 'Comptable Senior',
    description: `Le Ministère des Finances recherche un comptable senior pour gérer les opérations comptables complexes.`,
    organismeId: 'min-finances',
    organismeNom: 'Ministère des Finances',
    localisation: 'Franceville',
    typeContrat: 'CDI',
    niveauEtude: 'bac+3',
    experienceRequise: '7 ans en comptabilité publique',
    competences: ['Comptabilité publique', 'SYSCOHADA', 'Excel avancé', 'Audit', 'Fiscalité'],
    missions: [
      'Superviser la comptabilité générale',
      'Préparer les états financiers',
      'Assurer la conformité comptable',
      'Former les équipes junior'
    ],
    avantages: [
      'Prime de performance',
      'Formation certifiante',
      'Perspective d\'évolution'
    ],
    salaire: {
      min: 1200000,
      max: 1800000,
      devise: 'FCFA',
      periode: 'mois'
    },
    datePublication: new Date('2025-01-10'),
    dateExpiration: new Date('2025-02-20'),
    statut: 'active',
    nombrePostes: 1,
    nombreCandidatures: 15,
    reference: 'MF-COMPTA-2025-005',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10')
  },
  {
    id: '6',
    titre: 'Stage - Assistant Marketing Digital',
    description: `Stage de 6 mois au sein du Ministère du Tourisme pour assister l\'équipe marketing dans la promotion digitale du Gabon.`,
    organismeId: 'min-tourisme',
    organismeNom: 'Ministère du Tourisme',
    localisation: 'Libreville',
    typeContrat: 'stage',
    niveauEtude: 'bac+2',
    experienceRequise: 'Étudiant en marketing/communication',
    competences: ['Réseaux sociaux', 'Créativité', 'Rédaction web', 'Canva', 'Marketing digital'],
    missions: [
      'Assister dans la création de contenu',
      'Gérer les publications sur les réseaux sociaux',
      'Participer aux campagnes marketing',
      'Analyser les statistiques web'
    ],
    avantages: [
      'Indemnité de stage',
      'Formation pratique',
      'Possibilité d\'embauche'
    ],
    salaire: {
      min: 150000,
      max: 150000,
      devise: 'FCFA',
      periode: 'mois'
    },
    datePublication: new Date('2025-01-25'),
    dateExpiration: new Date('2025-02-15'),
    statut: 'active',
    nombrePostes: 2,
    nombreCandidatures: 67,
    reference: 'MT-STAGE-2025-006',
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-01-25')
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const recherche = searchParams.get('q')?.toLowerCase();
    const typeContrat = searchParams.get('type')?.split(',');
    const niveauEtude = searchParams.get('niveau')?.split(',');
    const localisation = searchParams.get('loc')?.split(',');
    const salMin = searchParams.get('salMin') ? parseInt(searchParams.get('salMin')!) : undefined;
    const salMax = searchParams.get('salMax') ? parseInt(searchParams.get('salMax')!) : undefined;
    const statut = searchParams.get('statut') || 'active';

    // Filtrer les offres
    let filteredOffres = offresEmploi.filter(offre => {
      // Filtre par statut
      if (statut && offre.statut !== statut) return false;

      // Filtre par recherche
      if (recherche) {
        const searchIn = `${offre.titre} ${offre.description} ${offre.organismeNom} ${offre.competences?.join(' ')}`.toLowerCase();
        if (!searchIn.includes(recherche)) return false;
      }

      // Filtre par type de contrat
      if (typeContrat && typeContrat.length > 0) {
        if (!typeContrat.includes(offre.typeContrat)) return false;
      }

      // Filtre par niveau d'étude
      if (niveauEtude && niveauEtude.length > 0) {
        if (!offre.niveauEtude || !niveauEtude.includes(offre.niveauEtude)) return false;
      }

      // Filtre par localisation
      if (localisation && localisation.length > 0) {
        if (!localisation.includes(offre.localisation)) return false;
      }

      // Filtre par salaire
      if (salMin && offre.salaire?.min && offre.salaire.min < salMin) return false;
      if (salMax && offre.salaire?.max && offre.salaire.max > salMax) return false;

      return true;
    });

    // Tri par date de publication (plus récent en premier)
    filteredOffres.sort((a, b) =>
      new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOffres = filteredOffres.slice(startIndex, endIndex);

    // Si on demande juste les offres (sans pagination)
    if (searchParams.get('simple') === 'true') {
      return NextResponse.json(paginatedOffres);
    }

    return NextResponse.json({
      offres: paginatedOffres,
      total: filteredOffres.length,
      page,
      totalPages: Math.ceil(filteredOffres.length / limit)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des offres' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validation des données
    if (!data.titre || !data.description || !data.organismeId) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Créer une nouvelle offre
    const nouvelleOffre: OffreEmploi = {
      id: `${Date.now()}`,
      ...data,
      datePublication: new Date(),
      statut: 'active',
      nombreCandidatures: 0,
      reference: `REF-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Dans une vraie application, on sauvegarderait en base de données
    offresEmploi.push(nouvelleOffre);

    return NextResponse.json(nouvelleOffre, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'offre' },
      { status: 500 }
    );
  }
}
