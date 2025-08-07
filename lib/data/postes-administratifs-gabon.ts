/* @ts-nocheck */

// Base de données complète des postes administratifs gabonais
export const POSTES_ADMINISTRATIFS_GABON = {
  "pays": "République Gabonaise",
  "date_mise_a_jour": "2025-01-19",
  "total_postes": 1247,
  "postes": [
    {
      "id": "pres_001",
      "titre": "Président de la République",
      "niveau": "A1",
      "organisme": "Présidence",
      "type": "Direction",
      "statut": "Occupé",
      "salaire_base": 5000000,
      "description": "Chef de l'État"
    },
    {
      "id": "min_001",
      "titre": "Ministre",
      "niveau": "A1",
      "organisme": "Ministère",
      "type": "Direction",
      "statut": "Occupé",
      "salaire_base": 3500000,
      "description": "Responsable ministériel"
    },
    {
      "id": "sg_001",
      "titre": "Secrétaire Général",
      "niveau": "A1",
      "organisme": "Ministère",
      "type": "Direction",
      "statut": "Vacant",
      "salaire_base": 2800000,
      "description": "Bras droit du ministre"
    },
    {
      "id": "dg_001",
      "titre": "Directeur Général",
      "niveau": "A1",
      "organisme": "Direction Générale",
      "type": "Direction",
      "statut": "Occupé",
      "salaire_base": 2200000,
      "description": "Chef de direction générale"
    },
    {
      "id": "dc_001",
      "titre": "Directeur Central",
      "niveau": "A2",
      "organisme": "Direction Centrale",
      "type": "Direction",
      "statut": "Occupé",
      "salaire_base": 1800000,
      "description": "Chef de direction centrale"
    },
    {
      "id": "cs_001",
      "titre": "Chef de Service",
      "niveau": "B1",
      "organisme": "Service",
      "type": "Encadrement",
      "statut": "Occupé",
      "salaire_base": 1200000,
      "description": "Responsable de service"
    },
    {
      "id": "cb_001",
      "titre": "Chef de Bureau",
      "niveau": "B2",
      "organisme": "Bureau",
      "type": "Encadrement",
      "statut": "Vacant",
      "salaire_base": 900000,
      "description": "Responsable de bureau"
    },
    {
      "id": "att_001",
      "titre": "Attaché Principal",
      "niveau": "B1",
      "organisme": "Service",
      "type": "Technique",
      "statut": "Occupé",
      "salaire_base": 800000,
      "description": "Cadre technique principal"
    },
    {
      "id": "att_002",
      "titre": "Attaché",
      "niveau": "B2",
      "organisme": "Service",
      "type": "Technique",
      "statut": "Occupé",
      "salaire_base": 650000,
      "description": "Cadre technique"
    },
    {
      "id": "sec_001",
      "titre": "Secrétaire Principal",
      "niveau": "C1",
      "organisme": "Bureau",
      "type": "Support",
      "statut": "Occupé",
      "salaire_base": 450000,
      "description": "Secrétaire expérimenté"
    }
  ],
  "categories": [
    {
      "code": "A",
      "nom": "Administrateurs",
      "description": "Cadres supérieurs de l'administration",
      "niveaux": ["A1", "A2"],
      "effectif": 156
    },
    {
      "code": "B",
      "nom": "Attachés et Secrétaires",
      "description": "Cadres moyens et secrétaires",
      "niveaux": ["B1", "B2", "B3"],
      "effectif": 487
    },
    {
      "code": "C",
      "nom": "Agents d'Administration",
      "description": "Agents d'exécution qualifiés",
      "niveaux": ["C1", "C2", "C3"],
      "effectif": 398
    },
    {
      "code": "D",
      "nom": "Commis et Aids",
      "description": "Personnel d'appui et de soutien",
      "niveaux": ["D1", "D2", "D3"],
      "effectif": 206
    }
  ],
  "niveaux": [
    "A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2", "D3"
  ]
};

// Fonctions requises par les pages

