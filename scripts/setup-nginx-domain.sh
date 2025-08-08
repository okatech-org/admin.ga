#!/bin/bash

# 🌐 Configuration Nginx pour administration.ga

echo "🔧 CONFIGURATION NGINX - administration.ga"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

DOMAIN="administration.ga"

# Fonction de vérification OS
check_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    else
        echo "unknown"
    fi
}

OS=$(check_os)

echo -e "${BLUE}🖥️  Système détecté: $OS${NC}"
echo ""

# Installation Nginx selon l'OS
install_nginx() {
    echo -e "${YELLOW}📦 Installation Nginx${NC}"
    echo "===================="

    if [ "$OS" = "macOS" ]; then
        # Installation sur macOS avec Homebrew
        if command -v brew &> /dev/null; then
            echo "Installation via Homebrew..."
            brew install nginx
            echo -e "${GREEN}✅ Nginx installé via Homebrew${NC}"
        else
            echo -e "${RED}❌ Homebrew non installé. Installez-le d'abord:${NC}"
            echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
            exit 1
        fi
    elif [ "$OS" = "linux" ]; then
        # Installation sur Linux
        if command -v apt-get &> /dev/null; then
            echo "Installation via apt (Ubuntu/Debian)..."
            sudo apt-get update
            sudo apt-get install -y nginx
            echo -e "${GREEN}✅ Nginx installé via apt${NC}"
        elif command -v yum &> /dev/null; then
            echo "Installation via yum (CentOS/RHEL)..."
            sudo yum install -y nginx
            echo -e "${GREEN}✅ Nginx installé via yum${NC}"
        else
            echo -e "${RED}❌ Gestionnaire de paquets non supporté${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Système d'exploitation non supporté${NC}"
        exit 1
    fi
    echo ""
}

# Configuration Nginx
configure_nginx() {
    echo -e "${YELLOW}⚙️ Configuration Nginx${NC}"
    echo "====================="

    if [ "$OS" = "macOS" ]; then
        NGINX_DIR="/usr/local/etc/nginx"
        SITES_AVAILABLE="$NGINX_DIR/servers"
        NGINX_CONF="$NGINX_DIR/nginx.conf"
    else
        NGINX_DIR="/etc/nginx"
        SITES_AVAILABLE="$NGINX_DIR/sites-available"
        SITES_ENABLED="$NGINX_DIR/sites-enabled"
        NGINX_CONF="$NGINX_DIR/nginx.conf"
    fi

    echo "Configuration dans: $NGINX_DIR"

    # Créer les répertoires si nécessaire
    if [ "$OS" = "macOS" ]; then
        sudo mkdir -p "$SITES_AVAILABLE"
    else
        sudo mkdir -p "$SITES_AVAILABLE" "$SITES_ENABLED"
    fi

    # Copier le fichier de configuration
    if [ -f "nginx/administration.ga.conf" ]; then
        if [ "$OS" = "macOS" ]; then
            sudo cp nginx/administration.ga.conf "$SITES_AVAILABLE/administration.ga.conf"
        else
            sudo cp nginx/administration.ga.conf "$SITES_AVAILABLE/administration.ga"
            # Créer le lien symbolique pour sites-enabled
            sudo ln -sf "$SITES_AVAILABLE/administration.ga" "$SITES_ENABLED/"
        fi
        echo -e "${GREEN}✅ Configuration copiée${NC}"
    else
        echo -e "${RED}❌ Fichier de configuration manquant: nginx/administration.ga.conf${NC}"
        exit 1
    fi

    # Tester la configuration
    echo "Test de la configuration..."
    if sudo nginx -t; then
        echo -e "${GREEN}✅ Configuration Nginx valide${NC}"
    else
        echo -e "${RED}❌ Erreur dans la configuration Nginx${NC}"
        exit 1
    fi
    echo ""
}

# Démarrage/Redémarrage Nginx
start_nginx() {
    echo -e "${YELLOW}🚀 Démarrage Nginx${NC}"
    echo "=================="

    if [ "$OS" = "macOS" ]; then
        # Sur macOS avec Homebrew
        sudo brew services start nginx || sudo nginx
        echo -e "${GREEN}✅ Nginx démarré sur macOS${NC}"
    else
        # Sur Linux
        sudo systemctl enable nginx
        sudo systemctl restart nginx
        if sudo systemctl is-active --quiet nginx; then
            echo -e "${GREEN}✅ Nginx démarré sur Linux${NC}"
        else
            echo -e "${RED}❌ Erreur lors du démarrage de Nginx${NC}"
            sudo systemctl status nginx
            exit 1
        fi
    fi
    echo ""
}

