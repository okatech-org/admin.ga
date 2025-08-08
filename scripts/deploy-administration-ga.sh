#!/bin/bash

# 🚀 Déploiement Complet - administration.ga

echo "🇬🇦 DÉPLOIEMENT ADMINISTRATION.GA"
echo "================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

DOMAIN="administration.ga"
IP="185.26.106.234"

echo -e "${PURPLE}🎯 Configuration Détectée${NC}"
echo "========================"
echo "• Domaine: $DOMAIN"
echo "• IP Publique: $IP"
echo "• Application: Next.js (Port 3000)"
echo "• Mode: Production avec domaine"
echo ""

# Menu de sélection
show_menu() {
    echo -e "${BLUE}📋 Options de Déploiement${NC}"
    echo "========================="
    echo "1. 🚀 Démarrage Rapide (Application seule)"
    echo "2. 🔧 Déploiement Complet (Application + Nginx)"
    echo "3. 🧪 Tests et Validation"
    echo "4. 📋 Voir les Instructions Netim"
    echo "5. 🛠️  Configuration Nginx seulement"
    echo "6. ❌ Quitter"
    echo ""
    read -p "Choisissez une option (1-6): " choice
}

# Option 1: Démarrage rapide
quick_start() {
    echo -e "${YELLOW}🚀 Démarrage Rapide${NC}"
    echo "=================="
    echo ""

    echo "Installation des dépendances..."
    npm install

    echo "Build de l'application..."
    npm run build

    echo "Démarrage en mode production..."
    echo -e "${GREEN}✅ Application démarrée sur http://localhost:3000${NC}"
    echo -e "${YELLOW}🌐 Sera accessible via http://$DOMAIN une fois DNS configuré${NC}"
    echo ""

    ./scripts/start-production-domain.sh
}

# Option 2: Déploiement complet
full_deployment() {
    echo -e "${YELLOW}🔧 Déploiement Complet${NC}"
    echo "====================="
    echo ""

    echo "1. Configuration de l'application..."
    npm install
    npm run build

    echo ""
    echo "2. Configuration Nginx..."
    ./scripts/setup-nginx-domain.sh

    echo ""
    echo "3. Démarrage de l'application..."
    ./scripts/start-production-domain.sh &

    echo ""
    echo -e "${GREEN}✅ Déploiement complet terminé !${NC}"
    echo ""
    echo -e "${BLUE}🌐 URLs d'accès :${NC}"
    echo "• Application directe: http://localhost:3000"
    echo "• Via Nginx: http://localhost"
    echo "• Domaine (après DNS): http://$DOMAIN"
    echo "• HTTPS (après SSL): https://$DOMAIN"
}

# Option 3: Tests
run_tests() {
    echo -e "${YELLOW}🧪 Tests et Validation${NC}"
    echo "====================="
    echo ""

    ./scripts/test-domain-connection.sh

    echo ""
    echo -e "${BLUE}🔍 Tests DNS Avancés${NC}"
    echo "==================="

    echo "Test résolution DNS..."
    nslookup $DOMAIN || echo "DNS pas encore propagé"

    echo ""
    echo "Test ping..."
    ping -c 3 $DOMAIN || echo "Domaine pas encore accessible"

    echo ""
    echo "Test connectivité HTTP..."
    curl -I --connect-timeout 10 http://$DOMAIN || echo "HTTP pas encore accessible"

    echo ""
    echo -e "${GREEN}✅ Tests terminés${NC}"
}

# Option 4: Instructions Netim
show_netim_instructions() {
    echo -e "${YELLOW}📋 Instructions Netim${NC}"
    echo "===================="
    echo ""

    if [ -f "INSTRUCTIONS_NETIM_ADMINISTRATION_GA.md" ]; then
        echo "📖 Instructions détaillées disponibles dans:"
        echo "INSTRUCTIONS_NETIM_ADMINISTRATION_GA.md"
        echo ""
        echo -e "${BLUE}📋 RÉSUMÉ RAPIDE :${NC}"
        echo ""
        echo "1. Connectez-vous à netim.com"
        echo "2. Mes domaines → administration.ga"
        echo "3. DNS → Ajouter ces enregistrements :"
        echo ""
        echo -e "${GREEN}   Type: A${NC}"
        echo -e "${GREEN}   Nom: @${NC}"
        echo -e "${GREEN}   Valeur: $IP${NC}"
        echo ""
        echo -e "${GREEN}   Type: A${NC}"
        echo -e "${GREEN}   Nom: www${NC}"
        echo -e "${GREEN}   Valeur: $IP${NC}"
        echo ""
        echo "4. Sauvegardez les modifications"
        echo "5. Attendez la propagation (15min - 2h)"
        echo ""

        read -p "Voulez-vous ouvrir le fichier d'instructions ? (y/n): " open_file
        if [ "$open_file" = "y" ]; then
            open INSTRUCTIONS_NETIM_ADMINISTRATION_GA.md || cat INSTRUCTIONS_NETIM_ADMINISTRATION_GA.md
        fi
    else
        echo -e "${RED}❌ Fichier d'instructions non trouvé${NC}"
    fi
}

