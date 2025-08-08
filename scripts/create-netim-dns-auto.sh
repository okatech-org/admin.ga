#!/bin/bash

# 🌐 Création Automatique DNS Netim via API

echo "🔧 CRÉATION AUTOMATIQUE DNS NETIM"
echo "================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DOMAIN="administration.ga"
IP="185.26.106.234"

echo -e "${BLUE}🎯 Configuration${NC}"
echo "================="
echo "• Domaine: $DOMAIN"
echo "• IP: $IP"
echo "• Enregistrements: A @ et A www"
echo ""

# Vérifier les clés API Netim
check_netim_api() {
    echo -e "${YELLOW}🔑 Vérification Clés API Netim${NC}"
    echo "==============================="

    if [ -z "$NETIM_API_KEY" ] || [ -z "$NETIM_API_SECRET" ]; then
        echo -e "${RED}❌ Clés API Netim manquantes${NC}"
        echo ""
        echo "Pour utiliser l'API automatique, vous devez :"
        echo "1. Obtenir vos clés API chez Netim.com"
        echo "2. Les configurer dans .env.local :"
        echo ""
        echo "   NETIM_API_KEY=votre_cle_api"
        echo "   NETIM_API_SECRET=votre_secret_api"
        echo ""
        echo -e "${YELLOW}📋 Alternative : Configuration manuelle${NC}"
        echo "======================================"
        show_manual_instructions
        return 1
    else
        echo -e "${GREEN}✅ Clés API trouvées${NC}"
        return 0
    fi
}

# Instructions manuelles
show_manual_instructions() {
    echo ""
    echo -e "${BLUE}📋 INSTRUCTIONS MANUELLES NETIM${NC}"
    echo "==============================="
    echo ""
    echo "1. Connectez-vous à netim.com"
    echo "2. Mes domaines → $DOMAIN"
    echo "3. DNS → Ajouter ces enregistrements :"
    echo ""
    echo -e "${GREEN}┌─────────────────────────────────┐${NC}"
    echo -e "${GREEN}│ Type: A                         │${NC}"
    echo -e "${GREEN}│ Nom: @                          │${NC}"
    echo -e "${GREEN}│ Valeur: $IP           │${NC}"
    echo -e "${GREEN}│ TTL: 3600                       │${NC}"
    echo -e "${GREEN}└─────────────────────────────────┘${NC}"
    echo ""
    echo -e "${GREEN}┌─────────────────────────────────┐${NC}"
    echo -e "${GREEN}│ Type: A                         │${NC}"
    echo -e "${GREEN}│ Nom: www                        │${NC}"
    echo -e "${GREEN}│ Valeur: $IP           │${NC}"
    echo -e "${GREEN}│ TTL: 3600                       │${NC}"
    echo -e "${GREEN}└─────────────────────────────────┘${NC}"
    echo ""
    echo "4. Sauvegardez les modifications"
    echo "5. Attendez propagation (15min - 2h)"
    echo ""
}

# Création DNS via API Netim
create_dns_via_api() {
    echo -e "${YELLOW}🚀 Création DNS via API Netim${NC}"
    echo "============================="

    local base_url="https://rest.netim.com/3.0"
    local headers="Authorization: Bearer $NETIM_API_KEY"

    echo "Création enregistrement A @ ..."

    # Enregistrement A @
    local response1=$(curl -s -X POST "$base_url/domain/$DOMAIN/dns" \
        -H "Content-Type: application/json" \
        -H "$headers" \
        -H "X-API-Secret: $NETIM_API_SECRET" \
        -d "{
            \"type\": \"A\",
            \"name\": \"@\",
            \"value\": \"$IP\",
            \"ttl\": 3600
        }")

    if echo "$response1" | grep -q "success\|created"; then
        echo -e "${GREEN}✅ Enregistrement A @ créé${NC}"
    else
        echo -e "${RED}❌ Erreur création A @ : $response1${NC}"
    fi

    echo "Création enregistrement A www ..."

    # Enregistrement A www
    local response2=$(curl -s -X POST "$base_url/domain/$DOMAIN/dns" \
        -H "Content-Type: application/json" \
        -H "$headers" \
        -H "X-API-Secret: $NETIM_API_SECRET" \
        -d "{
            \"type\": \"A\",
            \"name\": \"www\",
            \"value\": \"$IP\",
            \"ttl\": 3600
        }")

    if echo "$response2" | grep -q "success\|created"; then
        echo -e "${GREEN}✅ Enregistrement A www créé${NC}"
    else
        echo -e "${RED}❌ Erreur création A www : $response2${NC}"
    fi

    echo ""
    echo -e "${GREEN}✅ Configuration DNS terminée !${NC}"
    echo ""
    echo -e "${YELLOW}⏳ Propagation DNS en cours...${NC}"
    echo "• Délai: 15 minutes à 2 heures"
    echo "• Test: nslookup $DOMAIN"
    echo "• Vérification: https://whatsmydns.net"
    echo ""
}

