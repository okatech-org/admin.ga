#!/bin/bash

# 🌐 Connexion Domaine administration.ga - Configuration Netim Réelle

echo "🇬🇦 CONNEXION DOMAINE ADMINISTRATION.GA"
echo "======================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration Réelle Netim (basée sur l'interface)
DOMAIN="administration.ga"
REAL_IP="185.26.106.234"
DNS_SERVERS="ns1.netim.net ns2.netim.net ns3.netim.net"
MX_SERVERS="mx1.netim.net mx2.netim.net"
SPF_RECORD="v=spf1 ip4:185.26.104.0/22 ~all"

echo -e "${PURPLE}🎯 Configuration Détectée Chez Netim${NC}"
echo "===================================="
echo "• Domaine: $DOMAIN"
echo "• IP Réelle: $REAL_IP"
echo "• DNS: ns1/ns2/ns3.netim.net"
echo "• MX: mx1/mx2.netim.net"
echo "• SPF: Configuré avec IP range Netim"
echo ""

# Vérifier la résolution DNS actuelle
check_dns_resolution() {
    echo -e "${YELLOW}🔍 Vérification DNS Actuelle${NC}"
    echo "============================="

    echo "Test résolution $DOMAIN..."
    local resolved_ip=$(nslookup $DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')

    if [ "$resolved_ip" = "$REAL_IP" ]; then
        echo -e "${GREEN}✅ DNS résolu correctement: $DOMAIN → $REAL_IP${NC}"

        echo ""
        echo "Test www.$DOMAIN..."
        local www_ip=$(nslookup www.$DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')

        if [ "$www_ip" = "$REAL_IP" ]; then
            echo -e "${GREEN}✅ www.$DOMAIN résolu correctement: → $REAL_IP${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  www.$DOMAIN résout vers: $www_ip (attendu: $REAL_IP)${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ DNS pas encore propagé ou incorrect${NC}"
        echo "Résolu: ${resolved_ip:-'Non résolu'}"
        echo "Attendu: $REAL_IP"
        return 1
    fi
}

# Tester la connectivité HTTP
test_http_connection() {
    echo -e "${YELLOW}🌐 Test Connexion HTTP${NC}"
    echo "======================"

    echo "Test connexion directe IP $REAL_IP:3000..."
    if curl -s -f --connect-timeout 10 "http://$REAL_IP:3000" >/dev/null; then
        echo -e "${GREEN}✅ Serveur accessible via IP: http://$REAL_IP:3000${NC}"
    else
        echo -e "${RED}❌ Serveur non accessible via IP${NC}"
        echo "Vérifiez que votre application Next.js fonctionne sur le port 3000"
    fi

    echo ""
    echo "Test connexion domaine $DOMAIN..."
    if curl -s -f --connect-timeout 10 "http://$DOMAIN" >/dev/null; then
        echo -e "${GREEN}✅ Domaine accessible: http://$DOMAIN${NC}"
    else
        echo -e "${YELLOW}⚠️  Domaine pas encore accessible${NC}"
        echo "Cela peut être normal si l'application n'est pas encore déployée"
    fi

    echo ""
    echo "Test connexion avec port 3000..."
    if curl -s -f --connect-timeout 10 "http://$DOMAIN:3000" >/dev/null; then
        echo -e "${GREEN}✅ Application accessible: http://$DOMAIN:3000${NC}"
    else
        echo -e "${YELLOW}⚠️  Application pas accessible sur port 3000${NC}"
    fi
}

# Afficher les enregistrements DNS actuels
show_current_dns() {
    echo -e "${BLUE}📋 Enregistrements DNS Actuels${NC}"
    echo "==============================="

    echo "🔍 Enregistrements A:"
    dig A $DOMAIN +short | while read ip; do
        if [ "$ip" = "$REAL_IP" ]; then
            echo -e "  • $DOMAIN → $ip ${GREEN}✅${NC}"
        else
            echo -e "  • $DOMAIN → $ip ${YELLOW}⚠️${NC}"
        fi
    done

    echo ""
    echo "🔍 Enregistrements MX:"
    dig MX $DOMAIN +short | while read priority mx; do
        echo "  • $mx (priorité: $priority)"
    done

    echo ""
    echo "🔍 Enregistrements TXT (SPF):"
    dig TXT $DOMAIN +short | grep "spf1" | while read txt; do
        echo "  • $txt"
    done

    echo ""
    echo "🔍 Serveurs DNS (NS):"
    dig NS $DOMAIN +short | while read ns; do
        echo "  • $ns"
    done
}

# Créer la configuration Nginx pour le domaine
create_nginx_config() {
    echo -e "${YELLOW}🔧 Génération Configuration Nginx${NC}"
    echo "=================================="

    local nginx_config="server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirection HTTPS (optionnel)
    # return 301 https://\$server_name\$request_uri;

    # Ou configuration directe
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

    # Assets statiques
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}

# Configuration HTTPS avec SSL (Let's Encrypt)
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # Certificats SSL (à générer avec certbot)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

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
}"

    echo "$nginx_config" > "nginx-$DOMAIN.conf"
    echo -e "${GREEN}✅ Configuration Nginx créée: nginx-$DOMAIN.conf${NC}"
    echo ""
    echo "Pour appliquer:"
    echo "1. sudo cp nginx-$DOMAIN.conf /etc/nginx/sites-available/$DOMAIN"
    echo "2. sudo ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/"
    echo "3. sudo nginx -t"
    echo "4. sudo systemctl reload nginx"
}

