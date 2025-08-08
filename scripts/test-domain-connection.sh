#!/bin/bash

# 🧪 Test de Connexion Domaine - administration.ga

echo "🧪 TEST DE CONNEXION DOMAINE ADMINISTRATION.GA"
echo "=============================================="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DOMAIN="administration.ga"
IP_LOCAL="185.26.106.234"

echo -e "${BLUE}🔍 TESTS DE VALIDATION${NC}"
echo "======================="
echo ""

# Test 1: Vérification IP publique
echo -e "${YELLOW}📍 Test 1: Vérification IP publique${NC}"
CURRENT_IP=$(curl -4 -s ifconfig.me)
echo "IP actuelle détectée: $CURRENT_IP"
if [ "$CURRENT_IP" = "$IP_LOCAL" ]; then
    echo -e "${GREEN}✅ IP correspond à la configuration${NC}"
else
    echo -e "${RED}⚠️  IP différente de la configuration ($IP_LOCAL)${NC}"
    echo "   Vous devrez peut-être mettre à jour l'IP dans l'interface"
fi
echo ""

# Test 2: Vérification application locale
echo -e "${YELLOW}📱 Test 2: Application locale${NC}"
if curl -s -f http://localhost:3000 >/dev/null; then
    echo -e "${GREEN}✅ Application fonctionne sur localhost:3000${NC}"
else
    echo -e "${RED}❌ Application non accessible sur localhost:3000${NC}"
    echo "   Démarrez l'application avec: npm run dev"
fi
echo ""

# Test 3: Test API domaine management
echo -e "${YELLOW}🔧 Test 3: API Domain Management${NC}"
API_RESPONSE=$(curl -s "http://localhost:3000/api/domain-management/dns?domain=$DOMAIN")
if echo "$API_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ API Domain Management fonctionne${NC}"
    echo "   Configuration DNS Netim détectée"
else
    echo -e "${RED}❌ Problème avec l'API Domain Management${NC}"
fi
echo ""

# Test 4: Résolution DNS (si configuré)
echo -e "${YELLOW}🌐 Test 4: Résolution DNS${NC}"
DNS_RESULT=$(nslookup $DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')
if [ ! -z "$DNS_RESULT" ]; then
    echo "DNS résolu vers: $DNS_RESULT"
    if [ "$DNS_RESULT" = "$IP_LOCAL" ]; then
        echo -e "${GREEN}✅ DNS pointe vers votre IP${NC}"
    else
        echo -e "${YELLOW}⚠️  DNS pointe vers une IP différente${NC}"
        echo "   Vérifiez la configuration chez Netim.com"
    fi
else
    echo -e "${YELLOW}⏳ DNS pas encore propagé ou non configuré${NC}"
    echo "   Configurez les enregistrements A chez Netim:"
    echo "   A @ → $IP_LOCAL"
    echo "   A www → $IP_LOCAL"
fi
echo ""

# Test 5: Accessibilité externe (si DNS configuré)
echo -e "${YELLOW}🌍 Test 5: Accessibilité externe${NC}"
if [ ! -z "$DNS_RESULT" ] && [ "$DNS_RESULT" = "$IP_LOCAL" ]; then
    echo "Test d'accès externe..."
    if curl -s -f --connect-timeout 10 "http://$DOMAIN:3000" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Domaine accessible depuis l'extérieur${NC}"
        echo "   🎉 http://$DOMAIN:3000 fonctionne !"
    else
        echo -e "${RED}❌ Domaine non accessible depuis l'extérieur${NC}"
        echo "   Vérifiez:"
        echo "   • Ports 80/3000 ouverts sur votre machine"
        echo "   • Redirection de ports sur votre routeur"
        echo "   • Pare-feu autorise les connexions entrantes"
    fi
else
    echo -e "${YELLOW}⏭️  Ignoré (DNS non configuré)${NC}"
fi
echo ""

# Recommandations
echo -e "${BLUE}📋 ACTIONS RECOMMANDÉES${NC}"
echo "======================="
echo ""

echo "🔧 Configuration Netim.com:"
echo "  1. Connectez-vous à netim.com"
echo "  2. Mes domaines → $DOMAIN → DNS"
echo "  3. Ajoutez:"
echo "     Type: A, Nom: @, Valeur: $IP_LOCAL"
echo "     Type: A, Nom: www, Valeur: $IP_LOCAL"
echo ""

echo "⚙️ Configuration Application:"
echo "  1. Ouvrez: http://localhost:3000/admin-web/config/administration.ga"
echo "  2. Onglet 'Domaines'"
echo "  3. IP: $IP_LOCAL (pré-remplie)"
echo "  4. Cliquez 'Démarrer la Configuration'"
echo ""

echo "🔓 Configuration Réseau (si nécessaire):"
echo "  • Ouvrir ports 80 et 443 sur votre machine"
echo "  • Configurer redirection de ports sur routeur"
echo "  • Ou utiliser un tunnel: ngrok http 3000"
echo ""

echo "🧪 Tests finaux:"
echo "  • Attendre propagation DNS (15min-2h)"
echo "  • Tester: http://$DOMAIN:3000"
echo "  • Relancer ce script pour validation"
echo ""

echo -e "${GREEN}🎯 Une fois configuré, votre domaine $DOMAIN sera accessible mondialement !${NC}"
