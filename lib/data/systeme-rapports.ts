/**
 * MODULE DE RAPPORTS ET CONTRÔLE
 * Génération de rapports détaillés pour le système complet
 * Analyse et visualisation des données des 141 organismes gabonais
 */

import {
  SystemeComplet,
  OrganismePublic,
  UtilisateurOrganisme,
  TypeOrganisme,
  implementerSystemeComplet
} from './systeme-complet-gabon';

import {
  extensionsSysteme
} from './systeme-extensions';

// ==================== TYPES POUR LES RAPPORTS ====================

export interface RapportControle {
  "📋 RÉSUMÉ GÉNÉRAL": {
    "Total organismes": number;
    "Total utilisateurs": number;
    "Organismes avec admin": number;
    "Organismes avec réceptionniste": number;
    "Moyenne utilisateurs/organisme": number;
  };
  "👥 RÉPARTITION PAR RÔLE": {
    ADMIN: number;
    USER: number;
    RECEPTIONIST: number;
  };
  "🏛️ RÉPARTITION PAR TYPE": Record<TypeOrganisme, number>;
  "✅ VALIDATION": {
    "Tous les organismes ont un admin": boolean;
    "Tous les organismes ont un réceptionniste": boolean;
    "Emails uniques": boolean;
    "Codes organismes uniques": boolean;
    "Tous les utilisateurs ont un organisme valide": boolean;
  };
  "📈 TOP 10 ORGANISMES PAR UTILISATEURS": Array<{
    nom: string;
    code: string;
    type: TypeOrganisme;
    utilisateurs: number;
    admins: number;
    users: number;
    receptionists: number;
  }>;
  "📉 ORGANISMES AVEC PEU D'UTILISATEURS": Array<{
    nom: string;
    code: string;
    utilisateurs: number;
    probleme?: string;
  }>;
  "🎯 STATISTIQUES DÉTAILLÉES": {
    "Ministères": {
      total: number;
      utilisateurs: number;
      moyenneParMinistere: number;
    };
    "Directions Générales": {
      total: number;
      utilisateurs: number;
      moyenneParDirection: number;
    };
    "Établissements Publics": {
      total: number;
      utilisateurs: number;
      moyenneParEtablissement: number;
    };
  };
  "⚠️ ANOMALIES DÉTECTÉES": string[];
  "📊 MÉTRIQUES DE QUALITÉ": {
    scoreCompletude: number;
    scoreValidation: number;
    scoreCouverture: number;
    scoreGlobal: number;
  };
}

export interface RapportDetaille extends RapportControle {
  "🔍 ANALYSE PAR ORGANISME": Array<{
    code: string;
    nom: string;
    type: TypeOrganisme;
    statut: string;
    nombreUtilisateurs: number;
    rolesPresents: string[];
    emailContact: string;
    problemes: string[];
  }>;
  "👤 ANALYSE DES UTILISATEURS": {
    totalHommes: number;
    totalFemmes: number;
    ratioHommesFemmes: string;
    utilisateursActifs: number;
    utilisateursInactifs: number;
    emailsDupliques: string[];
  };
  "📅 INFORMATIONS TEMPORELLES": {
    dateGeneration: Date;
    tempsGeneration?: number;
    version: string;
  };
}

// ==================== FONCTION PRINCIPALE DE RAPPORT ====================

/**
 * Générer un rapport de contrôle complet
 */
