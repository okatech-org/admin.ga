import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface OrganismeCommercial {
  id: string;
  nom: string;
  siret: string;
  secteurActivite: string;
  typeEntreprise: 'SARL' | 'SA' | 'SAS' | 'EURL' | 'ASSOCIATION' | 'AUTRE';
  adresse: string;
  ville: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  responsableLegal: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
  nombreEmployes?: number;
  chiffreAffaires?: number;
  dateCreation: string;
  statut: 'ACTIF' | 'SUSPENDU' | 'INACTIF';
  certification?: {
    type: string;
    organisme: string;
    dateObtention: string;
    dateExpiration: string;
  }[];
  servicesProposés: string[];
  partenariatsPublics?: {
    organisme: string;
    typePartenariat: string;
    dateDebut: string;
    statut: string;
  }[];
}

// Données simulées
const organismesCommerciauxSimules: OrganismeCommercial[] = [
  {
    id: '1',
    nom: 'Digital Solutions Gabon',
    siret: '12345678901234',
    secteurActivite: 'Technologies de l\'information',
    typeEntreprise: 'SARL',
    adresse: 'Avenue Hassan II, Immeuble Les Palmiers',
    ville: 'Libreville',
    telephone: '+241 01 23 45 67',
    email: 'contact@digitalsolutions.ga',
    siteWeb: 'https://digitalsolutions.ga',
    responsableLegal: {
      nom: 'MOUANDA',
      prenom: 'Pierre',
      telephone: '+241 01 23 45 68',
      email: 'p.mouanda@digitalsolutions.ga'
    },
    nombreEmployes: 45,
    chiffreAffaires: 850000000,
    dateCreation: '2018-03-15',
    statut: 'ACTIF',
    certification: [
      {
        type: 'ISO 27001',
        organisme: 'Bureau Veritas',
        dateObtention: '2022-06-15',
        dateExpiration: '2025-06-15'
      }
    ],
    servicesProposés: [
      'Développement d\'applications web',
      'Transformation digitale',
      'Cybersécurité',
      'Formation informatique'
    ],
    partenariatsPublics: [
      {
        organisme: 'Ministère de l\'Économie Numérique',
        typePartenariat: 'Prestation de services',
        dateDebut: '2023-01-01',
        statut: 'ACTIF'
      }
    ]
  },
  {
    id: '2',
    nom: 'Construction Équatoriale',
    siret: '23456789012345',
    secteurActivite: 'Bâtiment et Travaux Publics',
    typeEntreprise: 'SA',
    adresse: 'Zone Industrielle d\'Oloumi',
    ville: 'Libreville',
    telephone: '+241 01 34 56 78',
    email: 'info@construction-equatoriale.ga',
    responsableLegal: {
      nom: 'NDONG',
      prenom: 'Marie-Claire',
      telephone: '+241 01 34 56 79',
      email: 'm.ndong@construction-equatoriale.ga'
    },
    nombreEmployes: 120,
    chiffreAffaires: 2500000000,
    dateCreation: '2015-09-20',
    statut: 'ACTIF',
    certification: [
      {
        type: 'Qualibat',
        organisme: 'Organisme de Qualification du Bâtiment',
        dateObtention: '2020-03-10',
        dateExpiration: '2024-03-10'
      }
    ],
    servicesProposés: [
      'Construction de bâtiments',
      'Travaux routiers',
      'Rénovation',
      'Études techniques'
    ],
    partenariatsPublics: [
      {
        organisme: 'Ministère de l\'Habitat',
        typePartenariat: 'Marché public',
        dateDebut: '2023-06-01',
        statut: 'ACTIF'
      },
      {
        organisme: 'Mairie de Libreville',
        typePartenariat: 'Convention',
        dateDebut: '2022-12-01',
        statut: 'ACTIF'
      }
    ]
  },
  {
    id: '3',
    nom: 'Agro-Business Gabon',
    siret: '34567890123456',
    secteurActivite: 'Agriculture et Agroalimentaire',
    typeEntreprise: 'SAS',
    adresse: 'Route de Ntoum, Km 25',
    ville: 'Ntoum',
    telephone: '+241 01 45 67 89',
    email: 'contact@agrobusiness.ga',
    responsableLegal: {
      nom: 'OBIANG',
      prenom: 'François',
      telephone: '+241 01 45 67 90',
      email: 'f.obiang@agrobusiness.ga'
    },
    nombreEmployes: 200,
    chiffreAffaires: 1200000000,
    dateCreation: '2012-11-08',
    statut: 'ACTIF',
    servicesProposés: [
      'Production agricole',
      'Transformation agroalimentaire',
      'Distribution',
      'Conseils agricoles'
    ],
    partenariatsPublics: [
      {
        organisme: 'Ministère de l\'Agriculture',
        typePartenariat: 'Programme de développement',
        dateDebut: '2023-01-01',
        statut: 'ACTIF'
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const secteur = searchParams.get('secteur');
    const type = searchParams.get('type');
    const statut = searchParams.get('statut');
    const recherche = searchParams.get('recherche');

    let organismes = [...organismesCommerciauxSimules];

    // Filtres
    if (secteur && secteur !== 'all') {
      organismes = organismes.filter(o => o.secteurActivite.toLowerCase().includes(secteur.toLowerCase()));
    }

    if (type && type !== 'all') {
      organismes = organismes.filter(o => o.typeEntreprise === type);
    }

    if (statut && statut !== 'all') {
      organismes = organismes.filter(o => o.statut === statut);
    }

    if (recherche) {
      const searchLower = recherche.toLowerCase();
      organismes = organismes.filter(o =>
        o.nom.toLowerCase().includes(searchLower) ||
        o.siret.includes(searchLower) ||
        o.secteurActivite.toLowerCase().includes(searchLower) ||
        o.ville.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = organismes.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = organismes.slice(startIndex, endIndex);

    // Statistiques
    const stats = {
      total: organismesCommerciauxSimules.length,
      actifs: organismesCommerciauxSimules.filter(o => o.statut === 'ACTIF').length,
      suspendus: organismesCommerciauxSimules.filter(o => o.statut === 'SUSPENDU').length,
      inactifs: organismesCommerciauxSimules.filter(o => o.statut === 'INACTIF').length,
      parSecteur: organismesCommerciauxSimules.reduce((acc, org) => {
        acc[org.secteurActivite] = (acc[org.secteurActivite] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      parType: organismesCommerciauxSimules.reduce((acc, org) => {
        acc[org.typeEntreprise] = (acc[org.typeEntreprise] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avecPartenariats: organismesCommerciauxSimules.filter(o => o.partenariatsPublics && o.partenariatsPublics.length > 0).length
    };

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur API organismes commerciaux:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
