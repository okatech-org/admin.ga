#!/bin/bash

# 🚀 Déploiement Production Complet - administration.ga

echo "🇬🇦 DÉPLOIEMENT PRODUCTION ADMINISTRATION.GA"
echo "=============================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
DOMAIN="administration.ga"
REAL_IP="185.26.106.234"
PORT=3000
NGINX_CONFIG="/etc/nginx/sites-available/$DOMAIN"
NGINX_ENABLED="/etc/nginx/sites-enabled/$DOMAIN"

echo -e "${PURPLE}🎯 Configuration Déploiement${NC}"
echo "============================="
echo "• Domaine: $DOMAIN"
echo "• IP Serveur: $REAL_IP"
echo "• Port Application: $PORT"
echo "• Environment: PRODUCTION"
echo ""

# Fonction pour afficher les erreurs et continuer
handle_error() {
    local message="$1"
    local continue_prompt="$2"

    echo -e "${RED}❌ $message${NC}"

    if [ "$continue_prompt" = "true" ]; then
        read -p "Continuer malgré l'erreur ? (y/n): " continue_choice
        if [ "$continue_choice" != "y" ]; then
            exit 1
        fi
    fi
}

# Vérification prérequis système
check_system_requirements() {
    echo -e "${YELLOW}🔍 Vérification Prérequis Système${NC}"
    echo "=================================="

    # Node.js
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        echo -e "${GREEN}✅ Node.js: $node_version${NC}"
    else
        handle_error "Node.js non installé. Installez Node.js 18+" false
        exit 1
    fi

    # npm
    if command -v npm &> /dev/null; then
        npm_version=$(npm --version)
        echo -e "${GREEN}✅ npm: $npm_version${NC}"
    else
        handle_error "npm non disponible" false
        exit 1
    fi

    # PostgreSQL (optionnel)
    if command -v psql &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL disponible${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL non détecté (peut être externe)${NC}"
    fi

    # PM2 (recommandé pour production)
    if command -v pm2 &> /dev/null; then
        echo -e "${GREEN}✅ PM2 disponible${NC}"
    else
        echo -e "${YELLOW}⚠️  PM2 non installé${NC}"
        read -p "Installer PM2 pour la gestion des processus ? (y/n): " install_pm2
        if [ "$install_pm2" = "y" ]; then
            npm install -g pm2
        fi
    fi

    echo ""
}

# Préparation environnement
prepare_environment() {
    echo -e "${YELLOW}📋 Préparation Environnement${NC}"
    echo "============================"

    # Backup si fichier .env existe
    if [ -f ".env.local" ]; then
        cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
        echo -e "${GREEN}✅ Backup .env.local créé${NC}"
    fi

    # Copier configuration production
    if [ -f "config-production-netim.env" ]; then
        cp config-production-netim.env .env.production
        echo -e "${GREEN}✅ Configuration production copiée${NC}"
    else
        echo -e "${RED}❌ Fichier config-production-netim.env non trouvé${NC}"
        echo "Création d'un fichier .env.production minimal..."
        cat > .env.production << EOF
# Configuration Production Minimale
APP_URL=https://$DOMAIN
NEXT_PUBLIC_APP_URL=https://$DOMAIN
NODE_ENV=production
DOMAIN=$DOMAIN
REAL_IP=$REAL_IP

# Base de données (à configurer)
DATABASE_URL=postgresql://user:password@localhost:5432/administration_ga

# NextAuth (IMPORTANT: Changez cette clé!)
NEXTAUTH_URL=https://$DOMAIN
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Email de base
EMAIL_FROM=noreply@$DOMAIN
EOF
        echo -e "${YELLOW}⚠️  Configuration minimale créée. Personnalisez .env.production${NC}"
    fi

    echo ""
}

# Installation et build
install_and_build() {
    echo -e "${YELLOW}📦 Installation et Build${NC}"
    echo "========================"

    # Nettoyage
    echo "Nettoyage des anciens builds..."
    rm -rf .next/
    rm -rf node_modules/.cache/

    # Installation dépendances
    echo "Installation des dépendances..."
    npm install --production=false

    if [ $? -ne 0 ]; then
        handle_error "Erreur lors de l'installation des dépendances" true
    else
        echo -e "${GREEN}✅ Dépendances installées${NC}"
    fi

    # Génération Prisma
    echo "Génération du client Prisma..."
    npx prisma generate

    if [ $? -ne 0 ]; then
        handle_error "Erreur génération Prisma" true
    else
        echo -e "${GREEN}✅ Client Prisma généré${NC}"
    fi

    # Build Next.js
    echo "Build de l'application Next.js..."
    NODE_ENV=production npm run build

    if [ $? -ne 0 ]; then
        handle_error "Erreur lors du build Next.js" false
        exit 1
    else
        echo -e "${GREEN}✅ Application buildée avec succès${NC}"
    fi

    echo ""
}

# Configuration Nginx
configure_nginx() {
    echo -e "${YELLOW}🔧 Configuration Nginx${NC}"
    echo "======================"

    # Vérifier si Nginx est installé
    if ! command -v nginx &> /dev/null; then
        echo -e "${RED}❌ Nginx non installé${NC}"
        read -p "Installer Nginx ? (y/n): " install_nginx
        if [ "$install_nginx" = "y" ]; then
            if command -v apt &> /dev/null; then
                sudo apt update && sudo apt install -y nginx
            elif command -v yum &> /dev/null; then
                sudo yum install -y nginx
            else
                echo "Installez Nginx manuellement et relancez le script"
                return 1
            fi
        else
            echo "Nginx requis pour le déploiement"
            return 1
        fi
    fi

    # Créer configuration Nginx
    echo "Création de la configuration Nginx..."

    sudo tee "$NGINX_CONFIG" > /dev/null << EOF
# Configuration Nginx pour $DOMAIN
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Logs
    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;

    # Sécurité de base
    server_tokens off;

    # Application Next.js
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Assets statiques optimisés
    location /_next/static/ {
        proxy_pass http://localhost:$PORT;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Images optimisées
    location /_next/image/ {
        proxy_pass http://localhost:$PORT;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Favicon
    location /favicon.ico {
        proxy_pass http://localhost:$PORT;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Configuration Nginx créée${NC}"

        # Activer le site
        sudo ln -sf "$NGINX_CONFIG" "$NGINX_ENABLED"

        # Test configuration
        sudo nginx -t
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Configuration Nginx valide${NC}"

            # Recharger Nginx
            sudo systemctl reload nginx
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ Nginx rechargé${NC}"
            else
                handle_error "Erreur rechargement Nginx" true
            fi
        else
            handle_error "Configuration Nginx invalide" true
        fi
    else
        handle_error "Erreur création configuration Nginx" true
    fi

    echo ""
}

# Configuration SSL avec Let's Encrypt
configure_ssl() {
    echo -e "${YELLOW}🔒 Configuration SSL Let's Encrypt${NC}"
    echo "=================================="

    # Vérifier certbot
    if ! command -v certbot &> /dev/null; then
        echo "Installation de certbot..."
        if command -v apt &> /dev/null; then
            sudo apt install -y certbot python3-certbot-nginx
        elif command -v yum &> /dev/null; then
            sudo yum install -y certbot python3-certbot-nginx
        else
            echo -e "${RED}❌ Installez certbot manuellement${NC}"
            return 1
        fi
    fi

    # Générer certificat SSL
    echo "Génération du certificat SSL..."
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Certificat SSL configuré${NC}"

        # Configurer renouvellement automatique
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        echo -e "${GREEN}✅ Renouvellement automatique configuré${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL non configuré automatiquement${NC}"
        echo "Configurez SSL manuellement plus tard avec :"
        echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi

    echo ""
}

# Démarrage application avec PM2
start_application() {
    echo -e "${YELLOW}🚀 Démarrage Application${NC}"
    echo "========================"

    # Arrêter processus existants
    if command -v pm2 &> /dev/null; then
        pm2 stop administration-ga 2>/dev/null || true
        pm2 delete administration-ga 2>/dev/null || true
    fi

    # Créer fichier ecosystem PM2
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'administration-ga',
    script: 'npm',
    args: 'start',
    cwd: '$(pwd)',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

    # Créer répertoire logs
    mkdir -p logs

    if command -v pm2 &> /dev/null; then
        # Démarrer avec PM2
        echo "Démarrage avec PM2..."
        pm2 start ecosystem.config.js

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Application démarrée avec PM2${NC}"

            # Sauvegarder configuration PM2
            pm2 save
            pm2 startup
        else
            handle_error "Erreur démarrage avec PM2" true
        fi
    else
        # Démarrage simple
        echo "Démarrage en mode simple..."
        echo "Pour démarrer manuellement : npm start"
        echo "Pour démarrage automatique, installez PM2 : npm install -g pm2"
    fi

    echo ""
}

# Tests post-déploiement
test_deployment() {
    echo -e "${YELLOW}🧪 Tests Post-Déploiement${NC}"
    echo "=========================="

    # Attendre que l'application démarre
    echo "Attente démarrage application (30s)..."
    sleep 30

    # Test port local
    if curl -s -f --connect-timeout 10 "http://localhost:$PORT" >/dev/null; then
        echo -e "${GREEN}✅ Application accessible localement${NC}"
    else
        handle_error "Application non accessible localement" true
    fi

    # Test domaine HTTP
    if curl -s -f --connect-timeout 10 "http://$DOMAIN" >/dev/null; then
        echo -e "${GREEN}✅ Domaine accessible en HTTP${NC}"
    else
        handle_error "Domaine non accessible en HTTP" true
    fi

    # Test HTTPS si configuré
    if curl -s -f --connect-timeout 10 "https://$DOMAIN" >/dev/null; then
        echo -e "${GREEN}✅ Domaine accessible en HTTPS${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTPS non encore accessible${NC}"
    fi

    echo ""
}

# Affichage final
show_final_status() {
    echo -e "${PURPLE}🎉 DÉPLOIEMENT TERMINÉ !${NC}"
    echo "========================="
    echo ""
    echo -e "${GREEN}Votre application est maintenant accessible :${NC}"
    echo "• HTTP  : http://$DOMAIN"
    echo "• HTTPS : https://$DOMAIN (si SSL configuré)"
    echo "• IP    : http://$REAL_IP"
    echo ""
    echo -e "${BLUE}Commandes utiles :${NC}"
    echo "• Voir logs app  : pm2 logs administration-ga"
    echo "• Restart app    : pm2 restart administration-ga"
    echo "• Statut app     : pm2 status"
    echo "• Logs Nginx     : sudo tail -f /var/log/nginx/$DOMAIN.access.log"
    echo "• Test SSL       : sudo certbot certificates"
    echo ""
    echo -e "${YELLOW}Prochaines étapes recommandées :${NC}"
    echo "1. Configurer la base de données de production"
    echo "2. Personnaliser les variables d'environnement"
    echo "3. Configurer le monitoring"
    echo "4. Effectuer des tests complets"
    echo ""
}

# Menu principal
show_menu() {
    echo -e "${BLUE}📋 Options Déploiement${NC}"
    echo "======================"
    echo "1. 🚀 Déploiement complet automatique"
    echo "2. 📦 Installation et build seulement"
    echo "3. 🔧 Configuration Nginx seulement"
    echo "4. 🔒 Configuration SSL seulement"
    echo "5. ▶️  Démarrage application seulement"
    echo "6. 🧪 Tests post-déploiement"
    echo "7. 📊 Afficher statut final"
    echo "8. ❌ Quitter"
    echo ""
    read -p "Choisissez une option (1-8): " choice
}

# Déploiement complet automatique
full_deployment() {
    echo -e "${PURPLE}🚀 DÉPLOIEMENT COMPLET AUTOMATIQUE${NC}"
    echo "=================================="
    echo ""

    check_system_requirements
    prepare_environment
    install_and_build
    configure_nginx
    configure_ssl
    start_application
    test_deployment
    show_final_status
}

# Script principal
main() {
    # Vérifier qu'on est dans le bon répertoire
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Ce script doit être exécuté depuis le répertoire du projet${NC}"
        exit 1
    fi

    # Vérifier les droits sudo pour Nginx et SSL
    if ! sudo -n true 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Ce script nécessite des droits sudo pour configurer Nginx et SSL${NC}"
        echo "Vous serez invité à saisir votre mot de passe si nécessaire."
        echo ""
    fi

    while true; do
        show_menu

        case $choice in
            1)
                full_deployment
                break
                ;;
            2)
                check_system_requirements
                prepare_environment
                install_and_build
                ;;
            3)
                configure_nginx
                ;;
            4)
                configure_ssl
                ;;
            5)
                start_application
                ;;
            6)
                test_deployment
                ;;
            7)
                show_final_status
                ;;
            8)
                echo -e "${BLUE}👋 Déploiement interrompu${NC}"
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
echo -e "${PURPLE}🇬🇦 DÉPLOIEMENT PRODUCTION ADMINISTRATION.GA${NC}"
echo "=============================================="
echo ""
echo "Ce script va déployer votre application en production avec :"
echo "• Configuration Nginx"
echo "• Certificats SSL (Let's Encrypt)"
echo "• Gestion des processus (PM2)"
echo "• Tests de validation"
echo ""
echo -e "${YELLOW}Configuration détectée :${NC}"
echo "• Domaine : $DOMAIN"
echo "• IP      : $REAL_IP"
echo "• Port    : $PORT"
echo ""

main
