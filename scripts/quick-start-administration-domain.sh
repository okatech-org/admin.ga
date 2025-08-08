#!/bin/bash

# Script de démarrage rapide pour la configuration du domaine ADMINISTRATION.GA
# Usage: ./scripts/quick-start-administration-domain.sh

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Fonction pour vérifier si une commande existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Affichage du titre
log $BLUE "🇬🇦 Configuration du Domaine ADMINISTRATION.GA"
log $BLUE "================================================"

# Vérifications des prérequis
log $YELLOW "\n📋 Vérification des prérequis..."

# Vérifier Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    log $GREEN "✅ Node.js installé: $NODE_VERSION"
else
    log $RED "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    log $GREEN "✅ npm installé: $NPM_VERSION"
else
    log $RED "❌ npm n'est pas installé"
    exit 1
fi

# Vérifier si on est dans le bon répertoire
if [ -f "package.json" ] && grep -q "next" package.json; then
    log $GREEN "✅ Répertoire du projet Next.js détecté"
else
    log $RED "❌ Ce script doit être exécuté depuis la racine du projet Next.js"
    exit 1
fi

# Vérifier le fichier .env
if [ -f ".env" ] || [ -f ".env.local" ]; then
    log $GREEN "✅ Fichier de configuration environnement trouvé"
else
    log $YELLOW "⚠️  Aucun fichier .env trouvé, création d'un fichier exemple..."

    cat > .env.local << EOF
# Configuration Netim API (optionnel)
NETIM_API_KEY="votre-clé-api-netim"
NETIM_API_SECRET="votre-secret-api-netim"
NETIM_API_URL="https://api.netim.com/v1"

# Configuration Serveur
SERVER_IP="192.168.1.100"
SSH_USERNAME="root"
SSH_KEY_PATH="/chemin/vers/votre/clé/ssh"

# Base de données (si nécessaire)
DATABASE_URL="postgresql://username:password@localhost:5432/administration_ga"
EOF

    log $GREEN "✅ Fichier .env.local créé avec des exemples"
    log $YELLOW "   🔧 Modifiez .env.local avec vos vraies valeurs"
fi

# Installation des dépendances
log $YELLOW "\n📦 Installation des dépendances..."
if npm install; then
    log $GREEN "✅ Dépendances installées avec succès"
else
    log $RED "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Génération Prisma (si applicable)
if [ -f "prisma/schema.prisma" ]; then
    log $YELLOW "\n🗄️  Configuration de la base de données..."
    if npm run db:generate 2>/dev/null || npx prisma generate; then
        log $GREEN "✅ Schéma Prisma généré"
    else
        log $YELLOW "⚠️  Impossible de générer le schéma Prisma (normal si pas configuré)"
    fi
fi

# Test des APIs
log $YELLOW "\n🧪 Test des APIs..."
if node scripts/test-administration-domain.js; then
    log $GREEN "✅ Tests des APIs réussis"
else
    log $YELLOW "⚠️  Certains tests API ont échoué (normal en développement)"
fi

# Démarrage du serveur de développement
log $YELLOW "\n🚀 Démarrage du serveur de développement..."
log $BLUE "   📍 URL: http://localhost:3000"
log $BLUE "   📍 Configuration: http://localhost:3000/admin-web/config/administration.ga"
log $BLUE "   📍 Onglet Domaines: Cliquez sur 'Domaines' dans l'interface"

log $GREEN "\n✨ Démarrage en cours..."
log $YELLOW "   📝 Instructions:"
log $YELLOW "   1. Ouvrez http://localhost:3000/admin-web/config/administration.ga"
log $YELLOW "   2. Cliquez sur l'onglet 'Domaines'"
log $YELLOW "   3. Entrez l'IP de votre serveur"
log $YELLOW "   4. Cliquez sur 'Démarrer la Configuration'"
log $YELLOW "   5. Configurez vos DNS chez Netim.com selon les instructions"

log $BLUE "\n🎯 Prêt pour la configuration du domaine !"
log $BLUE "   Appuyez sur Ctrl+C pour arrêter le serveur"

# Démarrage du serveur
npm run dev