export function genererRapportControle(systeme: SystemeComplet): RapportControle {
  // Calculs de base
  const moyenneUsersParOrganisme = Math.round(
    (systeme.utilisateurs.length / systeme.organismes.length) * 100
  ) / 100;

  // Vérifications de validation
  const emailsUniques = new Set(systeme.utilisateurs.map(u => u.email)).size === systeme.utilisateurs.length;
  const codesUniques = new Set(systeme.organismes.map(o => o.code)).size === systeme.organismes.length;
  const tousUtilisateursOntOrganisme = systeme.utilisateurs.every(u =>
    systeme.organismes.some(o => o.code === u.organisme_code)
  );

  // Calcul des TOP 10 organismes
  const organismesAvecComptage = systeme.organismes.map(org => {
    const utilisateursOrg = systeme.utilisateurs.filter(u => u.organisme_code === org.code);
    return {
      nom: org.nom,
      code: org.code,
      type: org.type,
      utilisateurs: utilisateursOrg.length,
      admins: utilisateursOrg.filter(u => u.role === 'ADMIN').length,
      users: utilisateursOrg.filter(u => u.role === 'USER').length,
      receptionists: utilisateursOrg.filter(u => u.role === 'RECEPTIONIST').length
    };
  });

  const top10 = organismesAvecComptage
    .sort((a, b) => b.utilisateurs - a.utilisateurs)
    .slice(0, 10);

  // Organismes avec peu d'utilisateurs (< 3)
  const organismesPeuUtilisateurs = organismesAvecComptage
    .filter(o => o.utilisateurs < 3)
    .map(o => ({
      nom: o.nom,
      code: o.code,
      utilisateurs: o.utilisateurs,
      probleme: o.utilisateurs === 0 ? 'Aucun utilisateur' :
                o.utilisateurs === 1 ? 'Un seul utilisateur' :
                o.admins === 0 ? 'Pas d\'administrateur' :
                o.receptionists === 0 ? 'Pas de réceptionniste' : undefined
    }))
    .filter(o => o.probleme);

  // Statistiques par type d'organisme
  const ministeres = systeme.organismes.filter(o => o.type === 'MINISTERE');
  const directionsGenerales = systeme.organismes.filter(o => o.type === 'DIRECTION_GENERALE');
  const etablissementsPublics = systeme.organismes.filter(o => o.type === 'ETABLISSEMENT_PUBLIC');

  const utilisateursMinisteres = systeme.utilisateurs.filter(u =>
    ministeres.some(m => m.code === u.organisme_code)
  );
  const utilisateursDirections = systeme.utilisateurs.filter(u =>
    directionsGenerales.some(d => d.code === u.organisme_code)
  );
  const utilisateursEtablissements = systeme.utilisateurs.filter(u =>
    etablissementsPublics.some(e => e.code === u.organisme_code)
  );

  // Détection d'anomalies
  const anomalies: string[] = [];

  if (!emailsUniques) {
    const emails = systeme.utilisateurs.map(u => u.email);
    const duplicates = emails.filter((e, i) => emails.indexOf(e) !== i);
    anomalies.push(`Emails dupliqués détectés: ${duplicates.length}`);
  }

  if (!codesUniques) {
    anomalies.push('Codes d\'organismes dupliqués détectés');
  }

  if (systeme.statistiques.organismesAvecAdmin < systeme.statistiques.totalOrganismes) {
    const diff = systeme.statistiques.totalOrganismes - systeme.statistiques.organismesAvecAdmin;
    anomalies.push(`${diff} organisme(s) sans administrateur`);
  }

  if (systeme.statistiques.organismesAvecReceptionniste < systeme.statistiques.totalOrganismes) {
    const diff = systeme.statistiques.totalOrganismes - systeme.statistiques.organismesAvecReceptionniste;
    anomalies.push(`${diff} organisme(s) sans réceptionniste`);
  }

  if (organismesPeuUtilisateurs.length > 0) {
    anomalies.push(`${organismesPeuUtilisateurs.length} organisme(s) avec peu d'utilisateurs`);
  }

  // Calcul des métriques de qualité
  const scoreCompletude = Math.round(
    ((systeme.statistiques.organismesAvecAdmin + systeme.statistiques.organismesAvecReceptionniste) /
     (systeme.statistiques.totalOrganismes * 2)) * 100
  );

  const scoreValidation = Math.round(
    ((emailsUniques ? 33 : 0) + (codesUniques ? 33 : 0) + (tousUtilisateursOntOrganisme ? 34 : 0))
  );

  const scoreCouverture = Math.round(
    (systeme.utilisateurs.length / (systeme.organismes.length * 3)) * 100
  );

  const scoreGlobal = Math.round((scoreCompletude + scoreValidation + scoreCouverture) / 3);

  // Construction du rapport
  const rapport: RapportControle = {
    "📋 RÉSUMÉ GÉNÉRAL": {
      "Total organismes": systeme.statistiques.totalOrganismes,
      "Total utilisateurs": systeme.statistiques.totalUtilisateurs,
      "Organismes avec admin": systeme.statistiques.organismesAvecAdmin,
      "Organismes avec réceptionniste": systeme.statistiques.organismesAvecReceptionniste,
      "Moyenne utilisateurs/organisme": moyenneUsersParOrganisme
    },

    "👥 RÉPARTITION PAR RÔLE": systeme.statistiques.repartitionRoles,

    "🏛️ RÉPARTITION PAR TYPE": systeme.statistiques.repartitionTypes,

    "✅ VALIDATION": {
      "Tous les organismes ont un admin": systeme.statistiques.organismesAvecAdmin === systeme.statistiques.totalOrganismes,
      "Tous les organismes ont un réceptionniste": systeme.statistiques.organismesAvecReceptionniste === systeme.statistiques.totalOrganismes,
      "Emails uniques": emailsUniques,
      "Codes organismes uniques": codesUniques,
      "Tous les utilisateurs ont un organisme valide": tousUtilisateursOntOrganisme
    },

    "📈 TOP 10 ORGANISMES PAR UTILISATEURS": top10,

    "📉 ORGANISMES AVEC PEU D'UTILISATEURS": organismesPeuUtilisateurs,

    "🎯 STATISTIQUES DÉTAILLÉES": {
      "Ministères": {
        total: ministeres.length,
        utilisateurs: utilisateursMinisteres.length,
        moyenneParMinistere: Math.round((utilisateursMinisteres.length / ministeres.length) * 100) / 100
      },
      "Directions Générales": {
        total: directionsGenerales.length,
        utilisateurs: utilisateursDirections.length,
        moyenneParDirection: Math.round((utilisateursDirections.length / directionsGenerales.length) * 100) / 100
      },
      "Établissements Publics": {
        total: etablissementsPublics.length,
        utilisateurs: utilisateursEtablissements.length,
        moyenneParEtablissement: Math.round((utilisateursEtablissements.length / etablissementsPublics.length) * 100) / 100
      }
    },

    "⚠️ ANOMALIES DÉTECTÉES": anomalies.length > 0 ? anomalies : ["Aucune anomalie détectée ✅"],

    "📊 MÉTRIQUES DE QUALITÉ": {
      scoreCompletude,
      scoreValidation,
      scoreCouverture,
      scoreGlobal
    }
  };

  return rapport;
}

