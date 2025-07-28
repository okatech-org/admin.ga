// check-nextauth.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration NextAuth...\n');

// 1. Vérifier .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ Fichier .env.local manquant');
  console.log('📝 Création du fichier .env.local...');
  
  const envContent = `# Database
DATABASE_URL="postgresql://user:password@localhost:5432/admin_ga?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${require('crypto').randomBytes(32).toString('base64')}"
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env.local créé\n');
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (!envContent.includes('NEXTAUTH_SECRET')) {
    console.log('⚠️  NEXTAUTH_SECRET manquant dans .env.local');
    const secret = require('crypto').randomBytes(32).toString('base64');
    fs.appendFileSync(envPath, `\n# NextAuth\nNEXTAUTH_SECRET="${secret}"\n`);
    console.log('✅ NEXTAUTH_SECRET ajouté\n');
  } else {
    console.log('✅ NEXTAUTH_SECRET trouvé\n');
  }
  
  if (!envContent.includes('NEXTAUTH_URL')) {
    fs.appendFileSync(envPath, `NEXTAUTH_URL="http://localhost:3000"\n`);
    console.log('✅ NEXTAUTH_URL ajouté\n');
  }
}

// 2. Vérifier les fichiers NextAuth
const authLibPath = path.join(process.cwd(), 'lib', 'auth.ts');
const authRoutePath = path.join(process.cwd(), 'app', 'api', 'auth', '[...nextauth]', 'route.ts');

if (!fs.existsSync(authLibPath)) {
  console.log('❌ lib/auth.ts manquant');
  console.log('   Créez ce fichier avec la configuration NextAuth\n');
} else {
  console.log('✅ lib/auth.ts trouvé\n');
}

if (!fs.existsSync(authRoutePath)) {
  console.log('❌ app/api/auth/[...nextauth]/route.ts manquant');
  console.log('   Créez ce fichier pour la route API NextAuth\n');
} else {
  console.log('✅ Route API NextAuth trouvée\n');
}

console.log('📋 Prochaines étapes :');
console.log('1. Vérifiez que toutes les dépendances sont installées');
console.log('2. Exécutez : npx prisma generate');
console.log('3. Redémarrez le serveur : npm run dev');