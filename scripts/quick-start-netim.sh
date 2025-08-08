#!/bin/bash

# 🚀 Démarrage Rapide - administration.ga (Configuration Netim Réelle)

echo "🇬🇦 DÉMARRAGE RAPIDE ADMINISTRATION.GA"
echo "======================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration réelle
DOMAIN="administration.ga"
REAL_IP="185.26.106.234"

echo -e "${PURPLE}🎯 Configuration Détectée${NC}"
echo "========================="
echo "• Domaine: $DOMAIN"
echo "• IP réelle: $REAL_IP (Netim)"
echo "• Application: Next.js"
echo ""

# Vérification prérequis
check_prerequisites() {
    echo -e "${YELLOW}🔍 Vérification Prérequis${NC}"
    echo "========================="

    # Node.js
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        echo -e "${GREEN}✅ Node.js: $node_version${NC}"
    else
        echo -e "${RED}❌ Node.js non installé${NC}"
        echo "Installez Node.js 18+ : https://nodejs.org"
        return 1
    fi

    # npm
    if command -v npm &> /dev/null; then
        npm_version=$(npm --version)
        echo -e "${GREEN}✅ npm: $npm_version${NC}"
    else
        echo -e "${RED}❌ npm non disponible${NC}"
        return 1
    fi

    # Package.json
    if [ -f "package.json" ]; then
        echo -e "${GREEN}✅ Projet Next.js détecté${NC}"
    else
        echo -e "${RED}❌ package.json non trouvé${NC}"
        echo "Exécutez ce script depuis le répertoire du projet"
        return 1
    fi

    return 0
}

