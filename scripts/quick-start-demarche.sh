#!/bin/bash

# 🚀 Script de démarrage rapide pour DEMARCHE.GA

set -e

echo "🌱 Démarrage de DEMARCHE.GA..."

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérification de la version Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérification de la variable DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Variable DATABASE_URL non définie"
    echo "💡 Assurez-vous de configurer votre base de données PostgreSQL"
    echo "   Exemple: export DATABASE_URL='postgresql://user:password@localhost:5432/demarche_ga'"
    read -p "   Continuer quand même ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Génération du client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Synchronisation de la base de données
echo "🗄️  Synchronisation de la base de données..."
npx prisma db push --accept-data-loss

# Exécution du seed
echo "🌱 Peuplement de la base de données avec les données de test..."
npx tsx scripts/seed-demarche-ga.ts

echo ""
echo "🎉 DEMARCHE.GA est prêt !"
echo ""
echo "📋 Comptes de test disponibles (mot de passe: Test123!):"
echo "   Citoyen:     citoyen1@exemple.com"
echo "   Agent DGDI:  agent1@dgdi.ga"
echo "   Admin DGDI:  admin@dgdi.ga"
echo "   Super Admin: admin@demarche.ga"
echo ""
echo "🌐 URLs importantes:"
echo "   Page d'accueil: http://localhost:3000/demarche"
echo "   Connexion:      http://localhost:3000/demarche/auth/connexion"
echo ""
echo "🚀 Démarrez le serveur avec: npm run dev"
echo "🔍 Interface base de données: npx prisma studio"
echo ""