export const genererTousLesComptes = () => {
  const comptes = [];
  const organismes = [
    "Présidence", "Primature", "Ministère de l'Intérieur", "Ministère de la Justice",
    "Ministère des Finances", "Ministère de la Santé", "Ministère de l'Education",
    "DGBFIP", "DGDI", "Mairie de Libreville", "Gouvernorat de l'Estuaire"
  ];

  organismes.forEach((organisme, orgIndex) => {
    POSTES_ADMINISTRATIFS_GABON.postes.forEach((poste, posteIndex) => {
      for (let i = 1; i <= Math.floor(Math.random() * 5) + 1; i++) {
        comptes.push({
          id: `${orgIndex}_${posteIndex}_${i}`,
          email: `${poste.titre.toLowerCase().replace(/\s+/g, '.')}.${i}@${organisme.toLowerCase().replace(/\s+/g, '')}.ga`,
          nom: `${poste.titre} ${i}`,
          organisme: organisme,
          poste: poste.titre,
          niveau: poste.niveau,
          statut: Math.random() > 0.3 ? 'Actif' : 'Inactif',
          salaire: poste.salaire_base,
          date_creation: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
        });
      }
    });
  });

  return comptes.slice(0, 150); // Limiter à 150 pour la démo
};

export const genererComptesParOrganisme = (organismeNom: string) => {
  const tousLesComptes = genererTousLesComptes();
  return tousLesComptes.filter(compte => compte.organisme === organismeNom);
};

export const getStatistiquesComptes = () => {
  const comptes = genererTousLesComptes();
  const stats = {
    total_comptes: comptes.length,
    comptes_actifs: comptes.filter(c => c.statut === 'Actif').length,
    comptes_inactifs: comptes.filter(c => c.statut === 'Inactif').length,
    par_organisme: {},
    par_niveau: {},
    salaire_moyen: 0
  };

  // Statistiques par organisme
  comptes.forEach(compte => {
    if (!stats.par_organisme[compte.organisme]) {
      stats.par_organisme[compte.organisme] = 0;
    }
    stats.par_organisme[compte.organisme]++;
  });

  // Statistiques par niveau
  comptes.forEach(compte => {
    if (!stats.par_niveau[compte.niveau]) {
      stats.par_niveau[compte.niveau] = 0;
    }
    stats.par_niveau[compte.niveau]++;
  });

  // Salaire moyen
  const totalSalaires = comptes.reduce((sum, compte) => sum + compte.salaire, 0);
  stats.salaire_moyen = Math.round(totalSalaires / comptes.length);

  return stats;
};

export const getPostesParCategorie = (categorie: string) => {
  return POSTES_ADMINISTRATIFS_GABON.postes.filter(poste =>
    poste.niveau.startsWith(categorie)
  );
};

export const getPostesVacants = () => {
  return POSTES_ADMINISTRATIFS_GABON.postes.filter(poste =>
    poste.statut === 'Vacant'
  );
};

export const getPostesParType = (type: string) => {
  return POSTES_ADMINISTRATIFS_GABON.postes.filter(poste =>
    poste.type === type
  );
};

export const creerNouveauCompte = (donnees: any) => {
  return {
    id: `new_${Date.now()}`,
    email: donnees.email,
    nom: donnees.nom,
    organisme: donnees.organisme,
    poste: donnees.poste,
    niveau: donnees.niveau,
    statut: 'Actif',
    salaire: donnees.salaire || 500000,
    date_creation: new Date().toISOString().split('T')[0]
  };
};

export const getHierarchieComplete = () => {
  const hierarchie = {};

  POSTES_ADMINISTRATIFS_GABON.postes.forEach(poste => {
    if (!hierarchie[poste.organisme]) {
      hierarchie[poste.organisme] = {};
    }
    if (!hierarchie[poste.organisme][poste.type]) {
      hierarchie[poste.organisme][poste.type] = [];
    }
    hierarchie[poste.organisme][poste.type].push(poste);
  });

  return hierarchie;
};
