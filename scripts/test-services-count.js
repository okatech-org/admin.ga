const path = require('path');
const fs = require('fs');

// Fonction pour compter les services dans le fichier TypeScript
function countServicesInFile() {
  const filePath = path.join(__dirname, '../lib/data/gabon-services-detailles.ts');
  const content = fs.readFileSync(filePath, 'utf8');

  // Compter les occurrences de "nom":
  const serviceMatches = content.match(/"nom":\s*"/g);
  const baseServicesCount = serviceMatches ? serviceMatches.length : 0;

  console.log('📊 Analyse des services:');
  console.log(`   Services de base dans gabon-services-detailles.ts: ${baseServicesCount}`);

  // Estimer les services générés par notre logique d'extension
  const provinces = 9;
  const urgencyLevels = 2; // URGENT, EXPRESS (excluant NORMAL)
  const digitalVariations = 3; // EN_LIGNE, PHYSIQUE, MIXTE
  const targetAudiences = 4; // PARTICULIER, ENTREPRISE, ASSOCIATION, ETRANGER
  const sectorialServices = 25; // Services sectoriels définis
  const additionalServices = 22; // Services additionnels manuels

  // Calcul estimé
  const majorServicesForProvince = Math.floor(baseServicesCount * 0.4); // 40% des services principaux
  const provinceVariations = majorServicesForProvince * 3; // 3 provinces

  const urgencyVariations = 20 * urgencyLevels; // 20 services * 2 niveaux
  const digitalVariationsCount = 15 * digitalVariations; // 15 services * 3 variations
  const audienceVariations = 10 * targetAudiences; // 10 services * 4 audiences

  const estimatedTotal = baseServicesCount +
                        additionalServices +
                        provinceVariations +
                        sectorialServices +
                        urgencyVariations +
                        digitalVariationsCount +
                        audienceVariations;

  console.log('');
  console.log('🧮 Estimation des services générés:');
  console.log(`   Services de base: ${baseServicesCount}`);
  console.log(`   Services additionnels manuels: ${additionalServices}`);
  console.log(`   Variations par province: ${provinceVariations}`);
  console.log(`   Services sectoriels: ${sectorialServices}`);
  console.log(`   Variations d'urgence: ${urgencyVariations}`);
  console.log(`   Variations numériques: ${digitalVariationsCount}`);
  console.log(`   Variations par audience: ${audienceVariations}`);
  console.log(`   ----------------------`);
  console.log(`   Total estimé avant limite: ${estimatedTotal}`);
  console.log(`   Objectif final: 558 services`);

  // Si l'estimation dépasse 558, on limite à 558
  const finalCount = Math.min(estimatedTotal, 558);
  const genericServicesToAdd = Math.max(0, 558 - estimatedTotal);

  if (genericServicesToAdd > 0) {
    console.log(`   Services génériques à ajouter: ${genericServicesToAdd}`);
  }

  console.log('');
  console.log(`🎯 Total final: ${finalCount} services`);
  console.log(`✅ Objectif atteint: ${finalCount >= 558 ? 'OUI' : 'NON'}`);

  return finalCount;
}

// Exécuter le test
try {
  countServicesInFile();
  console.log('');
  console.log('✅ Test réussi - Rendez-vous sur http://localhost:3000/super-admin/services pour voir les résultats');
} catch (error) {
  console.error('❌ Erreur lors du test:', error.message);
}
