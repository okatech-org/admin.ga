/* @ts-nocheck */
import { getAllAdministrations } from '@/lib/data/gabon-administrations';
import { getAllServices } from '@/lib/data/gabon-services-detailles';

import {
  OrganismeCommercial,
  OrganismeStatus,
  TypeContrat,
  ContratInfo,
  ConversionProspectData,
  StatistiquesCommerciales
} from '@/lib/types/organisme';

const STORAGE_KEY = 'admin-ga-organismes-commerciaux';

// Services inclus par type de contrat
const SERVICES_PAR_CONTRAT: Record<TypeContrat, string[]> = {
  STANDARD: [
    'Gestion documentaire de base',
    'Services citoyens numériques',
    'Support technique standard'
  ],
  PREMIUM: [
    'Gestion documentaire avancée',
    'Services citoyens numériques',
    'Workflow automatisés',
    'Analytics et reporting',
    'Support technique prioritaire',
    'Formation équipes'
  ],
  ENTERPRISE: [
    'Suite complète de services',
    'Intégration systèmes existants',
    'Workflow personnalisés',
    'Analytics avancées',
    'Support dédié 24/7',
    'Formation et accompagnement',
    'API personnalisées'
  ],
  GOUVERNEMENTAL: [
    'Suite gouvernementale complète',
    'Sécurité renforcée',
    'Conformité réglementaire',
    'Intégrations inter-ministérielles',
    'Support gouvernemental dédié',
    'Formation institutionnelle',
    'Accompagnement changement'
  ]
};

// Tarifs annuels par type de contrat (en FCFA)
const TARIFS_CONTRAT: Record<TypeContrat, number> = {
  STANDARD: 2500000,     // 2.5M FCFA
  PREMIUM: 8500000,      // 8.5M FCFA
  ENTERPRISE: 25000000,  // 25M FCFA
  GOUVERNEMENTAL: 50000000 // 50M FCFA
};

/**
 * Service de gestion commerciale des organismes
 */
export class OrganismeCommercialService {
  private static instance: OrganismeCommercialService;
  private organismes: OrganismeCommercial[] = [];

  private constructor() {
    this.loadFromStorage();
    if (this.organismes.length === 0) {
      this.initializeOrganismes();
    }
  }

  public static getInstance(): OrganismeCommercialService {
    if (!OrganismeCommercialService.instance) {
      OrganismeCommercialService.instance = new OrganismeCommercialService();
    }
    return OrganismeCommercialService.instance;
  }

  /**
   * Génère des utilisateurs de base pour les organismes
   */
  private generateBasicUsers(organismes: any[]): any[] {
    const users: any[] = [];
    organismes.forEach(org => {
      // Ajouter quelques utilisateurs de base par organisme
      for (let i = 1; i <= 3; i++) {
        users.push({
          id: `${org.code}_user_${i}`,
          nom: `Utilisateur ${i}`,
          email: `user${i}@${org.code.toLowerCase()}.ga`,
          organizationId: org.code,
          role: i === 1 ? 'ADMIN' : 'USER',
          statut: 'actif'
        });
      }
    });
    return users;
  }

  /**
   * Initialise les organismes avec le statut PROSPECT par défaut
   */
  private initializeOrganismes(): void {
    const administrations = getAllAdministrations();
    const users = this.generateBasicUsers(administrations);

    console.log('🏢 Initialisation des organismes commerciaux...');

    this.organismes = administrations.map(admin => {
      const orgUsers = users.filter(user => user.organizationId === admin.code);
      const services = this.getServicesForOrganisme(admin.code);

      // Déterminer la priorité selon le type d'organisme
      const priorite = this.getPrioriteByType(admin.type);

      return {
        id: admin.code,
        code: admin.code,
        nom: admin.nom,
        type: admin.type,
        localisation: admin.localisation,

        // Statut commercial - TOUS PROSPECTS au début
        status: 'PROSPECT' as OrganismeStatus,
        dateAjout: new Date().toISOString(),

        // Informations prospect
        prospectInfo: {
          source: this.getSourceAleatoire(),
          priorite,
          notes: `Organisme ${admin.type.toLowerCase()} à fort potentiel. Nécessite une approche adaptée au secteur public.`,
          dernierContact: new Date().toISOString(),
          responsableProspection: this.getResponsableProspection()
        },

        // Pas d'info client au début
        clientInfo: undefined,

        // Statistiques
        stats: {
          totalUsers: orgUsers.length,
          totalServices: services.length,
          totalPostes: 10,
          activeUsers: Math.floor(orgUsers.length * 0.8)
        },

        // Relations
        services,
        users: orgUsers,
        postes: [],
        contact: {
          telephone: '+241 XX XX XX XX',
          email: `contact@${admin.code.toLowerCase()}.ga`,
          adresse: admin.localisation,
          responsable: `Responsable ${admin.nom}`
        }
      };
    });

    // Convertir quelques organismes en clients pour la démo
    this.convertirOrganismesDemo();

    this.saveToStorage();
    console.log(`✅ ${this.organismes.length} organismes initialisés (${this.getProspects().length} prospects, ${this.getClients().length} clients)`);
  }