// ==================== RAPPORT DÉTAILLÉ ====================

/**
 * Générer un rapport détaillé avec analyse approfondie
 */
export function genererRapportDetaille(systeme: SystemeComplet, tempsGeneration?: number): RapportDetaille {
  // Obtenir le rapport de base
  const rapportBase = genererRapportControle(systeme);

  // Analyse par organisme
  const analyseParOrganisme = systeme.organismes.map(org => {
    const utilisateursOrg = systeme.utilisateurs.filter(u => u.organisme_code === org.code);
    const rolesPresents = [...new Set(utilisateursOrg.map(u => u.role))];
    const problemes: string[] = [];

    if (utilisateursOrg.length === 0) problemes.push('Aucun utilisateur');
    if (!rolesPresents.includes('ADMIN')) problemes.push('Pas d\'administrateur');
    if (!rolesPresents.includes('RECEPTIONIST')) problemes.push('Pas de réceptionniste');
    if (utilisateursOrg.length < 2) problemes.push('Moins de 2 utilisateurs');

    return {
      code: org.code,
      nom: org.nom,
      type: org.type,
      statut: org.statut,
      nombreUtilisateurs: utilisateursOrg.length,
      rolesPresents,
      emailContact: org.email_contact,
      problemes
    };
  });

  // Analyse des utilisateurs
  const prenomsFeminins = ['Marie', 'Jeanne', 'Brigitte', 'Claire', 'Sylvie', 'Patricia', 'Nathalie'];
  const totalFemmes = systeme.utilisateurs.filter(u =>
    prenomsFeminins.some(pf => u.prenom.includes(pf))
  ).length;
  const totalHommes = systeme.utilisateurs.length - totalFemmes;

  const emails = systeme.utilisateurs.map(u => u.email);
  const emailsDupliques = emails.filter((e, i) => emails.indexOf(e) !== i);

  const utilisateursActifs = systeme.utilisateurs.filter(u => u.statut === 'ACTIF').length;
  const utilisateursInactifs = systeme.utilisateurs.length - utilisateursActifs;

  // Construire le rapport détaillé
  const rapportDetaille: RapportDetaille = {
    ...rapportBase,

    "🔍 ANALYSE PAR ORGANISME": analyseParOrganisme
      .filter(a => a.problemes.length > 0)
      .slice(0, 20), // Limiter à 20 pour la lisibilité

    "👤 ANALYSE DES UTILISATEURS": {
      totalHommes,
      totalFemmes,
      ratioHommesFemmes: `${Math.round((totalHommes / systeme.utilisateurs.length) * 100)}% / ${Math.round((totalFemmes / systeme.utilisateurs.length) * 100)}%`,
      utilisateursActifs,
      utilisateursInactifs,
      emailsDupliques: [...new Set(emailsDupliques)]
    },

    "📅 INFORMATIONS TEMPORELLES": {
      dateGeneration: new Date(),
      tempsGeneration,
      version: "2.0.0"
    }
  };

  return rapportDetaille;
}

// ==================== RAPPORT POUR EXTENSIONS ====================

