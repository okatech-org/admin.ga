#!/bin/bash

# Script de démarrage pour la gestion des domaines ADMINISTRATION.GA
# Usage: ./scripts/start-domain-management.sh

set -e

echo "🚀 Démarrage du système de gestion des domaines ADMINISTRATION.GA"
echo "================================================================="

# Vérification des dépendances
echo "📋 Vérification des dépendances..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# NPM/Yarn
if ! command -v npm &> /dev/null; then
    echo "❌ NPM n'est pas installé"
    exit 1
fi

# Prisma
if ! command -v npx &> /dev/null; then
    echo "❌ NPX n'est pas installé"
    exit 1
fi

echo "✅ Dépendances vérifiées"

# Vérification de la configuration
echo "🔧 Vérification de la configuration..."

if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env manquant. Création à partir de .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "📝 Fichier .env créé. Veuillez le configurer avec vos paramètres."
        echo "   Variables importantes à configurer :"
        echo "   - NETIM_API_KEY"
        echo "   - NETIM_API_SECRET"
        echo "   - SERVER_IP"
        echo "   - DATABASE_URL"
        echo ""
        read -p "Appuyez sur Entrée après avoir configuré le fichier .env..."
    else
        echo "❌ Fichier .env.example manquant"
        exit 1
    fi
fi

# Vérifier les variables critiques
echo "🔍 Vérification des variables d'environnement..."

source .env

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL non configurée"
    exit 1
fi

if [ -z "$NETIM_API_KEY" ]; then
    echo "⚠️  NETIM_API_KEY non configurée (optionnel pour les tests)"
fi

if [ -z "$SERVER_IP" ]; then
    echo "⚠️  SERVER_IP non configurée"
fi

echo "✅ Configuration vérifiée"

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Génération Prisma
echo "🗄️  Génération du client Prisma..."
npx prisma generate

# Base de données
echo "🗃️  Configuration de la base de données..."

# Vérifier si la base existe
if npx prisma db push --preview-feature --accept-data-loss 2>/dev/null; then
    echo "✅ Base de données configurée"
else
    echo "⚠️  Erreur de base de données. Vérifiez DATABASE_URL"
fi

# Build de l'application
echo "🏗️  Build de l'application..."
npm run build

echo ""
echo "🎉 Configuration terminée avec succès !"
echo ""
echo "📍 Prochaines étapes :"
echo "   1. Démarrez l'application : npm run dev"
echo "   2. Accédez à : http://localhost:3000/admin-web"
echo "   3. Naviguez vers l'onglet 'Domaines'"
echo "   4. Configurez vos domaines Netim.com"
echo ""
echo "📚 Documentation complète : docs/DOMAIN_MANAGEMENT_GUIDE.md"
echo ""
echo "🔧 Configuration automatisée d'un domaine :"
echo "   npx ts-node scripts/setup-netim-domain.ts --domain=example.ga --ip=192.168.1.100 --app=administration"
echo ""

# Proposer de démarrer immédiatement
read -p "🚀 Voulez-vous démarrer l'application maintenant ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌟 Démarrage de l'application..."
    npm run dev
else
    echo "👋 Application prête ! Utilisez 'npm run dev' pour démarrer."
fi
