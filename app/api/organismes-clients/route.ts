import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Interface pour les organismes clients
interface OrganismeClient {
  id: string;
  nom: string;
  code: string;
  siret?: string;
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
  dateContrat?: string;
  statut: 'ACTIF' | 'PROSPECT' | 'SUSPENDU' | 'INACTIF';
  typeContrat?: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE' | 'GOUVERNEMENTAL';
  servicesActifs: string[];
  dernierePaiement?: string;
  prochainePaiement?: string;
  montantMensuel?: number;
  satisfaction?: number;
  performance: {
    requetes: number;
    tempsReponse: number;
    disponibilite: number;
    erreurs: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Données de démonstration
const DEMO_CLIENTS: OrganismeClient[] = [
  {
    id: '1',
    nom: 'Banque Centrale du Gabon',
    code: 'BCG',
    siret: '12345678901234',
    secteurActivite: 'Services Financiers',
    typeEntreprise: 'AUTRE',
    adresse: 'Avenue du Colonel Parant',
    ville: 'Libreville',
    telephone: '+241 01 76 24 65',
    email: 'direction@banque-centrale.ga',
    siteWeb: 'https://banque-centrale.ga',
    responsableLegal: {
      nom: 'NZUE',
      prenom: 'Antoine',
      telephone: '+241 01 76 24 66',
      email: 'a.nzue@banque-centrale.ga'
    },
    nombreEmployes: 250,
    chiffreAffaires: 85000000000,
    dateCreation: '2020-01-15',
    dateContrat: '2023-03-01',
    statut: 'ACTIF',
    typeContrat: 'GOUVERNEMENTAL',
    servicesActifs: ['CNI', 'PASSEPORT', 'CASIER_JUDICIAIRE', 'ACTE_NAISSANCE'],
    dernierePaiement: '2024-01-01',
    prochainePaiement: '2024-02-01',
    montantMensuel: 2500000,
    satisfaction: 4.8,
    performance: {
      requetes: 12450,
      tempsReponse: 0.8,
      disponibilite: 99.9,
      erreurs: 3
    },
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    nom: 'Chambre de Commerce du Gabon',
    code: 'CCG',
    siret: '23456789012345',
    secteurActivite: 'Services aux Entreprises',
    typeEntreprise: 'ASSOCIATION',
    adresse: 'Boulevard Triomphal Omar Bongo',
    ville: 'Libreville',
    telephone: '+241 01 72 35 48',
    email: 'info@chambre-commerce.ga',
    siteWeb: 'https://chambre-commerce.ga',
    responsableLegal: {
      nom: 'MBA',
      prenom: 'Sylvie',
      telephone: '+241 01 72 35 49',
      email: 's.mba@chambre-commerce.ga'
    },
    nombreEmployes: 120,
    chiffreAffaires: 1200000000,
    dateCreation: '2019-06-20',
    dateContrat: '2023-01-15',
    statut: 'ACTIF',
    typeContrat: 'PREMIUM',
    servicesActifs: ['AUTORISATION_COMMERCE', 'CERTIFICAT_ORIGINE', 'REGISTRE_COMMERCE'],
    dernierePaiement: '2024-01-01',
    prochainePaiement: '2024-02-01',
    montantMensuel: 850000,
    satisfaction: 4.5,
    performance: {
      requetes: 8520,
      tempsReponse: 1.2,
      disponibilite: 99.5,
      erreurs: 8
    },
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    nom: 'Port Autonome de Libreville',
    code: 'PAL',
    siret: '34567890123456',
    secteurActivite: 'Transport et Logistique',
    typeEntreprise: 'SA',
    adresse: 'Zone Portuaire, Owendo',
    ville: 'Libreville',
    telephone: '+241 01 70 12 34',
    email: 'direction@port-libreville.ga',
    siteWeb: 'https://port-libreville.ga',
    responsableLegal: {
      nom: 'NDONG',
      prenom: 'Michel',
      telephone: '+241 01 70 12 35',
      email: 'm.ndong@port-libreville.ga'
    },
    nombreEmployes: 300,
    chiffreAffaires: 25000000000,
    dateCreation: '2018-11-10',
    dateContrat: '2023-05-20',
    statut: 'ACTIF',
    typeContrat: 'ENTERPRISE',
    servicesActifs: ['AUTORISATION_IMPORT', 'DECLARATION_DOUANE', 'CERTIFICAT_CONFORMITE'],
    dernierePaiement: '2024-01-01',
    prochainePaiement: '2024-02-01',
    montantMensuel: 1500000,
    satisfaction: 4.7,
    performance: {
      requetes: 15680,
      tempsReponse: 0.9,
      disponibilite: 99.8,
      erreurs: 5
    },
    createdAt: '2023-05-20T00:00:00Z',
    updatedAt: '2024-01-12T09:15:00Z'
  },
  {
    id: '4',
    nom: 'Société Équatoriale de Services',
    code: 'SES',
    secteurActivite: 'Conseil et Services',
    typeEntreprise: 'SARL',
    adresse: 'Quartier Glass, Rue des Palmiers',
    ville: 'Libreville',
    telephone: '+241 01 75 68 92',
    email: 'contact@ses-gabon.com',
    responsableLegal: {
      nom: 'OBAME',
      prenom: 'Patricia',
      telephone: '+241 01 75 68 93',
      email: 'p.obame@ses-gabon.com'
    },
    nombreEmployes: 45,
    dateCreation: '2022-03-15',
    statut: 'PROSPECT',
    servicesActifs: [],
    satisfaction: 0,
    performance: {
      requetes: 0,
      tempsReponse: 0,
      disponibilite: 0,
      erreurs: 0
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '5',
    nom: 'Société Gabonaise d\'Électricité',
    code: 'SEEG',
    secteurActivite: 'Énergie et Utilities',
    typeEntreprise: 'SA',
    adresse: 'Boulevard de l\'Indépendance',
    ville: 'Libreville',
    statut: 'SUSPENDU',
    telephone: '+241 01 76 45 23',
    email: 'info@seeg.ga',
    responsableLegal: {
      nom: 'EYEGHE',
      prenom: 'François',
      telephone: '+241 01 76 45 24',
      email: 'f.eyeghe@seeg.ga'
    },
    nombreEmployes: 800,
    dateCreation: '2020-07-12',
    dateContrat: '2023-02-10',
    typeContrat: 'STANDARD',
    servicesActifs: ['CERTIFICAT_CONFORMITE'],
    dernierePaiement: '2023-11-01',
    prochainePaiement: '2024-02-01',
    montantMensuel: 450000,
    satisfaction: 3.2,
    performance: {
      requetes: 2340,
      tempsReponse: 2.1,
      disponibilite: 97.5,
      erreurs: 15
    },
    createdAt: '2023-02-10T00:00:00Z',
    updatedAt: '2023-12-15T16:45:00Z'
  }
];

// Simulation de stockage en mémoire (en production, utiliser une vraie base de données)
let clients = [...DEMO_CLIENTS];

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
    const search = searchParams.get('search') || '';
    const statut = searchParams.get('statut') || '';
    const secteur = searchParams.get('secteur') || '';
    const typeEntreprise = searchParams.get('typeEntreprise') || '';
    const typeContrat = searchParams.get('typeContrat') || '';

    // Filtrage
    let filteredClients = [...clients];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.nom.toLowerCase().includes(searchLower) ||
        client.code.toLowerCase().includes(searchLower) ||
        client.secteurActivite.toLowerCase().includes(searchLower) ||
        client.ville.toLowerCase().includes(searchLower) ||
        client.responsableLegal.nom.toLowerCase().includes(searchLower) ||
        client.responsableLegal.prenom.toLowerCase().includes(searchLower)
      );
    }

