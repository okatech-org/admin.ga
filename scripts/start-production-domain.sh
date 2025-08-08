#!/bin/bash

# 🌐 Démarrage Production - administration.ga avec Domaine

echo "🚀 DÉMARRAGE PRODUCTION ADMINISTRATION.GA"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
DOMAIN="administration.ga"
LOCAL_IP="185.26.106.234"
PORT="3000"

echo -e "${BLUE}🔧 Configuration Détectée${NC}"
echo "========================="
echo "• Domaine: $DOMAIN"
echo "• IP Publique: $LOCAL_IP"
echo "• Port: $PORT"
echo "• Mode: Production avec domaine"
echo ""

# Vérification prérequis
echo -e "${YELLOW}📋 Vérification des Prérequis${NC}"
echo "==============================="

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js non installé${NC}"
    exit 1
fi

# Vérifier npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm non installé${NC}"
    exit 1
fi

# Vérifier les dépendances
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json trouvé${NC}"
else
    echo -e "${RED}❌ package.json manquant${NC}"
    exit 1
fi

echo ""

# Installation/Mise à jour des dépendances
echo -e "${YELLOW}📦 Installation des Dépendances${NC}"
echo "================================="
npm install --production=false
echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

# Build de production
echo -e "${YELLOW}🔨 Build de Production${NC}"
echo "======================"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build réussi${NC}"
else
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi
echo ""

# Configuration des variables d'environnement
echo -e "${YELLOW}⚙️ Configuration Environnement${NC}"
echo "==============================="

# Créer/Mettre à jour .env.local pour production
cat > .env.local << EOF
# Configuration Production administration.ga
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://$DOMAIN
HOSTNAME=0.0.0.0
PORT=$PORT

# Configuration du domaine
NEXT_PUBLIC_DOMAIN=$DOMAIN
NEXT_PUBLIC_IP=$LOCAL_IP

# Configuration de base de données (à adapter selon vos besoins)
DATABASE_URL="postgresql://username:password@localhost:5432/administration_ga"

# Clés API (remplacez par vos vraies clés)
NEXTAUTH_SECRET="your-nextauth-secret-key-for-production"
NEXTAUTH_URL=https://$DOMAIN

# Configuration Netim (si vous avez les clés API)
NETIM_API_KEY=""
NETIM_API_SECRET=""
NETIM_BASE_URL="https://rest.netim.com/3.0"

# Configuration SSL/HTTPS
SSL_ENABLED=true
FORCE_HTTPS=true
EOF

echo -e "${GREEN}✅ Variables d'environnement configurées${NC}"
echo ""

# Vérification des ports
echo -e "${YELLOW}🔌 Vérification des Ports${NC}"
echo "=========================="

# Vérifier si le port est libre
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Port $PORT déjà utilisé${NC}"
    echo "Arrêt du processus existant..."
    pkill -f "next.*$PORT" || true
    sleep 2
fi

echo -e "${GREEN}✅ Port $PORT disponible${NC}"
echo ""

# Messages d'information
echo -e "${BLUE}📋 Instructions DNS Netim${NC}"
echo "=========================="
echo "Configurez ces enregistrements chez Netim.com :"
echo ""
echo "Type: A"
echo "Nom: @"
echo "Valeur: $LOCAL_IP"
echo "TTL: 3600"
echo ""
echo "Type: A"
echo "Nom: www"
echo "Valeur: $LOCAL_IP"
echo "TTL: 3600"
echo ""

# Configuration du pare-feu (suggestions)
echo -e "${YELLOW}🛡️  Configuration Pare-feu (Important)${NC}"
echo "====================================="
echo "Ouvrez ces ports sur votre machine :"
echo "• Port 80 (HTTP)"
echo "• Port 443 (HTTPS)"
echo "• Port $PORT (Application)"
echo ""
echo "Commandes suggestions (macOS) :"
echo "sudo pfctl -f /etc/pf.conf"
echo ""

# Démarrage du serveur
echo -e "${GREEN}🚀 Démarrage du Serveur Production${NC}"
echo "=================================="
echo "Serveur démarré sur :"
echo "• Local: http://localhost:$PORT"
echo "• Réseau: http://$LOCAL_IP:$PORT"
echo "• Domaine: http://$DOMAIN:$PORT (une fois DNS propagé)"
echo ""

# Configuration pour écouter sur toutes les interfaces
export HOSTNAME=0.0.0.0
export PORT=$PORT

# Démarrage avec gestion des erreurs
echo -e "${BLUE}🎯 Lancement de l'application...${NC}"
echo ""

# Démarrer le serveur en mode production
npm start -- --hostname 0.0.0.0 --port $PORT &
SERVER_PID=$!

# Attendre que le serveur démarre
sleep 5

# Vérifier si le serveur fonctionne
if curl -s -f http://localhost:$PORT >/dev/null; then
    echo -e "${GREEN}✅ Serveur démarré avec succès !${NC}"
    echo ""
    echo -e "${BLUE}🌐 URLs d'Accès${NC}"
    echo "==============="
    echo "• Application: http://localhost:$PORT"
    echo "• Configuration: http://localhost:$PORT/admin-web/config/administration.ga"
    echo "• API Test: http://localhost:$PORT/api/domain-management/dns?domain=$DOMAIN"
    echo ""
    echo -e "${YELLOW}⏳ En attente de propagation DNS...${NC}"
    echo "Une fois configuré chez Netim, votre site sera accessible à :"
    echo "• http://$DOMAIN:$PORT"
    echo "• https://$DOMAIN (avec SSL automatique)"
    echo ""
    echo -e "${GREEN}🎉 Serveur prêt pour production !${NC}"
    echo ""
    echo "Appuyez sur Ctrl+C pour arrêter le serveur"

    # Garder le script actif
    wait $SERVER_PID
else
    echo -e "${RED}❌ Erreur lors du démarrage du serveur${NC}"
    exit 1
fi
