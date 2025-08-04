/* @ts-nocheck */
// @ts-ignore
export const GABON_SERVICES_DETAILLES = {
  "titre": "Guide Complet des Démarches Administratives au Gabon",
  "description": "Tous les services possibles qu'un citoyen gabonais peut effectuer dans sa vie auprès des administrations publiques",
  "version": "2025.1",
  "date_mise_a_jour": "2025-07-27",

  "parcours_de_vie": {
    "naissance_enfance": {
      "description": "Démarches de la naissance à la majorité",
      "demarches": [
        {
          "nom": "Déclaration de naissance",
          "code": "DECL_NAISSANCE",
          "organisme_responsable": "MAIRE_LBV", // Mairie du lieu de naissance
          "type_organisme": "MAIRIE",
          "delai_declaration": "30 jours maximum",
          "documents_requis": [
            "Certificat médical d'accouchement",
            "Pièce d'identité des parents",
            "Acte de mariage des parents (si mariés)",
            "Témoins (si nécessaire)"
          ],
          "cout": "Gratuit",
          "delai_traitement": "Immédiat",
          "validite": "Permanente"
        },
        {
          "nom": "Acte de naissance (copie intégrale)",
          "code": "ACTE_NAISSANCE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Demande écrite",
            "Justificatif d'identité du demandeur",
            "Justificatif de filiation (si demande par un tiers)"
          ],
          "cout": "1 000 FCFA",
          "delai_traitement": "24-48 heures",
          "validite": "3 mois pour l'administration"
        },
        {
          "nom": "Acte de reconnaissance paternelle/maternelle",
          "code": "RECONNAISSANCE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Pièce d'identité du déclarant",
            "Acte de naissance de l'enfant",
            "Témoins"
          ],
          "cout": "Gratuit",
          "delai_traitement": "Immédiat"
        },
        {
          "nom": "Inscription scolaire (primaire)",
          "code": "INSCR_PRIMAIRE",
          "organisme_responsable": "DRE_EST", // Direction Régionale de l'Éducation
          "type_organisme": "DIRECTION_REGIONALE",
          "documents_requis": [
            "Acte de naissance de l'enfant",
            "Certificat médical",
            "Carnet de vaccination",
            "Certificat de résidence",
            "Photos d'identité"
          ],
          "cout": "Selon l'école",
          "delai_traitement": "Variable selon période",
          "age_requis": "6 ans minimum"
        },
        {
          "nom": "Autorisation de sortie du territoire (mineur)",
          "code": "AST_MINEUR",
          "organisme_responsable": "PPL", // Préfecture de Police
          "type_organisme": "PREFECTURE_POLICE",
          "documents_requis": [
            "Acte de naissance du mineur",
            "Autorisation parentale notariée",
            "Pièces d'identité des parents",
            "Passeport du mineur",
            "Billet d'avion"
          ],
          "cout": "5 000 FCFA",
          "delai_traitement": "48 heures",
          "validite": "Voyage spécifique"
        }
      ]
    },

    "education_formation": {
      "description": "Démarches liées à l'éducation et à la formation",
      "demarches": [
        {
          "nom": "Inscription au secondaire",
          "code": "INSCR_SECONDAIRE",
          "organisme_responsable": "DRE_EST",
          "type_organisme": "DIRECTION_REGIONALE",
          "documents_requis": [
            "Certificat d'études primaires (CEP)",
            "Acte de naissance",
            "Certificat médical",
            "Certificat de résidence",
            "Photos d'identité"
          ],
          "cout": "Variable",
          "delai_traitement": "Selon calendrier scolaire"
        },
        {
          "nom": "Demande de bourse d'études (secondaire)",
          "code": "BOURSE_SECONDAIRE",
          "organisme_responsable": "MIN_EDUC",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Dossier scolaire",
            "Attestation de ressources parentales",
            "Acte de naissance",
            "Certificat médical",
            "Attestation de nationalité"
          ],
          "cout": "Gratuit",
          "delai_traitement": "2-3 mois"
        },
        {
          "nom": "Inscription universitaire",
          "code": "INSCR_UNIVERSITE",
          "organisme_responsable": "UOB", // Université Omar Bongo
          "type_organisme": "UNIVERSITE_PUBLIQUE",
          "documents_requis": [
            "Baccalauréat ou équivalent",
            "Acte de naissance",
            "Certificat médical",
            "Certificat de nationalité",
            "Photos d'identité",
            "Dossier scolaire"
          ],
          "cout": "Variable selon université",
          "delai_traitement": "1-2 semaines"
        },
        {
          "nom": "Demande de bourse d'études supérieures",
          "code": "BOURSE_SUPERIEURE",
          "organisme_responsable": "MIN_ENS_SUP",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Dossier universitaire",
            "Attestation de ressources familiales",
            "Acte de naissance",
            "Certificat de nationalité",
            "Projet d'études"
          ],
          "cout": "Gratuit",
          "delai_traitement": "3-6 mois"
        },
        {
          "nom": "Équivalence de diplômes étrangers",
          "code": "EQUIV_DIPLOME",
          "organisme_responsable": "MIN_ENS_SUP",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Diplômes originaux",
            "Traduction certifiée",
            "Relevés de notes",
            "Programmes d'études",
            "Acte de naissance"
          ],
          "cout": "25 000 FCFA",
          "delai_traitement": "2-6 mois"
        },
        {
          "nom": "Formation professionnelle",
          "code": "FORMATION_PRO",
          "organisme_responsable": "MIN_TRAVAIL",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Niveau d'études requis",
            "Acte de naissance",
            "Certificat médical",
            "Photos d'identité"
          ],
          "cout": "Variable",
          "delai_traitement": "Selon calendrier des formations"
        }
      ]
    },

    "identite_citoyennete": {
      "description": "Documents d'identité et de citoyenneté",
      "demarches": [
        {
          "nom": "Première Carte Nationale d'Identité",
          "code": "CNI_PREMIERE",
          "organisme_responsable": "DGDI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Acte de naissance (moins de 3 mois)",
            "Certificat de nationalité",
            "Certificat médical",
            "Certificat de résidence",
            "Photos d'identité biométriques",
            "Empreintes digitales"
          ],
          "cout": "10 000 FCFA",
          "delai_traitement": "15-30 jours",
          "validite": "10 ans",
          "age_requis": "16 ans minimum"
        },
        {
          "nom": "Renouvellement CNI",
          "code": "CNI_RENOUVELLEMENT",
          "organisme_responsable": "DGDI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Ancienne CNI",
            "Acte de naissance récent",
            "Certificat de résidence",
            "Photos d'identité biométriques"
          ],
          "cout": "10 000 FCFA",
          "delai_traitement": "15-30 jours",
          "validite": "10 ans"
        },
        {
          "nom": "Duplicata CNI (perte/vol)",
          "code": "CNI_DUPLICATA",
          "organisme_responsable": "DGDI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Déclaration de perte/vol (police)",
            "Acte de naissance récent",
            "Certificat de résidence",
            "Photos d'identité biométriques",
            "Témoins"
          ],
          "cout": "15 000 FCFA",
          "delai_traitement": "15-30 jours"
        },
        {
          "nom": "Premier passeport",
          "code": "PASSEPORT_PREMIER",
          "organisme_responsable": "DGDI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "CNI en cours de validité",
            "Acte de naissance (moins de 3 mois)",
            "Certificat de nationalité",
            "Certificat médical",
            "Photos d'identité biométriques",
            "Justificatif de domicile"
          ],
          "cout": "50 000 FCFA",
          "delai_traitement": "30-45 jours",
          "validite": "5 ans"
        },
        {
          "nom": "Renouvellement passeport",
          "code": "PASSEPORT_RENOUVELLEMENT",
          "organisme_responsable": "DGDI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Ancien passeport",
            "CNI en cours de validité",
            "Photos d'identité biométriques",
            "Justificatif de domicile"
          ],
          "cout": "50 000 FCFA",
          "delai_traitement": "30-45 jours",
          "validite": "5 ans"
        },
        {
          "nom": "Certificat de nationalité",
          "code": "CERT_NATIONALITE",
          "organisme_responsable": "MIN_JUS",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Acte de naissance du demandeur",
            "Acte de naissance des parents",
            "Acte de mariage des parents",
            "Pièce d'identité",
            "Témoins de moralité"
          ],
          "cout": "15 000 FCFA",
          "delai_traitement": "3-6 mois",
          "validite": "6 mois"
        }
      ]
    },

    "travail_emploi": {
      "description": "Démarches liées au travail et à l'emploi",
      "demarches": [
        {
          "nom": "Recherche d'emploi (inscription ONE)",
          "code": "INSCR_ONE",
          "organisme_responsable": "ONE",
          "type_organisme": "ORGANISME_SOCIAL",
          "documents_requis": [
            "CNI",
            "Diplômes/certificats",
            "CV",
            "Photos d'identité"
          ],
          "cout": "Gratuit",
          "delai_traitement": "Immédiat"
        },
        {
          "nom": "Immatriculation CNSS (salarié)",
          "code": "IMMAT_CNSS",
          "organisme_responsable": "CNSS",
          "type_organisme": "ORGANISME_SOCIAL",
          "documents_requis": [
            "CNI",
            "Acte de naissance",
            "Certificat médical d'embauche",
            "Contrat de travail",
            "Photos d'identité"
          ],
          "cout": "Gratuit",
          "delai_traitement": "7-15 jours"
        },
        {
          "nom": "Carte CNAMGS",
          "code": "CARTE_CNAMGS",
          "organisme_responsable": "CNAMGS",
          "type_organisme": "ORGANISME_SOCIAL",
          "documents_requis": [
            "CNI",
            "Justificatif d'emploi ou CNSS",
            "Photos d'identité",
            "Certificat médical"
          ],
          "cout": "5 000 FCFA",
          "delai_traitement": "15-30 jours",
          "validite": "1 an renouvelable"
        },
        {
          "nom": "Permis de travail (étranger)",
          "code": "PERMIS_TRAVAIL",
          "organisme_responsable": "MIN_TRAVAIL",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Passeport avec visa",
            "Contrat de travail visé",
            "Diplômes légalisés",
            "Certificat médical",
            "Casier judiciaire du pays d'origine",
            "Photos d'identité"
          ],
          "cout": "100 000 FCFA",
          "delai_traitement": "30-60 jours",
          "validite": "1 an renouvelable"
        },
        {
          "nom": "Attestation de travail",
          "code": "ATTEST_TRAVAIL",
          "organisme_responsable": "DGT", // Direction Générale du Travail
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Demande de l'employé",
            "Justificatifs d'emploi"
          ],
          "cout": "Gratuit",
          "delai_traitement": "48 heures"
        },
        {
          "nom": "Déclaration d'accident du travail",
          "code": "DECL_ACCIDENT",
          "organisme_responsable": "CNSS",
          "type_organisme": "ORGANISME_SOCIAL",
          "documents_requis": [
            "Déclaration d'accident",
            "Certificat médical initial",
            "Témoignages",
            "Rapport d'enquête"
          ],
          "cout": "Gratuit",
          "delai_declaration": "48 heures maximum"
        },
        {
          "nom": "Inscription au chômage",
          "code": "INSCR_CHOMAGE",
          "organisme_responsable": "ONE",
          "type_organisme": "ORGANISME_SOCIAL",
          "documents_requis": [
            "Lettre de licenciement",
            "Certificat de travail",
            "CNI",
            "Relevé de compte bancaire"
          ],
          "cout": "Gratuit",
          "delai_traitement": "7-15 jours"
        }
      ]
    },

    "logement_habitat": {
      "description": "Démarches liées au logement et à l'habitat",
      "demarches": [
        {
          "nom": "Certificat de résidence",
          "code": "CERT_RESIDENCE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "CNI",
            "Justificatif de domicile",
            "Témoins de résidence"
          ],
          "cout": "2 000 FCFA",
          "delai_traitement": "24-48 heures",
          "validite": "3 mois"
        },
        {
          "nom": "Permis de construire",
          "code": "PERMIS_CONSTRUIRE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Plan architectural",
            "Plan de situation",
            "Notice descriptive",
            "Étude de sol",
            "Titre foncier du terrain",
            "CNI du demandeur"
          ],
          "cout": "Variable selon surface",
          "delai_traitement": "2-6 mois"
        },
        {
          "nom": "Certificat d'urbanisme",
          "code": "CERT_URBANISME",
          "organisme_responsable": "ANUTTC", // Agence Nationale d'Urbanisme
          "type_organisme": "AGENCE_PUBLIQUE",
          "documents_requis": [
            "Plan de situation",
            "Titre foncier",
            "CNI du demandeur"
          ],
          "cout": "10 000 FCFA",
          "delai_traitement": "30-45 jours",
          "validite": "2 ans"
        },
        {
          "nom": "Titre foncier",
          "code": "TITRE_FONCIER",
          "organisme_responsable": "ANUTTC",
          "type_organisme": "AGENCE_PUBLIQUE",
          "documents_requis": [
            "Demande écrite",
            "Plan topographique",
            "Justificatifs d'acquisition",
            "Enquête de commodo",
            "CNI"
          ],
          "cout": "Variable selon superficie",
          "delai_traitement": "6-18 mois"
        },
        {
          "nom": "Certificat de conformité des travaux",
          "code": "CERT_CONFORMITE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Permis de construire",
            "Plans d'exécution",
            "Procès-verbal de récolement"
          ],
          "cout": "50 000 FCFA",
          "delai_traitement": "30-60 jours"
        },
        {
          "nom": "Raccordement eau/électricité",
          "code": "RACCORDEMENT",
          "organisme_responsable": "SEEG",
          "type_organisme": "EPIC",
          "documents_requis": [
            "Permis de construire",
            "Plan de situation",
            "CNI du demandeur",
            "Justificatif de propriété"
          ],
          "cout": "Variable",
          "delai_traitement": "15-45 jours"
        }
      ]
    },

    "famille_mariage": {
      "description": "Démarches familiales et matrimoniales",
      "demarches": [
        {
          "nom": "Publication des bans de mariage",
          "code": "PUBLICATION_BANS",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Acte de naissance des futurs époux (moins de 3 mois)",
            "CNI des futurs époux",
            "Certificat de célibat",
            "Certificat médical prénuptial",
            "Photos d'identité",
            "Témoins"
          ],
          "cout": "10 000 FCFA",
          "delai_traitement": "10 jours minimum",
          "validite": "1 an"
        },
        {
          "nom": "Célébration du mariage civil",
          "code": "MARIAGE_CIVIL",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "prerequis": "Publication des bans",
          "documents_requis": [
            "Dossier de publication des bans",
            "Témoins majeurs (2 minimum par époux)",
            "Pièces d'identité des témoins"
          ],
          "cout": "25 000 FCFA",
          "delai_traitement": "Jour fixé"
        },
        {
          "nom": "Acte de mariage (copie)",
          "code": "ACTE_MARIAGE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Demande écrite",
            "CNI du demandeur",
            "Justificatif de qualité (époux, famille, etc.)"
          ],
          "cout": "2 000 FCFA",
          "delai_traitement": "24-48 heures",
          "validite": "3 mois"
        },
        {
          "nom": "Divorce par consentement mutuel",
          "code": "DIVORCE_MUTUEL",
          "organisme_responsable": "TPI_LBV", // Tribunal de Première Instance
          "type_organisme": "TRIBUNAL_PREMIERE_INSTANCE",
          "documents_requis": [
            "Convention de divorce",
            "Acte de mariage",
            "Actes de naissance des enfants",
            "Inventaire des biens"
          ],
          "cout": "Variable (avocat obligatoire)",
          "delai_traitement": "3-6 mois"
        },
        {
          "nom": "Reconnaissance de paternité",
          "code": "RECONNAISSANCE_PATERNITE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "CNI du père",
            "Acte de naissance de l'enfant",
            "Consentement de la mère (si besoin)"
          ],
          "cout": "Gratuit (mairie) / Variable (notaire)",
          "delai_traitement": "Immédiat"
        },
        {
          "nom": "Livret de famille",
          "code": "LIVRET_FAMILLE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Acte de mariage ou acte de naissance du premier enfant",
            "CNI des parents"
          ],
          "cout": "Gratuit",
          "delai_traitement": "Immédiat"
        },
        {
          "nom": "Adoption (demande)",
          "code": "DEMANDE_ADOPTION",
          "organisme_responsable": "TPI_LBV",
          "type_organisme": "TRIBUNAL_PREMIERE_INSTANCE",
          "documents_requis": [
            "Dossier social complet",
            "Certificat médical",
            "Casier judiciaire",
            "Justificatifs de ressources",
            "Acte de mariage",
            "Enquête sociale"
          ],
          "cout": "Variable",
          "delai_traitement": "12-24 mois"
        }
      ]
    },

    "sante_social": {
      "description": "Démarches de santé et sociales",
      "demarches": [
        {
          "nom": "Certificat médical général",
          "code": "CERT_MEDICAL",
          "organisme_responsable": "CHUL", // Centre Hospitalier Universitaire
          "type_organisme": "CHU",
          "documents_requis": [
            "CNI",
            "Carnet de santé"
          ],
          "cout": "10 000 - 25 000 FCFA",
          "delai_traitement": "Immédiat",
          "validite": "Variable selon usage"
        },
        {
          "nom": "Certificat médical de non-contagion",
          "code": "CERT_NON_CONTAGION",
          "organisme_responsable": "DRS_EST", // Direction Régionale de la Santé
          "type_organisme": "DIRECTION_REGIONALE",
          "documents_requis": [
            "CNI",
            "Examens médicaux"
          ],
          "cout": "15 000 FCFA",
          "delai_traitement": "24-48 heures",
          "validite": "3 mois"
        },
        {
          "nom": "Autorisation d'exercice médical",
          "code": "AUTOR_EXERCICE_MED",
          "organisme_responsable": "MIN_SANTE",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Diplôme de médecine",
            "Stages validés",
            "Casier judiciaire",
            "Certificat de moralité",
            "CNI"
          ],
          "cout": "100 000 FCFA",
          "delai_traitement": "3-6 mois"
        },
        {
          "nom": "Carte d'invalidité",
          "code": "CARTE_INVALIDITE",
          "organisme_responsable": "MIN_FEMME", // Ministère des Affaires Sociales
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Certificat médical spécialisé",
            "CNI",
            "Photos d'identité",
            "Dossier médical complet"
          ],
          "cout": "Gratuit",
          "delai_traitement": "2-3 mois",
          "validite": "5 ans renouvelable"
        },
        {
          "nom": "Allocation familiale",
          "code": "ALLOC_FAMILIALE",
          "organisme_responsable": "CNSS",
          "type_organisme": "ORGANISME_SOCIAL",
          "documents_requis": [
            "Actes de naissance des enfants",
            "Certificat de scolarité",
            "Certificat médical",
            "Justificatif CNSS"
          ],
          "cout": "Gratuit",
          "delai_traitement": "30 jours"
        },
        {
          "nom": "Aide sociale (indigents)",
          "code": "AIDE_SOCIALE",
          "organisme_responsable": "MIN_FEMME",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Enquête sociale",
            "Certificat d'indigence",
            "CNI",
            "Justificatifs de ressources"
          ],
          "cout": "Gratuit",
          "delai_traitement": "1-2 mois"
        }
      ]
    },

    "transport_mobilite": {
      "description": "Démarches liées au transport et à la mobilité",
      "demarches": [
        {
          "nom": "Permis de conduire (première demande)",
          "code": "PERMIS_CONDUIRE",
          "organisme_responsable": "MIN_TRANSPORT",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "CNI",
            "Certificat médical d'aptitude",
            "Test psychotechnique",
            "Photos d'identité",
            "Justificatif de résidence",
            "Certificat d'auto-école"
          ],
          "cout": "50 000 FCFA",
          "delai_traitement": "30-45 jours",
          "age_requis": "18 ans minimum"
        },
        {
          "nom": "Renouvellement permis de conduire",
          "code": "RENOUV_PERMIS",
          "organisme_responsable": "MIN_TRANSPORT",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Ancien permis",
            "CNI",
            "Certificat médical",
            "Photos d'identité"
          ],
          "cout": "25 000 FCFA",
          "delai_traitement": "15-30 jours"
        },
        {
          "nom": "Duplicata permis de conduire",
          "code": "DUPLIC_PERMIS",
          "organisme_responsable": "MIN_TRANSPORT",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Déclaration de perte/vol",
            "CNI",
            "Photos d'identité",
            "Certificat médical"
          ],
          "cout": "35 000 FCFA",
          "delai_traitement": "30 jours"
        },
        {
          "nom": "Immatriculation véhicule neuf",
          "code": "IMMAT_VEHICULE",
          "organisme_responsable": "MIN_TRANSPORT",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Facture d'achat",
            "Certificat de conformité",
            "Assurance véhicule",
            "CNI du propriétaire",
            "Quitus fiscal"
          ],
          "cout": "Variable selon véhicule",
          "delai_traitement": "7-15 jours"
        },
        {
          "nom": "Mutation véhicule (changement propriétaire)",
          "code": "MUTATION_VEHICULE",
          "organisme_responsable": "MIN_TRANSPORT",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Carte grise originale",
            "Acte de vente légalisé",
            "CNI ancien et nouveau propriétaire",
            "Certificat de non-gage",
            "Nouvelle assurance"
          ],
          "cout": "15 000 FCFA",
          "delai_traitement": "7-10 jours"
        },
        {
          "nom": "Visite technique véhicule",
          "code": "VISITE_TECHNIQUE",
          "organisme_responsable": "ANAC", // Agence Nationale Aviation Civile (services techniques)
          "type_organisme": "AGENCE_PUBLIQUE",
          "documents_requis": [
            "Carte grise",
            "Assurance en cours",
            "Véhicule en état"
          ],
          "cout": "25 000 FCFA",
          "delai_traitement": "Immédiat",
          "validite": "1 an"
        },
        {
          "nom": "Transport public (licence)",
          "code": "LICENCE_TRANSPORT",
          "organisme_responsable": "MIN_TRANSPORT",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Dossier commercial",
            "Véhicules conformes",
            "Assurance responsabilité civile",
            "Casier judiciaire",
            "CNI"
          ],
          "cout": "Variable selon type",
          "delai_traitement": "2-3 mois"
        }
      ]
    },

    "commerce_entreprise": {
      "description": "Démarches commerciales et entrepreneuriales",
      "demarches": [
        {
          "nom": "Registre de Commerce et Crédit Mobilier (RCCM)",
          "code": "RCCM",
          "organisme_responsable": "MIN_COMMERCE",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Statuts de l'entreprise",
            "PV de l'assemblée constitutive",
            "CNI des dirigeants",
            "Justificatif du siège social",
            "Déclaration fiscale d'existence"
          ],
          "cout": "Variable selon capital",
          "delai_traitement": "15-30 jours"
        },
        {
          "nom": "Autorisation d'exercer le commerce",
          "code": "AUTOR_COMMERCE",
          "organisme_responsable": "MIN_COMMERCE",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "RCCM",
            "CNI",
            "Justificatif du local commercial",
            "Autorisation municipale"
          ],
          "cout": "25 000 FCFA",
          "delai_traitement": "30 jours",
          "validite": "1 an renouvelable"
        },
        {
          "nom": "Licence d'importation/exportation",
          "code": "LICENCE_IMPORT_EXPORT",
          "organisme_responsable": "MIN_COMMERCE",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "RCCM",
            "Justificatifs financiers",
            "Autorisation de change",
            "Factures pro-forma"
          ],
          "cout": "Variable selon marchandises",
          "delai_traitement": "15-45 jours"
        },
        {
          "nom": "Patente commerciale",
          "code": "PATENTE",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "RCCM",
            "CNI",
            "Justificatif du local",
            "Déclaration d'activité"
          ],
          "cout": "Variable selon activité",
          "delai_traitement": "7-15 jours",
          "validite": "1 an"
        },
        {
          "nom": "Agrément d'établissement industriel",
          "code": "AGREMENT_INDUSTRIEL",
          "organisme_responsable": "MIN_INDUSTRIE",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Étude de faisabilité",
            "Étude d'impact environnemental",
            "Plans d'implantation",
            "Justificatifs financiers",
            "RCCM"
          ],
          "cout": "Variable selon projet",
          "delai_traitement": "3-6 mois"
        },
        {
          "nom": "Autorisation d'établissement de crédit",
          "code": "AUTOR_CREDIT",
          "organisme_responsable": "MIN_ECO", // Via BEAC
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Dossier d'agrément complet",
            "Justificatifs de capital",
            "Organigramme",
            "Business plan"
          ],
          "cout": "Variable",
          "delai_traitement": "6-12 mois"
        }
      ]
    },

    "justice_legal": {
      "description": "Démarches judiciaires et légales",
      "demarches": [
        {
          "nom": "Casier judiciaire (bulletin n°3)",
          "code": "CASIER_JUDICIAIRE",
          "organisme_responsable": "MIN_JUS",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "CNI",
            "Demande écrite",
            "Photos d'identité",
            "Justificatif de l'usage"
          ],
          "cout": "2 000 FCFA",
          "delai_traitement": "7-15 jours",
          "validite": "3 mois"
        },
        {
          "nom": "Légalisation de signature",
          "code": "LEGALISATION",
          "organisme_responsable": "MIN_JUS",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Document à légaliser",
            "CNI du signataire",
            "Présence du signataire"
          ],
          "cout": "1 000 - 5 000 FCFA",
          "delai_traitement": "Immédiat"
        },
        {
          "nom": "Apostille (pour l'étranger)",
          "code": "APOSTILLE",
          "organisme_responsable": "MIN_JUS",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Document légalisé",
            "Demande d'apostille",
            "Justificatif d'usage"
          ],
          "cout": "10 000 FCFA",
          "delai_traitement": "7-15 jours"
        },
        {
          "nom": "Constitution de partie civile",
          "code": "PARTIE_CIVILE",
          "organisme_responsable": "TPI_LBV",
          "type_organisme": "TRIBUNAL_PREMIERE_INSTANCE",
          "documents_requis": [
            "Plainte avec constitution de partie civile",
            "Justificatifs du préjudice",
            "CNI",
            "Consignation"
          ],
          "cout": "Variable",
          "delai_traitement": "Variable"
        },
        {
          "nom": "Demande d'aide juridictionnelle",
          "code": "AIDE_JURIDIQUE",
          "organisme_responsable": "TPI_LBV",
          "type_organisme": "TRIBUNAL_PREMIERE_INSTANCE",
          "documents_requis": [
            "Déclaration de ressources",
            "Justificatifs financiers",
            "CNI",
            "Nature du litige"
          ],
          "cout": "Gratuit",
          "delai_traitement": "30-45 jours"
        },
        {
          "nom": "Acte notarié",
          "code": "ACTE_NOTARIE",
          "organisme_responsable": "CNNG", // Chambre Nationale des Notaires
          "type_organisme": "ORDRE_PROFESSIONNEL",
          "documents_requis": [
            "CNI des parties",
            "Documents relatifs à l'acte",
            "Témoins (si nécessaire)"
          ],
          "cout": "Variable selon acte",
          "delai_traitement": "Variable"
        }
      ]
    },

    "fiscalite_impots": {
      "description": "Démarches fiscales et d'impôts",
      "demarches": [
        {
          "nom": "Déclaration d'existence fiscale",
          "code": "DECL_EXISTENCE_FISCALE",
          "organisme_responsable": "DGI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "RCCM (entreprise) ou CNI (particulier)",
            "Statuts (entreprise)",
            "Justificatif du siège/domicile"
          ],
          "cout": "Gratuit",
          "delai_traitement": "7-15 jours"
        },
        {
          "nom": "Déclaration d'impôt sur le revenu",
          "code": "DECL_IMPOT_REVENU",
          "organisme_responsable": "DGI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Formulaire de déclaration",
            "Justificatifs de revenus",
            "Justificatifs de charges déductibles",
            "CNI"
          ],
          "cout": "Gratuit",
          "delai_declaration": "31 mars de chaque année"
        },
        {
          "nom": "Quitus fiscal",
          "code": "QUITUS_FISCAL",
          "organisme_responsable": "DGI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Situation fiscale à jour",
            "Demande écrite",
            "CNI ou RCCM"
          ],
          "cout": "5 000 FCFA",
          "delai_traitement": "7-15 jours",
          "validite": "3 mois"
        },
        {
          "nom": "Attestation fiscale",
          "code": "ATTEST_FISCALE",
          "organisme_responsable": "DGI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "CNI ou RCCM",
            "Justificatif du motif"
          ],
          "cout": "2 000 FCFA",
          "delai_traitement": "48 heures",
          "validite": "3 mois"
        },
        {
          "nom": "Remboursement de crédit de TVA",
          "code": "REMBOURS_TVA",
          "organisme_responsable": "DGI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Demande de remboursement",
            "Déclarations TVA",
            "Factures justificatives",
            "RCCM"
          ],
          "cout": "Gratuit",
          "delai_traitement": "3-6 mois"
        },
        {
          "nom": "Dégrèvement d'impôt",
          "code": "DEGREVEMENT",
          "organisme_responsable": "DGI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Demande motivée",
            "Justificatifs du motif",
            "Avis d'imposition contesté"
          ],
          "cout": "Gratuit",
          "delai_traitement": "2-4 mois"
        }
      ]
    },

    "retraite_vieillesse": {
      "description": "Démarches de retraite et vieillesse",
      "demarches": [
        {
          "nom": "Demande de pension de retraite CNSS",
          "code": "PENSION_RETRAITE",
          "organisme_responsable": "CNSS",
          "type_organisme": "ORGANISME_SOCIAL",
          "documents_requis": [
            "Demande de liquidation",
            "Relevé de carrière",
            "Acte de naissance",
            "CNI",
            "Certificat médical",
            "Certificats de travail",
            "RIB"
          ],
          "cout": "Gratuit",
          "delai_traitement": "3-6 mois",
          "age_requis": "60 ans ou 55 ans (fonction publique)"
        },
        {
          "nom": "Pension de retraite fonction publique",
          "code": "PENSION_FONC_PUB",
          "organisme_responsable": "MIN_FONC_PUB",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Dossier de mise à la retraite",
            "États de service",
            "Acte de naissance",
            "CNI",
            "Certificat médical"
          ],
          "cout": "Gratuit",
          "delai_traitement": "6-12 mois"
        },
        {
          "nom": "Carte du troisième âge",
          "code": "CARTE_3EME_AGE",
          "organisme_responsable": "MIN_FEMME",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "CNI",
            "Acte de naissance",
            "Photos d'identité",
            "Certificat médical"
          ],
          "cout": "Gratuit",
          "delai_traitement": "30 jours",
          "age_requis": "60 ans",
          "avantages": "Réductions transports, soins médicaux"
        },
        {
          "nom": "Allocation de solidarité (personnes âgées)",
          "code": "ALLOC_SOLIDARITE",
          "organisme_responsable": "MIN_FEMME",
          "type_organisme": "MINISTERE",
          "documents_requis": [
            "Enquête sociale",
            "Justificatifs de ressources",
            "CNI",
            "Certificat médical"
          ],
          "cout": "Gratuit",
          "delai_traitement": "2-3 mois"
        }
      ]
    },

    "deces_succession": {
      "description": "Démarches liées au décès et succession",
      "demarches": [
        {
          "nom": "Déclaration de décès",
          "code": "DECL_DECES",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Certificat médical de décès",
            "CNI du déclarant",
            "CNI du défunt (si disponible)",
            "Livret de famille"
          ],
          "cout": "Gratuit",
          "delai_declaration": "24 heures maximum",
          "delai_traitement": "Immédiat"
        },
        {
          "nom": "Acte de décès (copie)",
          "code": "ACTE_DECES",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Demande écrite",
            "CNI du demandeur",
            "Justificatif de qualité (famille, héritier, etc.)"
          ],
          "cout": "1 000 FCFA",
          "delai_traitement": "24-48 heures",
          "validite": "Permanente"
        },
        {
          "nom": "Permis d'inhumer",
          "code": "PERMIS_INHUMER",
          "organisme_responsable": "MAIRE_LBV",
          "type_organisme": "MAIRIE",
          "documents_requis": [
            "Acte de décès",
            "Autorisation médicale",
            "Concession funéraire ou autorisation familiale"
          ],
          "cout": "Gratuit",
          "delai_traitement": "Immédiat"
        },
        {
          "nom": "Déclaration de succession",
          "code": "DECL_SUCCESSION",
          "organisme_responsable": "DGI",
          "type_organisme": "DIRECTION_GENERALE",
          "documents_requis": [
            "Acte de décès",
            "Inventaire des biens",
            "Actes de propriété",
            "Relevés bancaires",
            "CNI des héritiers"
          ],
          "cout": "Variable selon patrimoine",
          "delai_declaration": "6 mois",
          "delai_traitement": "2-6 mois"
        },
        {
          "nom": "Certificat d'hérédité",
          "code": "CERT_HEREDITE",
          "organisme_responsable": "TPI_LBV",
          "type_organisme": "TRIBUNAL_PREMIERE_INSTANCE",
          "documents_requis": [
            "Acte de décès",
            "Actes de naissance des héritiers",
            "Acte de mariage du défunt",
            "Testament (si existant)"
          ],
          "cout": "25 000 FCFA",
          "delai_traitement": "1-3 mois"
        },
        {
          "nom": "Transfert de propriété (succession)",
          "code": "TRANSFERT_PROPRIETE",
          "organisme_responsable": "ANUTTC",
          "type_organisme": "AGENCE_PUBLIQUE",
          "documents_requis": [
            "Certificat d'hérédité",
            "Titre foncier original",
            "Quitus fiscal",
            "Partage successoral"
          ],
          "cout": "Variable",
          "delai_traitement": "3-6 mois"
        }
      ]
    }
  },

  "mapping_services_organismes": {
    "DGDI": {
      "nom": "Direction Générale de la Documentation et de l'Immigration",
      "services": [
        "CNI_PREMIERE", "CNI_RENOUVELLEMENT", "CNI_DUPLICATA",
        "PASSEPORT_PREMIER", "PASSEPORT_RENOUVELLEMENT"
      ]
    },
    "MAIRE_LBV": {
      "nom": "Mairie de Libreville (et autres mairies)",
      "services": [
        "DECL_NAISSANCE", "ACTE_NAISSANCE", "RECONNAISSANCE",
        "CERT_RESIDENCE", "PERMIS_CONSTRUIRE", "CERT_CONFORMITE",
        "PUBLICATION_BANS", "MARIAGE_CIVIL", "ACTE_MARIAGE",
        "RECONNAISSANCE_PATERNITE", "LIVRET_FAMILLE", "PATENTE",
        "DECL_DECES", "ACTE_DECES", "PERMIS_INHUMER"
      ]
    },
    "CNSS": {
      "nom": "Caisse Nationale de Sécurité Sociale",
      "services": [
        "IMMAT_CNSS", "DECL_ACCIDENT", "ALLOC_FAMILIALE", "PENSION_RETRAITE"
      ]
    },
    "CNAMGS": {
      "nom": "Caisse Nationale d'Assurance Maladie et de Garantie Sociale",
      "services": ["CARTE_CNAMGS"]
    },
    "ONE": {
      "nom": "Office National de l'Emploi",
      "services": ["INSCR_ONE", "INSCR_CHOMAGE"]
    },
    "MIN_JUS": {
      "nom": "Ministère de la Justice",
      "services": [
        "CERT_NATIONALITE", "CASIER_JUDICIAIRE", "LEGALISATION", "APOSTILLE"
      ]
    },
    "MIN_EDUC": {
      "nom": "Ministère de l'Éducation Nationale",
      "services": ["BOURSE_SECONDAIRE"]
    },
    "MIN_ENS_SUP": {
      "nom": "Ministère de l'Enseignement Supérieur",
      "services": ["BOURSE_SUPERIEURE", "EQUIV_DIPLOME"]
    },
    "MIN_TRAVAIL": {
      "nom": "Ministère du Travail",
      "services": ["PERMIS_TRAVAIL", "FORMATION_PRO"]
    },
    "MIN_SANTE": {
      "nom": "Ministère de la Santé",
      "services": ["AUTOR_EXERCICE_MED"]
    },
    "MIN_TRANSPORT": {
      "nom": "Ministère des Transports",
      "services": [
        "PERMIS_CONDUIRE", "RENOUV_PERMIS", "DUPLIC_PERMIS",
        "IMMAT_VEHICULE", "MUTATION_VEHICULE", "LICENCE_TRANSPORT"
      ]
    },
    "MIN_COMMERCE": {
      "nom": "Ministère du Commerce",
      "services": ["RCCM", "AUTOR_COMMERCE", "LICENCE_IMPORT_EXPORT"]
    },
    "MIN_INDUSTRIE": {
      "nom": "Ministère de l'Industrie",
      "services": ["AGREMENT_INDUSTRIEL"]
    },
    "MIN_ECO": {
      "nom": "Ministère de l'Économie",
      "services": ["AUTOR_CREDIT"]
    },
    "MIN_FONC_PUB": {
      "nom": "Ministère de la Fonction Publique",
      "services": ["PENSION_FONC_PUB"]
    },
    "MIN_FEMME": {
      "nom": "Ministère de la Femme et des Affaires Sociales",
      "services": ["CARTE_INVALIDITE", "AIDE_SOCIALE", "CARTE_3EME_AGE", "ALLOC_SOLIDARITE"]
    },
    "DGI": {
      "nom": "Direction Générale des Impôts",
      "services": [
        "DECL_EXISTENCE_FISCALE", "DECL_IMPOT_REVENU", "QUITUS_FISCAL",
        "ATTEST_FISCALE", "REMBOURS_TVA", "DEGREVEMENT", "DECL_SUCCESSION"
      ]
    },
    "DGT": {
      "nom": "Direction Générale du Travail",
      "services": ["ATTEST_TRAVAIL"]
    },
    "DRE_EST": {
      "nom": "Direction Régionale de l'Éducation",
      "services": ["INSCR_PRIMAIRE", "INSCR_SECONDAIRE"]
    },
    "DRS_EST": {
      "nom": "Direction Régionale de la Santé",
      "services": ["CERT_NON_CONTAGION"]
    },
    "PPL": {
      "nom": "Préfecture de Police de Libreville",
      "services": ["AST_MINEUR"]
    },
    "ANUTTC": {
      "nom": "Agence Nationale de l'Urbanisme et du Cadastre",
      "services": ["CERT_URBANISME", "TITRE_FONCIER", "TRANSFERT_PROPRIETE"]
    },
    "ANAC": {
      "nom": "Agence Nationale de l'Aviation Civile",
      "services": ["VISITE_TECHNIQUE"]
    },
    "SEEG": {
      "nom": "Société d'Énergie et d'Eau du Gabon",
      "services": ["RACCORDEMENT"]
    },
    "UOB": {
      "nom": "Université Omar Bongo",
      "services": ["INSCR_UNIVERSITE"]
    },
    "CHUL": {
      "nom": "Centre Hospitalier Universitaire de Libreville",
      "services": ["CERT_MEDICAL"]
    },
    "TPI_LBV": {
      "nom": "Tribunal de Première Instance de Libreville",
      "services": ["DIVORCE_MUTUEL", "DEMANDE_ADOPTION", "PARTIE_CIVILE", "AIDE_JURIDIQUE", "CERT_HEREDITE"]
    },
    "CNNG": {
      "nom": "Chambre Nationale des Notaires",
      "services": ["ACTE_NOTARIE"]
    },
    "MIN_ENVIR": {
      "nom": "Ministère de l'Environnement",
      "services": ["ETUDE_IMPACT", "AUTOR_ENVIRONNEMENT"]
    },
    "AGENCE_ECO": {
      "nom": "Agence Nationale de Promotion Économique",
      "services": ["INCITATION_INVEST", "SUBVENTION_ECO"]
    }
  },

  "categories_services": {
    "etat_civil": {
      "nom": "État Civil",
      "description": "Services liés aux actes d'état civil",
      "services": [
        "DECL_NAISSANCE", "ACTE_NAISSANCE", "RECONNAISSANCE",
        "PUBLICATION_BANS", "MARIAGE_CIVIL", "ACTE_MARIAGE",
        "RECONNAISSANCE_PATERNITE", "LIVRET_FAMILLE",
        "DECL_DECES", "ACTE_DECES"
      ]
    },
    "identite": {
      "nom": "Documents d'Identité",
      "description": "Carte d'identité, passeport et documents d'identification",
      "services": [
        "CNI_PREMIERE", "CNI_RENOUVELLEMENT", "CNI_DUPLICATA",
        "PASSEPORT_PREMIER", "PASSEPORT_RENOUVELLEMENT",
        "CERT_NATIONALITE"
      ]
    },
    "travail_emploi": {
      "nom": "Travail et Emploi",
      "description": "Services liés à l'emploi et au travail",
      "services": [
        "INSCR_ONE", "IMMAT_CNSS", "CARTE_CNAMGS", "PERMIS_TRAVAIL",
        "ATTEST_TRAVAIL", "DECL_ACCIDENT", "INSCR_CHOMAGE"
      ]
    },
    "education": {
      "nom": "Éducation et Formation",
      "description": "Services éducatifs et de formation",
      "services": [
        "INSCR_PRIMAIRE", "INSCR_SECONDAIRE", "BOURSE_SECONDAIRE",
        "INSCR_UNIVERSITE", "BOURSE_SUPERIEURE", "EQUIV_DIPLOME",
        "FORMATION_PRO"
      ]
    },
    "logement": {
      "nom": "Logement et Habitat",
      "description": "Services liés au logement et à l'urbanisme",
      "services": [
        "CERT_RESIDENCE", "PERMIS_CONSTRUIRE", "CERT_URBANISME",
        "TITRE_FONCIER", "CERT_CONFORMITE", "RACCORDEMENT"
      ]
    },
    "transport": {
      "nom": "Transport et Mobilité",
      "description": "Services de transport et véhicules",
      "services": [
        "PERMIS_CONDUIRE", "RENOUV_PERMIS", "DUPLIC_PERMIS",
        "IMMAT_VEHICULE", "MUTATION_VEHICULE", "VISITE_TECHNIQUE",
        "LICENCE_TRANSPORT", "AST_MINEUR"
      ]
    },
    "commerce": {
      "nom": "Commerce et Entreprise",
      "description": "Services aux entreprises et commerces",
      "services": [
        "RCCM", "AUTOR_COMMERCE", "LICENCE_IMPORT_EXPORT",
        "PATENTE", "AGREMENT_INDUSTRIEL", "AUTOR_CREDIT"
      ]
    },
    "justice": {
      "nom": "Justice et Légal",
      "description": "Services judiciaires et légaux",
      "services": [
        "CASIER_JUDICIAIRE", "LEGALISATION", "APOSTILLE",
        "PARTIE_CIVILE", "AIDE_JURIDIQUE", "ACTE_NOTARIE",
        "DIVORCE_MUTUEL", "DEMANDE_ADOPTION"
      ]
    },
    "fiscal": {
      "nom": "Fiscal et Impôts",
      "description": "Services fiscaux et d'impôts",
      "services": [
        "DECL_EXISTENCE_FISCALE", "DECL_IMPOT_REVENU", "QUITUS_FISCAL",
        "ATTEST_FISCALE", "REMBOURS_TVA", "DEGREVEMENT"
      ]
    },
    "sante_social": {
      "nom": "Santé et Social",
      "description": "Services de santé et d'aide sociale",
      "services": [
        "CERT_MEDICAL", "CERT_NON_CONTAGION", "AUTOR_EXERCICE_MED",
        "CARTE_INVALIDITE", "ALLOC_FAMILIALE", "AIDE_SOCIALE"
      ]
    },
    "retraite": {
      "nom": "Retraite et Vieillesse",
      "description": "Services pour les retraités et personnes âgées",
      "services": [
        "PENSION_RETRAITE", "PENSION_FONC_PUB", "CARTE_3EME_AGE",
        "ALLOC_SOLIDARITE"
      ]
    },
    "succession": {
      "nom": "Décès et Succession",
      "description": "Services liés au décès et aux successions",
      "services": [
        "DECL_DECES", "ACTE_DECES", "PERMIS_INHUMER",
        "DECL_SUCCESSION", "CERT_HEREDITE", "TRANSFERT_PROPRIETE"
      ]
    }
  },

  "delais_types": {
    "immediat": "Immédiat",
    "24_48h": "24-48 heures",
    "7_15j": "7-15 jours",
    "15_30j": "15-30 jours",
    "30_45j": "30-45 jours",
    "2_3m": "2-3 mois",
    "3_6m": "3-6 mois",
    "6_12m": "6-12 mois",
    "12_24m": "12-24 mois"
  },

  "cout_types": {
    "gratuit": "Gratuit",
    "faible": "1 000 - 10 000 FCFA",
    "moyen": "10 000 - 50 000 FCFA",
    "eleve": "50 000 - 200 000 FCFA",
    "variable": "Variable selon dossier"
  }
} as const;