# Option 5: Configuration Nginx seulement
nginx_only() {
    echo -e "${YELLOW}🛠️  Configuration Nginx${NC}"
    echo "====================="
    echo ""

    ./scripts/setup-nginx-domain.sh

    echo ""
    echo -e "${GREEN}✅ Configuration Nginx terminée${NC}"
    echo ""
    echo "N'oubliez pas de démarrer votre application Next.js :"
    echo "npm run dev # ou"
    echo "./scripts/start-production-domain.sh"
}

# Affichage du statut
show_status() {
    echo -e "${BLUE}📊 STATUT ACTUEL${NC}"
    echo "================"
    echo ""

    # Test application locale
    if curl -s -f http://localhost:3000 >/dev/null; then
        echo -e "${GREEN}✅ Application Next.js: Fonctionne${NC}"
    else
        echo -e "${RED}❌ Application Next.js: Arrêtée${NC}"
    fi

    # Test Nginx
    if command -v nginx >/dev/null && pgrep nginx >/dev/null; then
        echo -e "${GREEN}✅ Nginx: Installé et actif${NC}"
    elif command -v nginx >/dev/null; then
        echo -e "${YELLOW}⚠️  Nginx: Installé mais arrêté${NC}"
    else
        echo -e "${RED}❌ Nginx: Non installé${NC}"
    fi

    # Test DNS
    DNS_RESULT=$(nslookup $DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')
    if [ "$DNS_RESULT" = "$IP" ]; then
        echo -e "${GREEN}✅ DNS: Configuré correctement${NC}"
    elif [ ! -z "$DNS_RESULT" ]; then
        echo -e "${YELLOW}⚠️  DNS: Pointe vers $DNS_RESULT (attendu: $IP)${NC}"
    else
        echo -e "${RED}❌ DNS: Non configuré ou pas propagé${NC}"
    fi

    echo ""
}

# Fonction principale
main() {
    while true; do
        show_status
        show_menu

        case $choice in
            1)
                quick_start
                ;;
            2)
                full_deployment
                ;;
            3)
                run_tests
                ;;
            4)
                show_netim_instructions
                ;;
            5)
                nginx_only
                ;;
            6)
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

# Vérification des prérequis
check_prerequisites() {
    echo -e "${YELLOW}🔍 Vérification des Prérequis${NC}"
    echo "============================="

    # Node.js
    if command -v node >/dev/null; then
        echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
    else
        echo -e "${RED}❌ Node.js requis${NC}"
        exit 1
    fi

    # npm
    if command -v npm >/dev/null; then
        echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
    else
        echo -e "${RED}❌ npm requis${NC}"
        exit 1
    fi

    # package.json
    if [ -f "package.json" ]; then
        echo -e "${GREEN}✅ package.json trouvé${NC}"
    else
        echo -e "${RED}❌ package.json manquant${NC}"
        exit 1
    fi

    echo ""
}

# Banner d'accueil
show_banner() {
    clear
    echo -e "${PURPLE}"
    echo "  █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗██╗███████╗████████╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗"
    echo " ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║"
    echo " ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║██║███████╗   ██║   ██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║"
    echo " ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║██║╚════██║   ██║   ██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║"
    echo " ██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║██║███████║   ██║   ██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║"
    echo " ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝"
    echo ""
    echo "                                        🇬🇦 GABON"
    echo -e "${NC}"
    echo ""
    echo -e "${BLUE}Déploiement de la Plateforme d'Administration Gabonaise${NC}"
    echo -e "${YELLOW}Domaine: $DOMAIN | IP: $IP${NC}"
    echo ""
}

# Lancement du script
show_banner
check_prerequisites
main
