/* @ts-nocheck */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Base de données complètement vidée - aucune organisation ni utilisateur
const baseOrganizations: any[] = [];
const baseUsers: any[] = [];

async function seedOrganizations() {
  console.log('🏢 Nettoyage des organisations...');

  // Supprimer tous les utilisateurs existants d'abord (à cause de la foreign key)
  await prisma.user.deleteMany({});
  console.log('👤 Tous les utilisateurs supprimés');

  // Supprimer toutes les organisations existantes
  await prisma.organization.deleteMany({});
  console.log('🏢 Toutes les organisations supprimées');

  console.log('✅ Base de données complètement vidée - 0 organismes, 0 utilisateurs');
}

async function seedUsers() {
  console.log('👤 Aucun utilisateur à créer...');
  console.log('✅ Base d\'utilisateurs vide maintenue');
}

async function main() {
  console.log('🧹 NETTOYAGE DRASTIQUE DE LA BASE DE DONNÉES');
  console.log('================================================');

  try {
    await seedOrganizations();
    await seedUsers();

    console.log('🎉 NETTOYAGE COMPLET TERMINÉ !');
    console.log('📊 État final :');
    console.log('   - Organismes : 0');
    console.log('   - Utilisateurs : 0');
    console.log('   - Relations : 0');
    console.log('   - Services : 0');

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