// Types dérivés pour TypeScript
export type ServiceCode = string;
export type OrganismeCode = string;
export type CategoryService =
  | 'etat_civil'
  | 'identite'
  | 'travail_emploi'
  | 'education'
  | 'logement'
  | 'transport'
  | 'commerce'
  | 'justice'
  | 'fiscal'
  | 'sante_social'
  | 'retraite'
  | 'succession';

export interface ServiceDetaille {
  nom: string;
  code: ServiceCode;
  organisme_responsable: OrganismeCode;
  type_organisme: string;
  documents_requis: string[];
  cout: string;
  delai_traitement: string;
  validite?: string;
  age_requis?: string;
  avantages?: string;
  prerequis?: string;
  delai_declaration?: string;
}

export interface MappingServiceOrganisme {
  nom: string;
  services: ServiceCode[];
}

// Utilitaires pour récupérer les données
export const getAllServices = (): ServiceDetaille[] => {
  const allServices: ServiceDetaille[] = [];

  Object.values(GABON_SERVICES_DETAILLES.parcours_de_vie).forEach(parcours => {
    if (parcours.demarches) {
      parcours.demarches.forEach(service => {
        allServices.push(service as ServiceDetaille);
      });
    }
  });

  return allServices;
};

export const getServicesByOrganisme = (organismeCode: OrganismeCode): ServiceDetaille[] => {
  return getAllServices().filter(service =>
    service.organisme_responsable === organismeCode
  );
};