# Installation SSL avec Let's Encrypt
setup_ssl() {
    echo -e "${YELLOW}🔒 Configuration SSL (Let's Encrypt)${NC}"
    echo "==================================="

    if [ "$OS" = "linux" ]; then
        # Installation de Certbot
        if command -v certbot &> /dev/null; then
            echo "Certbot déjà installé"
        else
            echo "Installation de Certbot..."
            if command -v apt-get &> /dev/null; then
                sudo apt-get install -y certbot python3-certbot-nginx
            elif command -v yum &> /dev/null; then
                sudo yum install -y certbot python3-certbot-nginx
            fi
        fi

        echo ""
        echo -e "${BLUE}📋 Pour configurer SSL automatiquement, exécutez :${NC}"
        echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        echo ""
        echo -e "${YELLOW}⚠️  Assurez-vous que :${NC}"
        echo "• Les DNS pointent vers ce serveur"
        echo "• Les ports 80 et 443 sont ouverts"
        echo "• Le domaine est accessible depuis l'extérieur"

    else
        echo -e "${YELLOW}⚠️  Sur macOS, utilisez une solution comme Caddy ou configurez SSL manuellement${NC}"
        echo "Alternative: Utilisez Cloudflare pour SSL automatique"
    fi
    echo ""
}

# Affichage des informations finales
show_info() {
    echo -e "${BLUE}📋 INFORMATIONS IMPORTANTES${NC}"
    echo "=========================="
    echo ""
    echo "Configuration terminée pour: $DOMAIN"
    echo ""
    echo -e "${GREEN}✅ Nginx configuré et démarré${NC}"
    echo -e "${GREEN}✅ Reverse proxy vers localhost:3000${NC}"
    echo ""
    echo -e "${YELLOW}🌐 URLs d'accès :${NC}"
    echo "• Local: http://localhost"
    echo "• Domaine: http://$DOMAIN (une fois DNS propagé)"
    echo "• HTTPS: https://$DOMAIN (après configuration SSL)"
    echo ""
    echo -e "${YELLOW}📁 Fichiers de configuration :${NC}"
    if [ "$OS" = "macOS" ]; then
        echo "• Configuration: $SITES_AVAILABLE/administration.ga.conf"
        echo "• Logs: /usr/local/var/log/nginx/"
    else
        echo "• Configuration: $SITES_AVAILABLE/administration.ga"
        echo "• Lien actif: $SITES_ENABLED/administration.ga"
        echo "• Logs: /var/log/nginx/"
    fi
    echo ""
    echo -e "${YELLOW}🔧 Commandes utiles :${NC}"
    if [ "$OS" = "macOS" ]; then
        echo "• Redémarrer: sudo brew services restart nginx"
        echo "• Arrêter: sudo brew services stop nginx"
        echo "• Tester config: sudo nginx -t"
    else
        echo "• Redémarrer: sudo systemctl restart nginx"
        echo "• Status: sudo systemctl status nginx"
        echo "• Logs: sudo tail -f /var/log/nginx/administration.ga.access.log"
        echo "• Tester config: sudo nginx -t"
    fi
    echo ""
    echo -e "${GREEN}🎉 Configuration terminée !${NC}"
    echo ""
    echo -e "${YELLOW}⏳ Prochaines étapes :${NC}"
    echo "1. Démarrez votre application Next.js sur le port 3000"
    echo "2. Configurez les DNS chez Netim (voir instructions)"
    echo "3. Attendez la propagation DNS"
    echo "4. Configurez SSL avec Let's Encrypt (Linux) ou Cloudflare"
    echo "5. Testez l'accès via http://$DOMAIN"
}

# Vérification des permissions
check_permissions() {
    if [ "$EUID" -eq 0 ]; then
        echo -e "${RED}❌ Ne lancez pas ce script en tant que root${NC}"
        echo "Le script utilisera sudo quand nécessaire"
        exit 1
    fi
}

# Script principal
main() {
    check_permissions

    echo -e "${BLUE}🚀 Début de la configuration Nginx${NC}"
    echo ""

    # Vérifier si Nginx est déjà installé
    if command -v nginx &> /dev/null; then
        echo -e "${GREEN}✅ Nginx déjà installé${NC}"
        echo ""
    else
        install_nginx
    fi

    configure_nginx
    start_nginx
    setup_ssl
    show_info
}

# Lancer le script principal
main "$@"