/**
 * Générer un rapport incluant les extensions
 */
export async function genererRapportAvecExtensions(): Promise<RapportDetaille> {
  const systemeEtendu = await extensionsSysteme.obtenirSystemeEtendu();
  return genererRapportDetaille(systemeEtendu);
}

// ==================== EXPORT EN DIFFÉRENTS FORMATS ====================

/**
 * Exporter le rapport en format texte lisible
 */
export function exporterRapportTexte(rapport: RapportControle): string {
  let texte = '\n' + '='.repeat(60) + '\n';
  texte += '📊 RAPPORT DE CONTRÔLE DU SYSTÈME\n';
  texte += '='.repeat(60) + '\n\n';

  // Résumé général
  texte += '📋 RÉSUMÉ GÉNÉRAL\n';
  texte += '-'.repeat(40) + '\n';
  Object.entries(rapport["📋 RÉSUMÉ GÉNÉRAL"]).forEach(([key, value]) => {
    texte += `• ${key}: ${value}\n`;
  });

  // Validation
  texte += '\n✅ VALIDATION\n';
  texte += '-'.repeat(40) + '\n';
  Object.entries(rapport["✅ VALIDATION"]).forEach(([key, value]) => {
    texte += `• ${key}: ${value ? '✅ OUI' : '❌ NON'}\n`;
  });

  // Métriques de qualité
  texte += '\n📊 MÉTRIQUES DE QUALITÉ\n';
  texte += '-'.repeat(40) + '\n';
  const metriques = rapport["📊 MÉTRIQUES DE QUALITÉ"];
  texte += `• Score de complétude: ${metriques.scoreCompletude}%\n`;
  texte += `• Score de validation: ${metriques.scoreValidation}%\n`;
  texte += `• Score de couverture: ${metriques.scoreCouverture}%\n`;
  texte += `• SCORE GLOBAL: ${metriques.scoreGlobal}%\n`;

  // TOP 10
  texte += '\n📈 TOP 10 ORGANISMES PAR UTILISATEURS\n';
  texte += '-'.repeat(40) + '\n';
  rapport["📈 TOP 10 ORGANISMES PAR UTILISATEURS"].forEach((org, index) => {
    texte += `${index + 1}. ${org.nom} (${org.code})\n`;
    texte += `   • ${org.utilisateurs} utilisateurs (${org.admins} admin, ${org.users} users, ${org.receptionists} recep)\n`;
  });

  // Anomalies
  texte += '\n⚠️ ANOMALIES DÉTECTÉES\n';
  texte += '-'.repeat(40) + '\n';
  rapport["⚠️ ANOMALIES DÉTECTÉES"].forEach(anomalie => {
    texte += `• ${anomalie}\n`;
  });

  texte += '\n' + '='.repeat(60) + '\n';

  return texte;
}

/**
 * Exporter le rapport en format HTML
 */
