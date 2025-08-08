#!/usr/bin/env node

/**
 * Script d'initialisation de la base de données gabonaise
 * Exécute le seed pour créer les organismes et utilisateurs de démonstration
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🇬🇦 INITIALISATION DE LA BASE DE DONNÉES GABONAISE');
console.log('==================================================');

try {
  // Changer vers le répertoire racine du projet
  process.chdir(path.resolve(__dirname, '..'));

  console.log('📦 Installation des dépendances Prisma...');
  execSync('npm install @prisma/client prisma', { stdio: 'inherit' });

  console.log('🔄 Génération du client Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('🗃️ Application des migrations de la base de données...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  console.log('🌱 Exécution du seed (initialisation des données)...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('');
  console.log('🎉 INITIALISATION TERMINÉE AVEC SUCCÈS !');
  console.log('=========================================');
  console.log('');
  console.log('✅ Base de données prête avec :');
  console.log('   • Organismes gabonais (Ministères, Directions, Mairies...)');
  console.log('   • Utilisateurs de démonstration (Super Admin, Admins, Managers, Agents, Citoyens)');
  console.log('   • Relations organisme-utilisateur configurées');
  console.log('');
  console.log('🚀 Vous pouvez maintenant démarrer l\'application :');
  console.log('   npm run dev');
  console.log('');

} catch (error) {
  console.error('❌ ERREUR lors de l\'initialisation :', error.message);
  console.log('');
  console.log('🔧 Solutions possibles :');
  console.log('   1. Vérifiez que votre base de données PostgreSQL est accessible');
  console.log('   2. Vérifiez la variable DATABASE_URL dans votre fichier .env');
  console.log('   3. Assurez-vous que la base de données existe');
  console.log('');
  process.exit(1);
}