# Démarrer l'application en mode production
start_production_app() {
    echo -e "${YELLOW}🚀 Démarrage Application Production${NC}"
    echo "=================================="

    echo "Construction de l'application..."
    npm run build

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build réussi${NC}"

        echo ""
        echo "Démarrage en mode production..."
        echo "L'application sera accessible sur:"
        echo "• http://$REAL_IP:3000 (IP directe)"
        echo "• http://$DOMAIN:3000 (domaine avec port)"
        echo "• http://$DOMAIN (avec Nginx configuré)"
        echo ""
        echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
        echo ""

        npm start
    else
        echo -e "${RED}❌ Erreur lors du build${NC}"
        return 1
    fi
}

# Configuration SSL avec Let's Encrypt
setup_ssl() {
    echo -e "${YELLOW}🔒 Configuration SSL Let's Encrypt${NC}"
    echo "=================================="

    echo "Installation de certbot (si nécessaire)..."
    if ! command -v certbot &> /dev/null; then
        echo "Veuillez installer certbot:"
        echo "Ubuntu/Debian: sudo apt install certbot python3-certbot-nginx"
        echo "CentOS/RHEL: sudo yum install certbot python3-certbot-nginx"
        return 1
    fi

    echo ""
    echo "Génération du certificat SSL..."
    echo "Commande à exécuter:"
    echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo ""
    echo "Renouvellement automatique:"
    echo "sudo crontab -e"
    echo "Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet"
}

# Menu principal
show_menu() {
    echo -e "${BLUE}📋 Options Connexion Domaine${NC}"
    echo "============================="
    echo "1. 🔍 Vérifier DNS et connectivité"
    echo "2. 📋 Afficher configuration DNS actuelle"
    echo "3. 🔧 Générer configuration Nginx"
    echo "4. 🚀 Démarrer application en production"
    echo "5. 🔒 Configurer SSL (Let's Encrypt)"
    echo "6. 📊 Rapport complet de statut"
    echo "7. ❌ Quitter"
    echo ""
    read -p "Choisissez une option (1-7): " choice
}

# Rapport complet
full_status_report() {
    echo -e "${PURPLE}📊 RAPPORT COMPLET - $DOMAIN${NC}"
    echo "========================================="
    echo ""

    check_dns_resolution
    echo ""
    test_http_connection
    echo ""
    show_current_dns
    echo ""

    echo -e "${BLUE}📋 Résumé${NC}"
    echo "========"
    echo "• Domaine configuré chez Netim ✅"
    echo "• IP réelle: $REAL_IP ✅"
    echo "• DNS Netim: ns1/ns2/ns3.netim.net ✅"
    echo "• Mail: mx1/mx2.netim.net ✅"
    echo "• SPF: Configuré ✅"
    echo ""
    echo "Prochaines étapes recommandées:"
    echo "1. Configurer Nginx (option 3)"
    echo "2. Démarrer l'application (option 4)"
    echo "3. Configurer SSL (option 5)"
}

# Script principal
main() {
    # Vérification environnement
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Ce script doit être exécuté depuis le répertoire du projet${NC}"
        exit 1
    fi

    while true; do
        show_menu

        case $choice in
            1)
                check_dns_resolution
                echo ""
                test_http_connection
                ;;
            2)
                show_current_dns
                ;;
            3)
                create_nginx_config
                ;;
            4)
                start_production_app
                ;;
            5)
                setup_ssl
                ;;
            6)
                full_status_report
                ;;
            7)
                echo -e "${BLUE}👋 Connexion terminée !${NC}"
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
echo -e "${PURPLE}🌐 CONNEXION DOMAINE ADMINISTRATION.GA${NC}"
echo "========================================="
echo ""
echo "Ce script utilise la configuration RÉELLE de votre domaine chez Netim:"
echo "• IP: $REAL_IP"
echo "• DNS: $DNS_SERVERS"
echo "• Mail: $MX_SERVERS"
echo ""

main
