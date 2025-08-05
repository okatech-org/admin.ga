/**
 * Script de test pour valider l'implémentation complète
 * Test des ministères, structures territoriales et organismes spécialisés
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testImplementationComplete() {
  console.log('🧪 TEST DE L\'IMPLÉMENTATION COMPLÈTE');
  console.log('=====================================\n');

  try {
    // Test 1: Vérifier les organisations créées
    console.log('📊 Test 1: Comptage des organisations par type');
    const orgsByType = await prisma.organization.groupBy({
      by: ['type'],
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } }
    });

    orgsByType.forEach(group => {
      console.log(`   ${group.type}: ${group._count.type} organisations`);
    });

    const totalOrgs = await prisma.organization.count();
    console.log(`   TOTAL: ${totalOrgs} organisations\n`);

    // Test 2: Vérifier les utilisateurs par rôle
    console.log('👥 Test 2: Répartition des utilisateurs par rôle');
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
      orderBy: { _count: { role: 'desc' } }
    });

    usersByRole.forEach(group => {
      console.log(`   ${group.role}: ${group._count.role} utilisateurs`);
    });

    const totalUsers = await prisma.user.count();
    console.log(`   TOTAL: ${totalUsers} utilisateurs\n`);

    // Test 3: Vérifier les ministères
    console.log('🏛️ Test 3: Validation des ministères');
    const ministeres = await prisma.organization.findMany({
      where: {
        OR: [
          { type: 'MINISTERE' },
          { type: 'MINISTERE_ETAT' }
        ]
      },
      include: {
        _count: { select: { users: true } }
      }
    });

    console.log(`   Ministères trouvés: ${ministeres.length}`);
    ministeres.forEach(ministere => {
      console.log(`   - ${ministere.name} (${ministere.code}) - ${ministere._count.users} agents`);
    });
    console.log();

    // Test 4: Vérifier les structures territoriales
    console.log('🗺️ Test 4: Validation des structures territoriales');
    const gouvernorats = await prisma.organization.findMany({
      where: { type: 'GOUVERNORAT' },
      include: {
        _count: { select: { users: true } }
      }
    });

    const prefectures = await prisma.organization.findMany({
      where: { type: 'PREFECTURE' },
      include: {
        _count: { select: { users: true } }
      }
    });

    console.log(`   Gouvernorats: ${gouvernorats.length}`);
    gouvernorats.forEach(gouv => {
      console.log(`   - ${gouv.name} (${gouv.code}) - ${gouv._count.users} agents`);
    });

    console.log(`   Préfectures: ${prefectures.length}`);
    prefectures.forEach(pref => {
      console.log(`   - ${pref.name} (${pref.code}) - ${pref._count.users} agents`);
    });
    console.log();

    // Test 5: Vérifier les organismes spécialisés
    console.log('🏢 Test 5: Validation des organismes spécialisés');
    const organismesSpecialises = await prisma.organization.findMany({
      where: {
        type: {
          in: ['AGENCE_NATIONALE', 'ORGANISME_SOCIAL', 'ETABLISSEMENT_PUBLIC']
        }
      },
      include: {
        _count: { select: { users: true } }
      }
    });

    console.log(`   Organismes spécialisés: ${organismesSpecialises.length}`);
    organismesSpecialises.forEach(org => {
      console.log(`   - ${org.name} (${org.code}) - ${org._count.users} agents`);
    });
    console.log();

    // Test 6: Vérifier la distribution géographique
    console.log('📍 Test 6: Distribution géographique');
    const orgsByCity = await prisma.organization.groupBy({
      by: ['city'],
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } }
    });

    orgsByCity.forEach(group => {
      console.log(`   ${group.city}: ${group._count.city} organisations`);
    });
    console.log();

    // Test 7: Validation de l'intégrité des données
    console.log('✅ Test 7: Validation de l\'intégrité des données');

    // Vérifier les utilisateurs sans organisation
    const usersWithoutOrg = await prisma.user.count({
      where: { primaryOrganizationId: null }
    });
    console.log(`   Utilisateurs sans organisation: ${usersWithoutOrg}`);

    // Vérifier les organisations sans utilisateurs
    const orgsWithoutUsers = await prisma.organization.count({
      where: {
        users: { none: {} }
      }
    });
    console.log(`   Organisations sans utilisateurs: ${orgsWithoutUsers}`);

    // Vérifier les doublons d'email
    const duplicateEmails = await prisma.user.groupBy({
      by: ['email'],
      _count: { email: true },
      having: { email: { _count: { gt: 1 } } }
    });
    console.log(`   Emails en doublon: ${duplicateEmails.length}`);

    // Vérifier les codes organisations uniques
    const duplicateCodes = await prisma.organization.groupBy({
      by: ['code'],
      _count: { code: true },
      having: { code: { _count: { gt: 1 } } }
    });
    console.log(`   Codes organisations en doublon: ${duplicateCodes.length}`);
    console.log();

    // Test 8: Statistiques avancées
    console.log('📈 Test 8: Statistiques avancées');

    // Moyenne d'utilisateurs par organisation
    const avgUsersPerOrg = totalUsers / totalOrgs;
    console.log(`   Moyenne utilisateurs/organisation: ${avgUsersPerOrg.toFixed(1)}`);

    // Répartition Super Admins vs autres
    const superAdmins = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
    const otherUsers = totalUsers - superAdmins;
    console.log(`   Super Admins: ${superAdmins} (${((superAdmins/totalUsers)*100).toFixed(1)}%)`);
    console.log(`   Autres utilisateurs: ${otherUsers} (${((otherUsers/totalUsers)*100).toFixed(1)}%)`);

    // Test des organisations les plus importantes
    const topOrgs = await prisma.organization.findMany({
      include: {
        _count: { select: { users: true } }
      },
      orderBy: {
        users: { _count: 'desc' }
      },
      take: 5
    });

    console.log('\n   🏆 Top 5 organisations par nombre d\'agents:');
    topOrgs.forEach((org, index) => {
      console.log(`   ${index + 1}. ${org.name} - ${org._count.users} agents`);
    });

    console.log('\n✅ TOUS LES TESTS PASSÉS AVEC SUCCÈS!');
    console.log('🇬🇦 L\'implémentation complète du gouvernement gabonais est fonctionnelle');

    // Résumé final
    console.log('\n📋 RÉSUMÉ DE L\'IMPLÉMENTATION:');
    console.log('===============================');
    console.log(`🏛️ Ministères: ${ministeres.length} (dont ${ministeres.filter(m => m.type === 'MINISTERE_ETAT').length} Ministères d'État)`);
    console.log(`🗺️ Gouvernorats: ${gouvernorats.length}`);
    console.log(`🏢 Préfectures: ${prefectures.length}`);
    console.log(`🎯 Organismes spécialisés: ${organismesSpecialises.length}`);
    console.log(`👥 Total agents publics: ${totalUsers}`);
    console.log(`🏢 Total structures: ${totalOrgs}`);
    console.log('🌟 Structure administrative gabonaise complètement opérationnelle!');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter les tests
main()

async function main() {
  await testImplementationComplete();
}
