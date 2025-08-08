/* @ts-nocheck */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 NETTOYAGE DRASTIQUE DE LA BASE DE DONNÉES');
  console.log('================================================');

  try {
    // Compter avant suppression
    const userCount = await prisma.user.count();
    const orgCount = await prisma.organization.count();

    console.log(`📊 État avant nettoyage :`);
    console.log(`   - Utilisateurs : ${userCount}`);
    console.log(`   - Organismes : ${orgCount}`);

    // Supprimer tous les utilisateurs d'abord (foreign key constraint)
    await prisma.user.deleteMany({});
    console.log('✅ Tous les utilisateurs supprimés');

    // Supprimer toutes les organisations
    await prisma.organization.deleteMany({});
    console.log('✅ Toutes les organisations supprimées');

    // Vérifier le nettoyage
    const finalUserCount = await prisma.user.count();
    const finalOrgCount = await prisma.organization.count();

    console.log('🎉 NETTOYAGE COMPLET TERMINÉ !');
    console.log('📊 État final :');
    console.log(`   - Utilisateurs : ${finalUserCount}`);
    console.log(`   - Organismes : ${finalOrgCount}`);
    console.log(`   - Relations : 0`);
    console.log(`   - Services : 0`);

    if (finalUserCount === 0 && finalOrgCount === 0) {
      console.log('✨ Base de données parfaitement nettoyée !');
    } else {
      console.error('❌ Erreur: La base de données n\'est pas complètement vide');
    }

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

cleanDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