  /**
   * Convertit quelques organismes en clients pour la démonstration
   */
  private convertirOrganismesDemo(): void {
    const organismesDemo = ['DGDI', 'MIN_SANTE', 'CNSS', 'MAIRIE_LBV', 'DGI'];

    organismesDemo.forEach((code, index) => {
      const organisme = this.organismes.find(o => o.code === code);
      if (organisme) {
        const typeContrat = ['PREMIUM', 'STANDARD', 'ENTERPRISE', 'GOUVERNEMENTAL', 'PREMIUM'][index] as TypeContrat;
        this.convertirEnClient(organisme.id, {
          organismeId: organisme.id,
          typeContrat,
          montantAnnuel: TARIFS_CONTRAT[typeContrat],
          dureeContrat: 24,
          servicesSelectionnes: SERVICES_PAR_CONTRAT[typeContrat],
          responsableCommercial: 'Jean-Pierre MBOUMBA',
          dateSignature: new Date().toISOString(),
          conditions: 'Contrat standard avec clauses gouvernementales'
        });
      }
    });
  }

  /**
   * Détermine la priorité selon le type d'organisme
   */
  private getPrioriteByType(type: string): 'HAUTE' | 'MOYENNE' | 'BASSE' {
    if (['MINISTERE', 'DIRECTION_GENERALE'].includes(type)) return 'HAUTE';
    if (['MAIRIE', 'PREFECTURE'].includes(type)) return 'MOYENNE';
    return 'BASSE';
  }

  /**
   * Retourne une source par défaut
   */
  private getSourceAleatoire(): 'REFERENCEMENT' | 'DEMANDE_DIRECTE' | 'RECOMMANDATION' {
    return 'REFERENCEMENT';
  }

  /**
   * Retourne un responsable de prospection par défaut
   */
  private getResponsableProspection(): string {
    return 'Équipe Commerciale';
  }

  /**
   * Retourne les services pour un organisme
   */
  private getServicesForOrganisme(organismeCode: string): string[] {
    const allServices = getAllServices();
    const orgIndex = organismeCode.charCodeAt(0) % allServices.length;
    return allServices.slice(orgIndex, orgIndex + 5).map(s => s.nom);
  }