export const getServicesByCategory = (category: CategoryService): ServiceDetaille[] => {
  const categoryServices = GABON_SERVICES_DETAILLES.categories_services[category];
  if (!categoryServices) return [];

  return getAllServices().filter(service =>
    (categoryServices.services as any).includes(service.code)
  );
};

export const getOrganismeMapping = (): Record<OrganismeCode, MappingServiceOrganisme> => {
  return GABON_SERVICES_DETAILLES.mapping_services_organismes as any;
};

export const getServiceByCode = (serviceCode: ServiceCode): ServiceDetaille | undefined => {
  return getAllServices().find(service => service.code === serviceCode);
};

// Fonction pour lier un service à un organisme
export const linkServiceToOrganisme = (serviceCode: ServiceCode, organismeCode: OrganismeCode): boolean => {
  const service = getServiceByCode(serviceCode);
  if (service) {
    service.organisme_responsable = organismeCode;
    return true;
  }
  return false;
};

// Fonctions utilitaires pour obtenir des détails sur les organismes
export const getOrganismeDetails = (organismeCode: OrganismeCode) => {
  const mapping = getOrganismeMapping();
  return mapping[organismeCode] || null;
};

export const hasOrganismeDetails = (organismeCode: OrganismeCode): boolean => {
  const mapping = getOrganismeMapping();
  return organismeCode in mapping;
};