    if (statut && statut !== 'all') {
      filteredClients = filteredClients.filter(client => client.statut === statut);
    }

    if (secteur && secteur !== 'all') {
      filteredClients = filteredClients.filter(client => client.secteurActivite === secteur);
    }

    if (typeEntreprise && typeEntreprise !== 'all') {
      filteredClients = filteredClients.filter(client => client.typeEntreprise === typeEntreprise);
    }

    if (typeContrat && typeContrat !== 'all') {
      filteredClients = filteredClients.filter(client => client.typeContrat === typeContrat);
    }

    // Pagination
    const total = filteredClients.length;
    const startIndex = (page - 1) * limit;
    const paginatedClients = filteredClients.slice(startIndex, startIndex + limit);

    // Statistiques
    const stats = {
      total: clients.length,
      actifs: clients.filter(c => c.statut === 'ACTIF').length,
      prospects: clients.filter(c => c.statut === 'PROSPECT').length,
      suspendus: clients.filter(c => c.statut === 'SUSPENDU').length,
      inactifs: clients.filter(c => c.statut === 'INACTIF').length,
      revenueTotal: clients.reduce((sum, c) => sum + (c.montantMensuel || 0), 0) * 12,
      revenueMensuel: clients.reduce((sum, c) => sum + (c.montantMensuel || 0), 0),
      satisfactionMoyenne: clients.filter(c => c.satisfaction).length > 0
        ? clients.filter(c => c.satisfaction).reduce((sum, c) => sum + (c.satisfaction || 0), 0) / clients.filter(c => c.satisfaction).length
        : 0,
      parSecteur: clients.reduce((acc, client) => {
        acc[client.secteurActivite] = (acc[client.secteurActivite] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      parType: clients.reduce((acc, client) => {
        acc[client.typeEntreprise] = (acc[client.typeEntreprise] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      parContrat: clients.reduce((acc, client) => {
        if (client.typeContrat) {
          acc[client.typeContrat] = (acc[client.typeContrat] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      success: true,
      data: {
        clients: paginatedClients,
        stats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: startIndex + limit < total
        }
      }
    });

  } catch (error) {
    console.error('Erreur API organismes clients:', error);
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

    // Validation des données requises
    if (!body.nom || !body.code || !body.secteurActivite) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants (nom, code, secteurActivite)' },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du code
    if (clients.some(c => c.code === body.code)) {
      return NextResponse.json(
        { success: false, error: 'Le code client existe déjà' },
        { status: 409 }
      );
    }

    // Créer le nouveau client
    const newClient: OrganismeClient = {
      id: Date.now().toString(),
      nom: body.nom,
      code: body.code,
      secteurActivite: body.secteurActivite,
      typeEntreprise: body.typeEntreprise || 'AUTRE',
      adresse: body.adresse || '',
      ville: body.ville || '',
      telephone: body.telephone,
      email: body.email,
      siteWeb: body.siteWeb,
      responsableLegal: body.responsableLegal || {
        nom: '',
        prenom: '',
        telephone: '',
        email: ''
      },
      nombreEmployes: body.nombreEmployes,
      chiffreAffaires: body.chiffreAffaires,
      dateCreation: new Date().toISOString().split('T')[0],
      statut: body.statut || 'PROSPECT',
      servicesActifs: body.servicesActifs || [],
      performance: {
        requetes: 0,
        tempsReponse: 0,
        disponibilite: 0,
        erreurs: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    clients.push(newClient);

    return NextResponse.json({
      success: true,
      data: newClient,
      message: 'Client créé avec succès'
    });

  } catch (error) {
    console.error('Erreur création client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID client requis' },
        { status: 400 }
      );
    }

    const clientIndex = clients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le client
    clients[clientIndex] = {
      ...clients[clientIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: clients[clientIndex],
      message: 'Client mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur mise à jour client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID client requis' },
        { status: 400 }
      );
    }

    const clientIndex = clients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    const deletedClient = clients[clientIndex];
    clients.splice(clientIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedClient,
      message: 'Client supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression client:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