  /**
   * Convertit un prospect en client
   */
  public convertirEnClient(organismeId: string, conversionData: ConversionProspectData): boolean {
    const organisme = this.organismes.find(o => o.id === organismeId);

    if (!organisme || organisme.status === 'CLIENT') {
      return false;
    }

    // Créer les informations contrat
    const contratInfo: ContratInfo = {
      id: `CONTRAT_${organismeId}_${Date.now()}`,
      type: conversionData.typeContrat,
      dateSignature: conversionData.dateSignature,
      dateExpiration: new Date(
        new Date(conversionData.dateSignature).getTime() +
        conversionData.dureeContrat * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      montantAnnuel: conversionData.montantAnnuel,
      servicesInclus: conversionData.servicesSelectionnes,
      responsableCommercial: conversionData.responsableCommercial,
      conditions: conversionData.conditions,
      statut: 'ACTIF'
    };

    // Mettre à jour l'organisme
    organisme.status = 'CLIENT';
    organisme.clientInfo = contratInfo;
    organisme.prospectInfo = undefined; // Supprimer les infos prospect
    organisme.stats.chiffreAffaires = conversionData.montantAnnuel;

    this.saveToStorage();

    console.log(`✅ ${organisme.nom} converti en CLIENT avec contrat ${conversionData.typeContrat}`);
    return true;
  }

  /**
   * Met à jour les informations d'un prospect
   */
  public updateProspectInfo(organismeId: string, prospectInfo: any): boolean {
    const organisme = this.organismes.find(o => o.id === organismeId && o.status === 'PROSPECT');

    if (!organisme) return false;

    organisme.prospectInfo = { ...organisme.prospectInfo, ...prospectInfo };
    this.saveToStorage();

    return true;
  }

  /**
   * Met à jour les informations d'un client
   */
  public updateClientInfo(organismeId: string, clientInfo: Partial<ContratInfo>): boolean {
    const organisme = this.organismes.find(o => o.id === organismeId && o.status === 'CLIENT');

    if (!organisme || !organisme.clientInfo) return false;

    organisme.clientInfo = { ...organisme.clientInfo, ...clientInfo };
    this.saveToStorage();

    return true;
  }

  // === GETTERS ===

  public getAllOrganismes(): OrganismeCommercial[] {
    return [...this.organismes];
  }

  public getProspects(): OrganismeCommercial[] {
    return this.organismes.filter(o => o.status === 'PROSPECT');
  }

  public getClients(): OrganismeCommercial[] {
    return this.organismes.filter(o => o.status === 'CLIENT');
  }

  public getOrganismeById(id: string): OrganismeCommercial | undefined {
    return this.organismes.find(o => o.id === id);
  }

  public getProspectsByPriorite(priorite: 'HAUTE' | 'MOYENNE' | 'BASSE'): OrganismeCommercial[] {
    return this.getProspects().filter(o => o.prospectInfo?.priorite === priorite);
  }

  public getClientsByTypeContrat(type: TypeContrat): OrganismeCommercial[] {
    return this.getClients().filter(o => o.clientInfo?.type === type);
  }

  /**
   * Calcule les statistiques commerciales
   */
  public getStatistiquesCommerciales(): StatistiquesCommerciales {
    const prospects = this.getProspects();
    const clients = this.getClients();

    return {
      prospects: {
        total: prospects.length,
        parPriorite: {
          haute: prospects.filter(p => p.prospectInfo?.priorite === 'HAUTE').length,
          moyenne: prospects.filter(p => p.prospectInfo?.priorite === 'MOYENNE').length,
          basse: prospects.filter(p => p.prospectInfo?.priorite === 'BASSE').length
        },
        parSource: {
          referencement: prospects.filter(p => p.prospectInfo?.source === 'REFERENCEMENT').length,
          demande: prospects.filter(p => p.prospectInfo?.source === 'DEMANDE_DIRECTE').length,
          recommandation: prospects.filter(p => p.prospectInfo?.source === 'RECOMMANDATION').length
        },
        conversionRate: this.organismes.length > 0 ? (clients.length / this.organismes.length) * 100 : 0
      },
      clients: {
        total: clients.length,
        parType: {
          standard: clients.filter(c => c.clientInfo?.type === 'STANDARD').length,
          premium: clients.filter(c => c.clientInfo?.type === 'PREMIUM').length,
          enterprise: clients.filter(c => c.clientInfo?.type === 'ENTERPRISE').length,
          gouvernemental: clients.filter(c => c.clientInfo?.type === 'GOUVERNEMENTAL').length
        },
        chiffreAffairesTotal: clients.reduce((sum, c) => sum + (c.clientInfo?.montantAnnuel || 0), 0),
        chiffreAffairesMoyen: clients.length > 0 ?
          clients.reduce((sum, c) => sum + (c.clientInfo?.montantAnnuel || 0), 0) / clients.length : 0,
        tauxRenouvellement: 85 // À calculer selon les renouvellements réels
      },
      conversions: {
        totalMois: 1, // À calculer selon les conversions réelles
        objectifMois: 5,
        pipeline: prospects.filter(p => p.prospectInfo?.priorite === 'HAUTE').length
      }
    };
  }

  // === PERSISTANCE ===

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.organismes));
    }
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.organismes = JSON.parse(stored);
      }
    }
  }

  /**
   * Remet à zéro tous les organismes en prospects
   */
  public resetToProspects(): void {
    this.organismes.forEach(org => {
      org.status = 'PROSPECT';
      org.clientInfo = undefined;
      if (!org.prospectInfo) {
        org.prospectInfo = {
          source: this.getSourceAleatoire(),
          priorite: this.getPrioriteByType(org.type),
          notes: 'Prospect remis à zéro',
          dernierContact: new Date().toISOString(),
          responsableProspection: this.getResponsableProspection()
        };
      }
    });
    this.saveToStorage();
  }
}

// Instance singleton
export const organismeCommercialService = OrganismeCommercialService.getInstance();