export function exporterRapportHTML(rapport: RapportControle): string {
  let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport de Contrôle du Système</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
    h2 { color: #666; margin-top: 30px; }
    .metric { display: inline-block; margin: 10px 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #4CAF50; }
    .validation { margin: 10px 0; }
    .valid { color: green; }
    .invalid { color: red; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #4CAF50; color: white; }
    .score { font-size: 18px; font-weight: bold; }
    .good { color: green; }
    .medium { color: orange; }
    .bad { color: red; }
  </style>
</head>
<body>
  <h1>📊 Rapport de Contrôle du Système</h1>

  <h2>📋 Résumé Général</h2>
  <div>`;

  Object.entries(rapport["📋 RÉSUMÉ GÉNÉRAL"]).forEach(([key, value]) => {
    html += `
    <div class="metric">
      <div>${key}</div>
      <div class="metric-value">${value}</div>
    </div>`;
  });

  html += `
  </div>

  <h2>✅ Validation</h2>
  <div>`;

  Object.entries(rapport["✅ VALIDATION"]).forEach(([key, value]) => {
    const className = value ? 'valid' : 'invalid';
    const icon = value ? '✅' : '❌';
    html += `<div class="validation ${className}">${icon} ${key}</div>`;
  });

  html += `
  </div>

  <h2>📊 Métriques de Qualité</h2>
  <div>`;

  const metriques = rapport["📊 MÉTRIQUES DE QUALITÉ"];
  Object.entries(metriques).forEach(([key, value]) => {
    const scoreClass = value >= 80 ? 'good' : value >= 60 ? 'medium' : 'bad';
    html += `
    <div class="metric">
      <div>${key}</div>
      <div class="metric-value ${scoreClass}">${value}%</div>
    </div>`;
  });

  html += `
  </div>

  <h2>📈 TOP 10 Organismes par Utilisateurs</h2>
  <table>
    <thead>
      <tr>
        <th>Rang</th>
        <th>Organisme</th>
        <th>Code</th>
        <th>Type</th>
        <th>Utilisateurs</th>
        <th>Admins</th>
        <th>Users</th>
        <th>Réceptionnistes</th>
      </tr>
    </thead>
    <tbody>`;

  rapport["📈 TOP 10 ORGANISMES PAR UTILISATEURS"].forEach((org, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${org.nom}</td>
        <td>${org.code}</td>
        <td>${org.type}</td>
        <td><strong>${org.utilisateurs}</strong></td>
        <td>${org.admins}</td>
        <td>${org.users}</td>
        <td>${org.receptionists}</td>
      </tr>`;
  });

  html += `
    </tbody>
  </table>

  <h2>⚠️ Anomalies Détectées</h2>
  <ul>`;

  rapport["⚠️ ANOMALIES DÉTECTÉES"].forEach(anomalie => {
    html += `<li>${anomalie}</li>`;
  });

  html += `
  </ul>

  <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
    <p>Rapport généré le ${new Date().toLocaleString('fr-FR')}</p>
    <p>Système de Gestion Administrative - Gabon</p>
  </footer>
</body>
</html>`;

  return html;
}

/**
 * Exporter le rapport en format CSV
 */
export function exporterRapportCSV(rapport: RapportControle): string {
  let csv = 'Section,Métrique,Valeur\n';

  // Résumé général
  Object.entries(rapport["📋 RÉSUMÉ GÉNÉRAL"]).forEach(([key, value]) => {
    csv += `"Résumé Général","${key}","${value}"\n`;
  });

  // Validation
  Object.entries(rapport["✅ VALIDATION"]).forEach(([key, value]) => {
    csv += `"Validation","${key}","${value ? 'OUI' : 'NON'}"\n`;
  });

  // Métriques
  Object.entries(rapport["📊 MÉTRIQUES DE QUALITÉ"]).forEach(([key, value]) => {
    csv += `"Métriques de Qualité","${key}","${value}%"\n`;
  });

  // TOP 10
  csv += '\n"TOP 10 Organismes",,,,,,\n';
  csv += '"Rang","Nom","Code","Type","Utilisateurs","Admins","Users","Réceptionnistes"\n';
  rapport["📈 TOP 10 ORGANISMES PAR UTILISATEURS"].forEach((org, index) => {
    csv += `"${index + 1}","${org.nom}","${org.code}","${org.type}","${org.utilisateurs}","${org.admins}","${org.users}","${org.receptionists}"\n`;
  });

  return csv;
}

// ==================== FONCTION D'ANALYSE COMPARATIVE ====================

/**
 * Comparer deux rapports (avant/après extensions par exemple)
 */
export function comparerRapports(rapportAvant: RapportControle, rapportApres: RapportControle) {
  return {
    "📊 ÉVOLUTION": {
      "Organismes ajoutés": rapportApres["📋 RÉSUMÉ GÉNÉRAL"]["Total organismes"] - rapportAvant["📋 RÉSUMÉ GÉNÉRAL"]["Total organismes"],
      "Utilisateurs ajoutés": rapportApres["📋 RÉSUMÉ GÉNÉRAL"]["Total utilisateurs"] - rapportAvant["📋 RÉSUMÉ GÉNÉRAL"]["Total utilisateurs"],
      "Évolution score global": rapportApres["📊 MÉTRIQUES DE QUALITÉ"].scoreGlobal - rapportAvant["📊 MÉTRIQUES DE QUALITÉ"].scoreGlobal
    },
    "✅ AMÉLIORATIONS": {
      "Validation emails": !rapportAvant["✅ VALIDATION"]["Emails uniques"] && rapportApres["✅ VALIDATION"]["Emails uniques"],
      "Tous ont admin": !rapportAvant["✅ VALIDATION"]["Tous les organismes ont un admin"] && rapportApres["✅ VALIDATION"]["Tous les organismes ont un admin"],
      "Anomalies résolues": rapportAvant["⚠️ ANOMALIES DÉTECTÉES"].length - rapportApres["⚠️ ANOMALIES DÉTECTÉES"].length
    }
  };
}

// ==================== EXPORT PRINCIPAL ====================

export default {
  genererRapportControle,
  genererRapportDetaille,
  genererRapportAvecExtensions,
  exporterRapportTexte,
  exporterRapportHTML,
  exporterRapportCSV,
  comparerRapports
};