# Obtenir les clés API Netim
get_netim_api_keys() {
    echo -e "${BLUE}🔑 Configuration Clés API Netim${NC}"
    echo "==============================="
    echo ""
    echo "Pour obtenir vos clés API Netim :"
    echo ""
    echo "1. Connectez-vous à netim.com"
    echo "2. Mon compte → API"
    echo "3. Générez une nouvelle clé API"
    echo "4. Copiez la clé et le secret"
    echo ""
    echo "Voulez-vous saisir vos clés maintenant ? (y/n)"
    read -r answer

    if [ "$answer" = "y" ]; then
        echo ""
        read -p "Clé API Netim: " api_key
        read -s -p "Secret API Netim: " api_secret
        echo ""

        # Sauvegarder dans .env.local
        echo "" >> .env.local
        echo "# Clés API Netim" >> .env.local
        echo "NETIM_API_KEY=$api_key" >> .env.local
        echo "NETIM_API_SECRET=$api_secret" >> .env.local

        export NETIM_API_KEY="$api_key"
        export NETIM_API_SECRET="$api_secret"

        echo -e "${GREEN}✅ Clés sauvegardées dans .env.local${NC}"
        return 0
    else
        return 1
    fi
}

# Tester la connexion DNS
test_dns_propagation() {
    echo -e "${YELLOW}🧪 Test Propagation DNS${NC}"
    echo "======================="

    echo "Test résolution DNS..."
    local dns_result=$(nslookup $DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')

    if [ "$dns_result" = "$IP" ]; then
        echo -e "${GREEN}✅ DNS propagé ! $DOMAIN → $IP${NC}"

        echo ""
        echo "Test connectivité HTTP..."
        if curl -s -f --connect-timeout 10 "http://$DOMAIN:3000" >/dev/null; then
            echo -e "${GREEN}✅ Site accessible : http://$DOMAIN:3000${NC}"
        else
            echo -e "${YELLOW}⚠️  Site pas encore accessible (serveur à démarrer ?)${NC}"
        fi

    elif [ ! -z "$dns_result" ]; then
        echo -e "${YELLOW}⏳ DNS en cours de propagation${NC}"
        echo "Actuel: $dns_result"
        echo "Attendu: $IP"
        echo "Attendez encore un peu..."
    else
        echo -e "${RED}❌ DNS pas encore propagé${NC}"
        echo "Vérifiez la configuration chez Netim"
    fi
    echo ""
}

# Menu principal
show_menu() {
    echo -e "${BLUE}📋 Options DNS Netim${NC}"
    echo "==================="
    echo "1. 🤖 Création automatique (API Netim)"
    echo "2. 📋 Instructions manuelles"
    echo "3. 🔑 Configurer clés API"
    echo "4. 🧪 Tester propagation DNS"
    echo "5. ❌ Quitter"
    echo ""
    read -p "Choisissez (1-5): " choice
}

# Script principal
main() {
    # Charger .env.local si existe
    if [ -f ".env.local" ]; then
        source .env.local
    fi

    while true; do
        show_menu

        case $choice in
            1)
                if check_netim_api; then
                    create_dns_via_api
                fi
                ;;
            2)
                show_manual_instructions
                ;;
            3)
                get_netim_api_keys
                ;;
            4)
                test_dns_propagation
                ;;
            5)
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
echo -e "${BLUE}🌐 GESTION DNS NETIM - administration.ga${NC}"
echo "=========================================="
echo ""
echo "Ce script peut :"
echo "• 🤖 Créer automatiquement les DNS (avec clés API)"
echo "• 📋 Afficher les instructions manuelles"
echo "• 🧪 Tester la propagation DNS"
echo ""

main