# Test connexion domaine
test_domain_connection() {
    echo -e "${YELLOW}🧪 Test Connexion Domaine${NC}"
    echo "=========================="

    echo "Test DNS $DOMAIN..."
    resolved_ip=$(nslookup $DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')

    if [ "$resolved_ip" = "$REAL_IP" ]; then
        echo -e "${GREEN}✅ DNS OK: $DOMAIN → $REAL_IP${NC}"

        echo "Test ping serveur..."
        if ping -c 1 $REAL_IP > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Serveur accessible${NC}"
            return 0
        else
            echo -e "${RED}❌ Serveur non accessible${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Problème DNS${NC}"
        echo "Résolu: ${resolved_ip:-'Non résolu'}"
        echo "Attendu: $REAL_IP"
        return 1
    fi
}

# Installation dépendances
install_dependencies() {
    echo -e "${YELLOW}📦 Installation Dépendances${NC}"
    echo "============================="

    if [ -f "package-lock.json" ]; then
        echo "Installation avec npm..."
        npm install
    elif [ -f "yarn.lock" ]; then
        echo "Installation avec yarn..."
        yarn install
    elif [ -f "pnpm-lock.yaml" ]; then
        echo "Installation avec pnpm..."
        pnpm install
    else
        echo "Installation avec npm par défaut..."
        npm install
    fi

    return $?
}

# Build application
build_application() {
    echo -e "${YELLOW}🏗️  Build Application${NC}"
    echo "===================="

    echo "Construction de l'application Next.js..."
    npm run build

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build réussi${NC}"
        return 0
    else
        echo -e "${RED}❌ Erreur lors du build${NC}"
        return 1
    fi
}

# Démarrage application
start_application() {
    echo -e "${YELLOW}🚀 Démarrage Application${NC}"
    echo "========================"

    echo "Démarrage en mode production..."
    echo ""
    echo -e "${GREEN}🌟 Application sera accessible sur :${NC}"
    echo "• http://$REAL_IP:3000 (IP directe)"
    echo "• http://$DOMAIN:3000 (domaine avec port)"
    echo "• http://$DOMAIN (si Nginx configuré)"
    echo ""
    echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
    echo ""

    npm start
}

# Configuration Nginx rapide
setup_nginx() {
    echo -e "${YELLOW}🔧 Configuration Nginx Rapide${NC}"
    echo "=============================="

    # Vérifier si Nginx est installé
    if ! command -v nginx &> /dev/null; then
        echo -e "${RED}❌ Nginx non installé${NC}"
        echo "Installez Nginx :"
        echo "Ubuntu/Debian: sudo apt install nginx"
        echo "CentOS/RHEL: sudo yum install nginx"
        return 1
    fi

    # Créer configuration
    local config_file="/tmp/administration-ga-nginx.conf"
    cat > "$config_file" << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    echo -e "${GREEN}✅ Configuration Nginx créée: $config_file${NC}"
    echo ""
    echo "Pour appliquer :"
    echo "1. sudo cp $config_file /etc/nginx/sites-available/$DOMAIN"
    echo "2. sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/"
    echo "3. sudo nginx -t"
    echo "4. sudo systemctl reload nginx"
    echo ""

    read -p "Appliquer automatiquement ? (y/n): " apply_nginx

    if [ "$apply_nginx" = "y" ]; then
        echo "Application de la configuration..."
        sudo cp "$config_file" "/etc/nginx/sites-available/$DOMAIN" && \
        sudo ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/" && \
        sudo nginx -t && \
        sudo systemctl reload nginx

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Nginx configuré avec succès${NC}"
        else
            echo -e "${RED}❌ Erreur configuration Nginx${NC}"
        fi
    fi
}

# Menu principal
show_menu() {
    echo -e "${BLUE}📋 Options Démarrage Rapide${NC}"
    echo "============================"
    echo "1. 🚀 Démarrage complet automatique"
    echo "2. 📦 Installer dépendances seulement"
    echo "3. 🏗️  Build application seulement"
    echo "4. ▶️  Démarrer application seulement"
    echo "5. 🔧 Configurer Nginx"
    echo "6. 🧪 Tester connexion domaine"
    echo "7. 📋 Afficher guide complet"
    echo "8. ❌ Quitter"
    echo ""
    read -p "Choisissez une option (1-8): " choice
}

# Démarrage complet automatique
full_auto_start() {
    echo -e "${PURPLE}🚀 DÉMARRAGE COMPLET AUTOMATIQUE${NC}"
    echo "================================="
    echo ""

    if ! check_prerequisites; then
        echo -e "${RED}❌ Prérequis non satisfaits${NC}"
        return 1
    fi

    if ! test_domain_connection; then
        echo -e "${YELLOW}⚠️  Problème de connexion détecté, mais on continue...${NC}"
    fi

    if ! install_dependencies; then
        echo -e "${RED}❌ Erreur installation dépendances${NC}"
        return 1
    fi

    if ! build_application; then
        echo -e "${RED}❌ Erreur build application${NC}"
        return 1
    fi

    echo -e "${GREEN}🎉 Tout est prêt ! Démarrage de l'application...${NC}"
    echo ""
    start_application
}

# Afficher guide
show_guide() {
    echo -e "${BLUE}📖 Guide Complet${NC}"
    echo "==============="
    echo ""
    echo "Le guide complet est disponible dans :"
    echo "• GUIDE_CONNEXION_DOMAINE_NETIM_REEL.md"
    echo ""
    echo "Scripts disponibles :"
    echo "• ./scripts/test-netim-connection.sh - Test connexion"
    echo "• ./scripts/connect-administration-domain.sh - Configuration avancée"
    echo "• ./scripts/deploy-administration-ga.sh - Déploiement complet"
    echo ""
    echo "Configuration actuelle :"
    echo "• Domaine: $DOMAIN"
    echo "• IP: $REAL_IP"
    echo "• DNS: ns1/ns2/ns3.netim.net"
    echo ""
}

# Script principal
main() {
    # Vérifier qu'on est dans le bon répertoire
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Ce script doit être exécuté depuis le répertoire du projet${NC}"
        exit 1
    fi

    while true; do
        show_menu

        case $choice in
            1)
                full_auto_start
                ;;
            2)
                install_dependencies
                ;;
            3)
                build_application
                ;;
            4)
                start_application
                ;;
            5)
                setup_nginx
                ;;
            6)
                test_domain_connection
                ;;
            7)
                show_guide
                ;;
            8)
                echo -e "${BLUE}👋 Au revoir !${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Option invalide${NC}"
                ;;
        esac

        echo ""
        read -p "Appuyez sur Entrée pour continuer..."
        clear
    done
}

# Affichage initial
clear
echo -e "${PURPLE}🌐 ADMINISTRATION.GA - DÉMARRAGE RAPIDE${NC}"
echo "==========================================="
echo ""
echo "Configuration Netim détectée :"
echo "• Domaine: $DOMAIN ✅"
echo "• IP: $REAL_IP ✅"
echo "• DNS: Netim ✅"
echo ""

main
