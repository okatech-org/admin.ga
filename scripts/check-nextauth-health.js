#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🏥 Diagnostic NextAuth - Vérification complète\n');

// 1. Vérifier les variables d'environnement
console.log('📋 Vérification des variables d\'environnement...');

const envFiles = ['.env.local', '.env'];
let envFound = false;
let envVars = {};

for (const envFile of envFiles) {
  const envPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    console.log(`✅ Fichier ${envFile} trouvé`);
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse les variables
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/["']/g, '');
      }
    });
    
    envFound = true;
    break;
  }
}

if (!envFound) {
  console.log('❌ Aucun fichier d\'environnement trouvé');
  console.log('📝 Création de .env.local...');
  
  const envContent = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${require('crypto').randomBytes(32).toString('base64')}

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/admin_ga"
`;
  
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Fichier .env.local créé avec des valeurs par défaut\n');
} else {
  // Vérifier les variables requises
  const requiredVars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'DATABASE_URL'];
  
  requiredVars.forEach(varName => {
    if (envVars[varName]) {
      if (varName === 'NEXTAUTH_SECRET') {
        const length = envVars[varName].length;
        if (length >= 32) {
          console.log(`✅ ${varName} présent et valide (${length} caractères)`);
        } else {
          console.log(`⚠️  ${varName} trop court (${length} caractères, minimum 32)`);
        }
      } else {
        console.log(`✅ ${varName} présent`);
      }
    } else {
      console.log(`❌ ${varName} manquant`);
    }
  });
}

console.log();

// 2. Vérifier les fichiers NextAuth
console.log('📁 Vérification des fichiers NextAuth...');

const files = [
  { path: 'lib/auth.ts', name: 'Configuration NextAuth' },
  { path: 'app/api/auth/[...nextauth]/route.ts', name: 'Route API NextAuth' },
  { path: 'app/api/auth/health/route.ts', name: 'Health Check' },
  { path: 'types/next-auth.d.ts', name: 'Types NextAuth' },
  { path: 'middleware.ts', name: 'Middleware' },
];

files.forEach(file => {
  if (fs.existsSync(file.path)) {
    console.log(`✅ ${file.name} présent`);
  } else {
    console.log(`❌ ${file.name} manquant (${file.path})`);
  }
});

console.log();

// 3. Vérifier les dépendances
console.log('📦 Vérification des dépendances...');

if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    'next-auth',
    '@auth/prisma-adapter',
    'bcryptjs',
    '@types/bcryptjs',
    '@prisma/client',
  ];
  
  requiredDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`✅ ${dep} installé (${deps[dep]})`);
    } else {
      console.log(`❌ ${dep} manquant`);
    }
  });
} else {
  console.log('❌ package.json non trouvé');
}

console.log();

// 4. Instructions de correction
console.log('🔧 Étapes de correction recommandées :');
console.log('1. Vérifiez les variables d\'environnement ci-dessus');
console.log('2. Installez les dépendances manquantes : npm install');
console.log('3. Générez le client Prisma : npx prisma generate');
console.log('4. Nettoyez le cache : rm -rf .next');
console.log('5. Redémarrez le serveur : npm run dev');
console.log('6. Testez l\'endpoint santé : curl http://localhost:3000/api/auth/health');

console.log('\n🎯 Une fois le serveur démarré, vérifiez :');
console.log('- http://localhost:3000/api/auth/providers');
console.log('- http://localhost:3000/api/auth/session');
console.log('- http://localhost:3000/api/auth/health');