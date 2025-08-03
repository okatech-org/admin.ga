import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Communication {
  id: string;
  titre: string;
  type: 'ANNONCE' | 'INFORMATION' | 'ALERTE' | 'PROCEDURE' | 'FORMATION';
  contenu: string;
  expediteur: {
    nom: string;
    poste: string;
    organisme: string;
    email: string;
  };
  destinataires: {
    type: 'TOUS' | 'ORGANISMES' | 'ROLES' | 'SPECIFIQUE';
    cibles: string[];
  };
  priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
  statut: 'BROUILLON' | 'PROGRAMME' | 'ENVOYE' | 'ARCHIVE';
  dateCreation: string;
  dateEnvoi?: string;
  dateProgrammee?: string;
  statistiques: {
    nbDestinataires: number;
    nbLus: number;
    nbCliques: number;
    tauxLecture: number;
  };
  pieceJointe?: {
    nom: string;
    taille: number;
    type: string;
    url: string;
  }[];
  canal: 'EMAIL' | 'SMS' | 'NOTIFICATION' | 'BULLETIN';
}

// Données simulées
const communicationsSimulees: Communication[] = [
  {
    id: '1',
    titre: 'Mise à jour importante du système',
    type: 'INFORMATION',
    contenu: 'Le système ADMINISTRATION.GA sera mis à jour ce weekend. Veuillez sauvegarder vos données importantes.',
    expediteur: {
      nom: 'Direction Technique',
      poste: 'Administrateur Système',
      organisme: 'Administration GA',
      email: 'tech@administration.ga'
    },
    destinataires: {
      type: 'TOUS',
      cibles: []
    },
    priorite: 'HAUTE',
    statut: 'ENVOYE',
    dateCreation: '2025-01-15T10:00:00Z',
    dateEnvoi: '2025-01-15T10:30:00Z',
    statistiques: {
      nbDestinataires: 979,
      nbLus: 856,
      nbCliques: 123,
      tauxLecture: 87.4
    },
    canal: 'EMAIL'
  },
  {
    id: '2',
    titre: 'Formation Cybersécurité - Inscription ouverte',
    type: 'FORMATION',
    contenu: 'Une formation sur la cybersécurité aura lieu le 25 janvier. Inscriptions obligatoires avant le 20 janvier.',
    expediteur: {
      nom: 'Direction des Ressources Humaines',
      poste: 'Responsable Formation',
      organisme: 'Administration GA',
      email: 'formation@administration.ga'
    },
    destinataires: {
      type: 'ROLES',
      cibles: ['ADMIN', 'MANAGER', 'AGENT']
    },
    priorite: 'MOYENNE',
    statut: 'PROGRAMME',
    dateCreation: '2025-01-14T14:00:00Z',
    dateProgrammee: '2025-01-18T09:00:00Z',
    statistiques: {
      nbDestinataires: 234,
      nbLus: 0,
      nbCliques: 0,
      tauxLecture: 0
    },
    pieceJointe: [
      {
        nom: 'programme_formation_cybersecu.pdf',
        taille: 245760,
        type: 'application/pdf',
        url: '/docs/programme_formation_cybersecu.pdf'
      }
    ],
    canal: 'EMAIL'
  },
  {
    id: '3',
    titre: 'Nouvelle procédure de demande de congés',
    type: 'PROCEDURE',
    contenu: 'La nouvelle procédure de demande de congés est effective immédiatement. Consultez le guide en pièce jointe.',
    expediteur: {
      nom: 'Service RH Central',
      poste: 'Gestionnaire RH',
      organisme: 'Direction Générale',
      email: 'rh@administration.ga'
    },
    destinataires: {
      type: 'ORGANISMES',
      cibles: ['MIN_INT_SEC', 'MIN_ECO_FIN', 'MIN_SANTE']
    },
    priorite: 'MOYENNE',
    statut: 'ENVOYE',
    dateCreation: '2025-01-12T08:30:00Z',
    dateEnvoi: '2025-01-12T09:00:00Z',
    statistiques: {
      nbDestinataires: 156,
      nbLus: 134,
      nbCliques: 89,
      tauxLecture: 85.9
    },
    pieceJointe: [
      {
        nom: 'guide_procedure_conges.pdf',
        taille: 1234567,
        type: 'application/pdf',
        url: '/docs/guide_procedure_conges.pdf'
      }
    ],
    canal: 'EMAIL'
  },
  {
    id: '4',
    titre: 'Alerte sécurité - Tentatives de piratage détectées',
    type: 'ALERTE',
    contenu: 'Des tentatives de piratage ont été détectées. Changez immédiatement vos mots de passe et activez la double authentification.',
    expediteur: {
      nom: 'Centre de Cybersécurité',
      poste: 'Analyste Sécurité',
      organisme: 'ANSSI Gabon',
      email: 'securite@anssi.ga'
    },
    destinataires: {
      type: 'TOUS',
      cibles: []
    },
    priorite: 'HAUTE',
    statut: 'ENVOYE',
    dateCreation: '2025-01-16T16:00:00Z',
    dateEnvoi: '2025-01-16T16:05:00Z',
    statistiques: {
      nbDestinataires: 979,
      nbLus: 921,
      nbCliques: 678,
      tauxLecture: 94.1
    },
    canal: 'NOTIFICATION'
  },
  {
    id: '5',
    titre: 'Bulletin mensuel - Janvier 2025',
    type: 'ANNONCE',
    contenu: 'Découvrez les dernières actualités et nouveautés de l\'administration gabonaise dans notre bulletin mensuel.',
    expediteur: {
      nom: 'Direction Communication',
      poste: 'Responsable Communication',
      organisme: 'Présidence de la République',
      email: 'communication@presidence.ga'
    },
    destinataires: {
      type: 'TOUS',
      cibles: []
    },
    priorite: 'BASSE',
    statut: 'BROUILLON',
    dateCreation: '2025-01-16T10:00:00Z',
    statistiques: {
      nbDestinataires: 979,
      nbLus: 0,
      nbCliques: 0,
      tauxLecture: 0
    },
    canal: 'BULLETIN'
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
    const type = searchParams.get('type');
    const statut = searchParams.get('statut');
    const priorite = searchParams.get('priorite');
    const canal = searchParams.get('canal');
    const recherche = searchParams.get('recherche');

    let communications = [...communicationsSimulees];

    // Filtres
    if (type && type !== 'all') {
      communications = communications.filter(c => c.type === type);
    }

    if (statut && statut !== 'all') {
      communications = communications.filter(c => c.statut === statut);
    }

    if (priorite && priorite !== 'all') {
      communications = communications.filter(c => c.priorite === priorite);
    }

    if (canal && canal !== 'all') {
      communications = communications.filter(c => c.canal === canal);
    }

    if (recherche) {
      const searchLower = recherche.toLowerCase();
      communications = communications.filter(c =>
        c.titre.toLowerCase().includes(searchLower) ||
        c.contenu.toLowerCase().includes(searchLower) ||
        c.expediteur.nom.toLowerCase().includes(searchLower) ||
        c.expediteur.organisme.toLowerCase().includes(searchLower)
      );
    }

    // Tri par date de création (plus récent en premier)
    communications.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());

    // Pagination
    const total = communications.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = communications.slice(startIndex, endIndex);

    // Statistiques
    const stats = {
      total: communicationsSimulees.length,
      brouillons: communicationsSimulees.filter(c => c.statut === 'BROUILLON').length,
      programmees: communicationsSimulees.filter(c => c.statut === 'PROGRAMME').length,
      envoyees: communicationsSimulees.filter(c => c.statut === 'ENVOYE').length,
      archivees: communicationsSimulees.filter(c => c.statut === 'ARCHIVE').length,
      parType: communicationsSimulees.reduce((acc, comm) => {
        acc[comm.type] = (acc[comm.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      parCanal: communicationsSimulees.reduce((acc, comm) => {
        acc[comm.canal] = (acc[comm.canal] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      tauxLectureMoyen: Math.round(
        communicationsSimulees
          .filter(c => c.statut === 'ENVOYE')
          .reduce((sum, c) => sum + c.statistiques.tauxLecture, 0) /
        communicationsSimulees.filter(c => c.statut === 'ENVOYE').length
      )
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
    console.error('Erreur API communications:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      titre,
      type,
      contenu,
      destinataires,
      priorite,
      canal,
      dateProgrammee,
      pieceJointe
    } = body;

    // Validation
    if (!titre || !type || !contenu || !destinataires || !priorite || !canal) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Simuler la création de la communication
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nouvelleCommunication: Communication = {
      id: `comm_${Date.now()}`,
      titre,
      type,
      contenu,
      expediteur: {
        nom: session.user.name || 'Utilisateur',
        poste: 'Administrateur',
        organisme: 'Administration GA',
        email: session.user.email || 'admin@administration.ga'
      },
      destinataires,
      priorite,
      statut: dateProgrammee ? 'PROGRAMME' : 'BROUILLON',
      dateCreation: new Date().toISOString(),
      dateProgrammee,
      statistiques: {
        nbDestinataires: 0,
        nbLus: 0,
        nbCliques: 0,
        tauxLecture: 0
      },
      pieceJointe,
      canal
    };

    return NextResponse.json({
      success: true,
      data: nouvelleCommunication,
      message: 'Communication créée avec succès'
    });

  } catch (error) {
    console.error('Erreur création communication:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}
