#!/bin/bash

# 🧪 Test Connexion Rapide - administration.ga (Configuration Netim Réelle)

echo "🧪 TEST CONNEXION ADMINISTRATION.GA"
echo "==================================="
echo ""

# Configuration réelle Netim
DOMAIN="administration.ga"
REAL_IP="185.26.106.234"

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🎯 Configuration Netim Détectée${NC}"
echo "• Domaine: $DOMAIN"
echo "• IP réelle: $REAL_IP"
echo ""

# Test 1: Résolution DNS
echo -e "${YELLOW}🔍 Test 1: Résolution DNS${NC}"
echo "========================="

resolved_ip=$(nslookup $DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')

if [ "$resolved_ip" = "$REAL_IP" ]; then
    echo -e "${GREEN}✅ DNS OK: $DOMAIN → $REAL_IP${NC}"
else
    echo -e "${RED}❌ DNS incorrect${NC}"
    echo "   Résolu: ${resolved_ip:-'Non résolu'}"
    echo "   Attendu: $REAL_IP"
fi

# Test 2: Ping
echo ""
echo -e "${YELLOW}🏓 Test 2: Ping${NC}"
echo "==============="

if ping -c 1 $REAL_IP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ping OK: $REAL_IP répond${NC}"
else
    echo -e "${RED}❌ Ping échoué: $REAL_IP ne répond pas${NC}"
fi

# Test 3: Port 80 (HTTP)
echo ""
echo -e "${YELLOW}🌐 Test 3: Port 80 (HTTP)${NC}"
echo "=========================="

if timeout 5 bash -c "</dev/tcp/$REAL_IP/80" 2>/dev/null; then
    echo -e "${GREEN}✅ Port 80 ouvert sur $REAL_IP${NC}"
else
    echo -e "${RED}❌ Port 80 fermé sur $REAL_IP${NC}"
fi

# Test 4: Port 3000 (Next.js)
echo ""
echo -e "${YELLOW}⚡ Test 4: Port 3000 (Next.js)${NC}"
echo "=============================="

if timeout 5 bash -c "</dev/tcp/$REAL_IP/3000" 2>/dev/null; then
    echo -e "${GREEN}✅ Port 3000 ouvert sur $REAL_IP${NC}"

    # Test HTTP sur port 3000
    if curl -s -f --connect-timeout 5 "http://$REAL_IP:3000" >/dev/null; then
        echo -e "${GREEN}✅ Application Next.js accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Port ouvert mais application pas prête${NC}"
    fi
else
    echo -e "${RED}❌ Port 3000 fermé sur $REAL_IP${NC}"
    echo "   Démarrez votre application: npm start"
fi

# Test 5: Domaine HTTP
echo ""
echo -e "${YELLOW}🌍 Test 5: Accès Domaine${NC}"
echo "========================"

if curl -s -f --connect-timeout 5 "http://$DOMAIN" >/dev/null; then
    echo -e "${GREEN}✅ http://$DOMAIN accessible${NC}"
elif curl -s -f --connect-timeout 5 "http://$DOMAIN:3000" >/dev/null; then
    echo -e "${GREEN}✅ http://$DOMAIN:3000 accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Domaine pas encore accessible${NC}"
    echo "   Normal si l'application n'est pas démarrée"
fi

# Test 6: HTTPS
echo ""
echo -e "${YELLOW}🔒 Test 6: HTTPS${NC}"
echo "=================="

if curl -s -f --connect-timeout 5 "https://$DOMAIN" >/dev/null; then
    echo -e "${GREEN}✅ https://$DOMAIN accessible (SSL configuré)${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS pas encore configuré${NC}"
    echo "   Configurez Let's Encrypt pour activer SSL"
fi

# Résumé
echo ""
echo -e "${BLUE}📊 RÉSUMÉ${NC}"
echo "========"

if [ "$resolved_ip" = "$REAL_IP" ]; then
    echo -e "${GREEN}✅ DNS configuré correctement${NC}"
else
    echo -e "${RED}❌ Problème DNS${NC}"
fi

if ping -c 1 $REAL_IP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Serveur accessible${NC}"
else
    echo -e "${RED}❌ Serveur non accessible${NC}"
fi

if timeout 5 bash -c "</dev/tcp/$REAL_IP/3000" 2>/dev/null; then
    echo -e "${GREEN}✅ Application prête${NC}"
else
    echo -e "${YELLOW}⚠️  Application à démarrer${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Prochaines étapes:${NC}"
if [ "$resolved_ip" != "$REAL_IP" ]; then
    echo "1. Vérifier la configuration DNS chez Netim"
fi

if ! timeout 5 bash -c "</dev/tcp/$REAL_IP/3000" 2>/dev/null; then
    echo "2. Démarrer l'application: npm start"
fi

echo "3. Configurer Nginx pour le port 80"
echo "4. Configurer SSL avec Let's Encrypt"
echo ""
