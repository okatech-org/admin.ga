/* @ts-nocheck */
// @ts-ignore

export const GRADES_FONCTION_PUBLIQUE = [
  "A1 - Administrateur Principal",
  "A2 - Administrateur",
  "B1 - Attaché Principal",
  "B2 - Attaché",
  "B3 - Secrétaire d'Administration Principal",
  "C1 - Secrétaire d'Administration",
  "C2 - Agent d'Administration Principal",
  "C3 - Agent d'Administration",
  "D1 - Commis Principal",
  "D2 - Commis",
  "D3 - Aide-Commis"
];

export const CATEGORIES_POSTES = [
  "Direction Générale",
  "Direction Centrale",
  "Direction Régionale",
  "Service Central",
  "Service Déconcentré",
  "Bureau",
  "Section",
  "Unité"
];

export const DIRECTIONS_CENTRALES = [
  "Direction Générale",
  "Direction des Ressources Humaines",
  "Direction Financière",
  "Direction Juridique",
  "Direction de la Communication",
  "Direction des Systèmes d'Information",
  "Direction de l'Audit Interne",
  "Direction de la Planification",
  "Direction des Affaires Générales"
];

export const POSTES_TRANSFORMATION_DIGITALE = [
  "Directeur de la Transformation Digitale",
  "Chef de Service Digital",
  "Responsable Innovation",
  "Analyste Digital",
  "Développeur Applications",
  "Administrateur Systèmes"
];

export const HIERARCHIE_TERRITORIALE = {
  "national": ["Direction Générale"],
  "regional": ["Direction Régionale", "Service Déconcentré"],
  "local": ["Bureau Local", "Antenne"]
};

export const METADATA_ADMINISTRATION = {
  version: "1.0",
  derniere_mise_a_jour: "2025-01-19",
  total_postes: 0,
  source: "Administration Gabonaise"
};

export const POSTES_ADMINISTRATIFS = {
  "version": "1.0",
  "date_mise_a_jour": "2025-01-19",
  "total_postes": 0,
  "postes": [],
  "hierarchie": {},
  "relations": []
};

export const getAllPostes = () => {
  return [
    { id: "1", nom: "Directeur Général", grade: "A1", categorie: "Direction Générale" },
    { id: "2", nom: "Directeur Adjoint", grade: "A2", categorie: "Direction Générale" },
    { id: "3", nom: "Chef de Service", grade: "B1", categorie: "Service Central" },
    { id: "4", nom: "Attaché Principal", grade: "B1", categorie: "Service Central" },
    { id: "5", nom: "Attaché", grade: "B2", categorie: "Service Central" },
    { id: "6", nom: "Secrétaire Principal", grade: "B3", categorie: "Bureau" },
    { id: "7", nom: "Agent d'Administration", grade: "C2", categorie: "Bureau" },
    { id: "8", nom: "Commis", grade: "D1", categorie: "Section" }
  ];
};

// Fonction manquante requise par postes-administratifs/page.tsx
export const getPostesByGrade = (grade: string) => {
  const allPostes = getAllPostes();
  return allPostes.filter(poste => poste.grade === grade);
};

export const getPostesByCategorie = (categorie: string) => {
  const allPostes = getAllPostes();
  return allPostes.filter(poste => poste.categorie === categorie);
};

export const createPoste = (posteData: any) => {
  return {
    id: `new_${Date.now()}`,
    nom: posteData.nom,
    grade: posteData.grade,
    categorie: posteData.categorie,
    description: posteData.description || '',
    statut: 'Nouveau'
  };
};

export const getGradesDisponibles = () => {
  return GRADES_FONCTION_PUBLIQUE;
};

export const getCategoriesDisponibles = () => {
  return CATEGORIES_POSTES;
};
