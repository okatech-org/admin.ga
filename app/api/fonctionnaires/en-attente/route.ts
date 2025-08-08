import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface FonctionnaireEnAttente {
  id: string;
  matricule: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  lieuNaissance: string;
  diplomes: {
    niveau: string;
    intitule: string;
    etablissement: string;
    annee: number;
  }[];
  experiencePrecedente?: {
    poste: string;
    organisme: string;
    duree: string;
    description: string;
  }[];
  statut: 'EN_ATTENTE' | 'AFFECTE' | 'DETACHE' | 'SUSPENDU';
  dateInscription: string;
  prioriteAffectation: 'HAUTE' | 'MOYENNE' | 'BASSE';
  preferences: {
    organismes: string[];
    regions: string[];
    typePoste: string[];
  };
  rattachementPrimaire?: {
    organisme: string;
    service: string;
    poste: string;
    dateDebut: string;
  };
  rattachementSecondaire?: {
    organisme: string;
    service: string;
    poste: string;
    dateDebut: string;
    pourcentageTemps: number;
  };
  historique: {
    action: string;
    date: string;
    organisme?: string;
    motif: string;
    responsable: string;
  }[];
  evaluation?: {
    note: number;
    commentaires: string;
    evaluateur: string;
    date: string;
  };
}

// Données simulées
const fonctionnairesSimules: FonctionnaireEnAttente[] = [
  {
    id: '1',
    matricule: 'FP2024001',
    prenom: 'Jean-Baptiste',
    nom: 'MOUENGO',
    email: 'j.mouengo@email.ga',
    telephone: '+241 01 23 45 67',
    dateNaissance: '1985-03-15',
    lieuNaissance: 'Libreville',
    diplomes: [
      {
        niveau: 'Master',
        intitule: 'Administration Publique',
        etablissement: 'Université Omar Bongo',
        annee: 2010
      }
    ],
    experiencePrecedente: [
      {
        poste: 'Attaché d\'Administration',
        organisme: 'Mairie de Port-Gentil',
        duree: '3 ans',
        description: 'Gestion des dossiers administratifs'
      }
    ],
    statut: 'EN_ATTENTE',
    dateInscription: '2024-01-15T08:00:00Z',
    prioriteAffectation: 'HAUTE',
    preferences: {
      organismes: ['Ministère de l\'Économie', 'Direction Générale des Impôts'],
      regions: ['Estuaire', 'Ogooué-Maritime'],
      typePoste: ['Attaché d\'Administration', 'Contrôleur des Finances']
    },
    historique: [
      {
        action: 'Inscription initiale',
        date: '2024-01-15T08:00:00Z',
        motif: 'Candidature pour poste fonction publique',
        responsable: 'Service RH Central'
      }
    ],
    evaluation: {
      note: 16,
      commentaires: 'Candidat prometteur avec bonne expérience terrain',
      evaluateur: 'Dr. Marie NZAMBA',
      date: '2024-01-20T10:00:00Z'
    }
  },
  {
    id: '2',
    matricule: 'FP2024002',
    prenom: 'Marie-Claire',
    nom: 'OBAME',
    email: 'm.obame@email.ga',
    telephone: '+241 01 34 56 78',
    dateNaissance: '1990-07-22',
    lieuNaissance: 'Franceville',
    diplomes: [
      {
        niveau: 'Licence',
        intitule: 'Droit Public',
        etablissement: 'Université de Masuku',
        annee: 2014
      }
    ],
    statut: 'EN_ATTENTE',
    dateInscription: '2024-01-20T09:30:00Z',
    prioriteAffectation: 'MOYENNE',
    preferences: {
      organismes: ['Ministère de la Justice', 'Tribunal de Grande Instance'],
      regions: ['Haut-Ogooué', 'Estuaire'],
      typePoste: ['Greffier', 'Secrétaire Juridique']
    },
    rattachementPrimaire: {
      organisme: 'Ministère de la Justice',
      service: 'Direction des Affaires Civiles',
      poste: 'Stagiaire Greffier',
      dateDebut: '2024-02-01'
    },
    historique: [
      {
        action: 'Inscription',
        date: '2024-01-20T09:30:00Z',
        motif: 'Affectation après formation',
        responsable: 'DRH Justice'
      },
      {
        action: 'Affectation temporaire',
        date: '2024-02-01T08:00:00Z',
        organisme: 'Ministère de la Justice',
        motif: 'Stage de pré-affectation',
        responsable: 'Chef Service RH'
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const statut = searchParams.get('statut');
    const priorite = searchParams.get('priorite');
    const recherche = searchParams.get('recherche');

    let fonctionnaires = [...fonctionnairesSimules];

    // Filtres
    if (statut && statut !== 'all') {
      fonctionnaires = fonctionnaires.filter(f => f.statut === statut);
    }

    if (priorite && priorite !== 'all') {
      fonctionnaires = fonctionnaires.filter(f => f.prioriteAffectation === priorite);
    }

    if (recherche) {
      const searchLower = recherche.toLowerCase();
      fonctionnaires = fonctionnaires.filter(f =>
        f.prenom.toLowerCase().includes(searchLower) ||
        f.nom.toLowerCase().includes(searchLower) ||
        f.email.toLowerCase().includes(searchLower) ||
        f.matricule.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = fonctionnaires.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = fonctionnaires.slice(startIndex, endIndex);

    // Statistiques
    const stats = {
      total: fonctionnairesSimules.length,
      enAttente: fonctionnairesSimules.filter(f => f.statut === 'EN_ATTENTE').length,
      affectes: fonctionnairesSimules.filter(f => f.statut === 'AFFECTE').length,
      detaches: fonctionnairesSimules.filter(f => f.statut === 'DETACHE').length,
      suspendus: fonctionnairesSimules.filter(f => f.statut === 'SUSPENDU').length,
      prioriteHaute: fonctionnairesSimules.filter(f => f.prioriteAffectation === 'HAUTE').length,
      prioriteMoyenne: fonctionnairesSimules.filter(f => f.prioriteAffectation === 'MOYENNE').length,
      prioriteBasse: fonctionnairesSimules.filter(f => f.prioriteAffectation === 'BASSE').length,
      avecDoubleRattachement: fonctionnairesSimules.filter(f => f.rattachementPrimaire && f.rattachementSecondaire).length
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
    console.error('Erreur API fonctionnaires en attente:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
