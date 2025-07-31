#!/bin/bash

# ================================================
# Script de configuration développement Administration.GA
# Setup automatique de l'environnement de développement
# ================================================

set -euo pipefail

# ===============================================
# Configuration
# ===============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
NODE_VERSION="18"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ===============================================
# Fonctions utilitaires
# ===============================================
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

error() {
    echo -e "${RED}[✗]${NC} $1"
}

header() {
    echo -e "\n${CYAN}================================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}================================================${NC}\n"
}

# ===============================================
# Vérification du système
# ===============================================
check_system() {
    header "Vérification du système"

    # Vérifier l'OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macOS"
        PACKAGE_MANAGER="brew"
        success "macOS détecté"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="Linux"
        if command -v apt-get &> /dev/null; then
            PACKAGE_MANAGER="apt"
        elif command -v yum &> /dev/null; then
            PACKAGE_MANAGER="yum"
        elif command -v pacman &> /dev/null; then
            PACKAGE_MANAGER="pacman"
        fi
        success "Linux détecté"
    else
        error "OS non supporté: $OSTYPE"
        exit 1
    fi

    # Vérifier l'architecture
    ARCH=$(uname -m)
    if [[ "$ARCH" == "x86_64" ]] || [[ "$ARCH" == "arm64" ]] || [[ "$ARCH" == "aarch64" ]]; then
        success "Architecture supportée: $ARCH"
    else
        warning "Architecture non testée: $ARCH"
    fi
}

# ===============================================
# Installation des dépendances système
# ===============================================
install_system_dependencies() {
    header "Installation des dépendances système"

    case $PACKAGE_MANAGER in
        "brew")
            log "Installation via Homebrew..."
            if ! command -v brew &> /dev/null; then
                log "Installation de Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi

            brew update
            brew install git curl wget postgresql redis
            success "Dépendances macOS installées"
            ;;

        "apt")
            log "Installation via APT..."
            sudo apt update
            sudo apt install -y git curl wget postgresql-client redis-tools build-essential
            success "Dépendances Ubuntu/Debian installées"
            ;;

        "yum")
            log "Installation via YUM..."
            sudo yum update -y
            sudo yum install -y git curl wget postgresql redis
            success "Dépendances CentOS/RHEL installées"
            ;;

        *)
            warning "Gestionnaire de paquets non reconnu, installation manuelle nécessaire"
            ;;
    esac
}

# ===============================================
# Installation de Node.js et npm
# ===============================================
install_nodejs() {
    header "Installation de Node.js"

    if command -v node &> /dev/null; then
        CURRENT_NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ "$CURRENT_NODE_VERSION" -ge "$NODE_VERSION" ]]; then
            success "Node.js déjà installé (v$(node --version))"
            return
        else
            warning "Node.js v$CURRENT_NODE_VERSION détecté, mise à jour vers v$NODE_VERSION recommandée"
        fi
    fi

    # Installation via Node Version Manager (NVM)
    if ! command -v nvm &> /dev/null; then
        log "Installation de NVM..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

        # Recharger NVM
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    fi

    log "Installation de Node.js v$NODE_VERSION..."
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
    nvm alias default $NODE_VERSION

    success "Node.js v$NODE_VERSION installé"

    # Vérifier npm
    if command -v npm &> /dev/null; then
        success "npm disponible (v$(npm --version))"
    else
        error "npm non trouvé après installation de Node.js"
        exit 1
    fi
}

# ===============================================
# Installation de Docker
# ===============================================
install_docker() {
    header "Installation de Docker"

    if command -v docker &> /dev/null; then
        success "Docker déjà installé (v$(docker --version | awk '{print $3}' | tr -d ','))"

        # Vérifier Docker Compose
        if command -v docker-compose &> /dev/null; then
            success "Docker Compose déjà installé (v$(docker-compose --version | awk '{print $3}' | tr -d ','))"
            return
        fi
    fi

    case $OS in
        "macOS")
            log "Installation de Docker Desktop pour macOS..."
            if command -v brew &> /dev/null; then
                brew install --cask docker
            else
                warning "Veuillez installer Docker Desktop manuellement depuis https://docker.com/products/docker-desktop"
            fi
            ;;

        "Linux")
            log "Installation de Docker pour Linux..."
            # Installation Docker
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            sudo usermod -aG docker $USER

            # Installation Docker Compose
            sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose

            rm get-docker.sh
            success "Docker et Docker Compose installés"
            warning "Redémarrage nécessaire pour les permissions Docker"
            ;;
    esac
}

# ===============================================
# Configuration du projet
# ===============================================
setup_project() {
    header "Configuration du projet"

    cd "$PROJECT_ROOT"

    # Installation des dépendances npm
    log "Installation des dépendances npm..."
    if [[ -f "package-lock.json" ]]; then
        npm ci
    else
        npm install
    fi
    success "Dépendances npm installées"

    # Configuration des variables d'environnement
    if [[ ! -f ".env" ]]; then
        log "Création du fichier .env..."

        cat > .env << EOF
# ================================================
# Configuration Développement - Administration.GA
# ================================================

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Base de données (PostgreSQL local ou Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/administration_ga_dev

# Authentification
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-32-characters-long-for-local-dev

# Redis (optionnel pour le développement)
REDIS_URL=redis://localhost:6379

# IA Gemini (configurez votre clé)
GEMINI_API_KEY=your-gemini-api-key-here
ENABLE_AI_FEATURES=true

# Debug et développement
ENABLE_DEBUG_LOGGING=true
ENABLE_API_DOCUMENTATION=true
EOF

        success "Fichier .env créé"
        warning "N'oubliez pas de configurer vos clés API dans .env"
    else
        success "Fichier .env existant"
    fi

    # Génération du client Prisma
    log "Génération du client Prisma..."
    npx prisma generate
    success "Client Prisma généré"
}

# ===============================================
# Configuration de la base de données
# ===============================================
setup_database() {
    header "Configuration de la base de données"

    if command -v docker &> /dev/null; then
        log "Démarrage de PostgreSQL via Docker..."

        # Créer le container PostgreSQL si nécessaire
        if ! docker ps -a | grep -q "administration-ga-postgres-dev"; then
            docker run -d \
                --name administration-ga-postgres-dev \
                -e POSTGRES_PASSWORD=postgres \
                -e POSTGRES_DB=administration_ga_dev \
                -p 5432:5432 \
                postgres:15-alpine
        fi

        # Démarrer le container s'il est arrêté
        if ! docker ps | grep -q "administration-ga-postgres-dev"; then
            docker start administration-ga-postgres-dev
        fi

        # Attendre que PostgreSQL soit prêt
        log "Attente du démarrage de PostgreSQL..."
        sleep 5

        success "PostgreSQL démarré via Docker"
    else
        warning "Docker non disponible, configurez PostgreSQL manuellement"
        log "Configuration manuelle requise:"
        log "1. Installez PostgreSQL"
        log "2. Créez la base 'administration_ga_dev'"
        log "3. Configurez DATABASE_URL dans .env"
    fi

    # Exécuter les migrations
    log "Exécution des migrations Prisma..."
    cd "$PROJECT_ROOT"

    # Attendre que la base soit accessible
    local attempt=1
    local max_attempts=10

    while [[ $attempt -le $max_attempts ]]; do
        if npx prisma db push &> /dev/null; then
            success "Migrations appliquées"
            break
        fi

        log "Tentative $attempt/$max_attempts - Base de données non prête..."
        sleep 3
        ((attempt++))
    done

    if [[ $attempt -gt $max_attempts ]]; then
        error "Impossible de se connecter à la base de données"
        warning "Vérifiez votre configuration DATABASE_URL"
    fi

    # Seeding optionnel
    if [[ -f "prisma/seed.ts" ]]; then
        log "Seeding de la base de données..."
        npx prisma db seed || warning "Echec du seeding (normal si déjà fait)"
    fi
}

# ===============================================
# Configuration des outils de développement
# ===============================================
setup_dev_tools() {
    header "Configuration des outils de développement"

    cd "$PROJECT_ROOT"

    # Configuration ESLint
    if [[ ! -f ".eslintrc.json" ]]; then
        log "Configuration ESLint..."
        npx eslint --init || warning "Configuration ESLint échouée"
    fi

    # Configuration Prettier
    if [[ ! -f ".prettierrc" ]]; then
        log "Configuration Prettier..."
        cat > .prettierrc << EOF
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF
        success "Prettier configuré"
    fi

    # Configuration des hooks Git
    if [[ ! -d ".husky" ]]; then
        log "Configuration des hooks Git..."
        npx husky-init && npm install || warning "Configuration Husky échouée"
    fi

    # Configuration VS Code
    if [[ ! -d ".vscode" ]]; then
        log "Configuration VS Code..."
        mkdir -p .vscode

        cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "node_modules": true,
    ".next": true,
    "dist": true
  }
}
EOF

        cat > .vscode/extensions.json << EOF
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "Prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
EOF

        success "Configuration VS Code créée"
    fi
}

# ===============================================
# Tests et vérifications
# ===============================================
run_tests() {
    header "Tests et vérifications"

    cd "$PROJECT_ROOT"

    # Build test
    log "Test de build..."
    if npm run build; then
        success "Build réussi"
    else
        error "Echec du build"
        return 1
    fi

    # Lint test
    log "Test ESLint..."
    if npm run lint; then
        success "Lint réussi"
    else
        warning "Problèmes de lint détectés"
    fi

    # Type check
    log "Vérification TypeScript..."
    if npx tsc --noEmit; then
        success "Types corrects"
    else
        warning "Erreurs TypeScript détectées"
    fi
}

# ===============================================
# Fonction principale
# ===============================================
main() {
    header "Setup environnement de développement Administration.GA"

    check_system
    install_system_dependencies
    install_nodejs
    install_docker
    setup_project
    setup_database
    setup_dev_tools

    if run_tests; then
        header "🎉 Setup terminé avec succès !"
        echo -e "${GREEN}Votre environnement de développement est prêt !${NC}\n"

        echo -e "${CYAN}Prochaines étapes :${NC}"
        echo "1. Configurez vos clés API dans .env"
        echo "2. Démarrez le serveur de développement : ${YELLOW}npm run dev${NC}"
        echo "3. Ouvrez http://localhost:3000 dans votre navigateur"
        echo ""
        echo -e "${CYAN}Commandes utiles :${NC}"
        echo "• ${YELLOW}npm run dev${NC}        - Serveur de développement"
        echo "• ${YELLOW}npm run build${NC}      - Build de production"
        echo "• ${YELLOW}npm run lint${NC}       - Vérification ESLint"
        echo "• ${YELLOW}npx prisma studio${NC}  - Interface base de données"
        echo "• ${YELLOW}docker-compose up${NC}  - Services Docker"
        echo ""
        echo -e "${GREEN}Bon développement ! 🚀${NC}"
    else
        error "Setup terminé avec des erreurs"
        echo "Consultez les messages ci-dessus pour résoudre les problèmes"
        exit 1
    fi
}

# ===============================================
# Options de ligne de commande
# ===============================================
case "${1:-full}" in
    "full")
        main
        ;;
    "system")
        check_system
        install_system_dependencies
        ;;
    "node")
        install_nodejs
        ;;
    "docker")
        install_docker
        ;;
    "project")
        setup_project
        ;;
    "database")
        setup_database
        ;;
    "tools")
        setup_dev_tools
        ;;
    "test")
        run_tests
        ;;
    *)
        echo "Usage: $0 {full|system|node|docker|project|database|tools|test}"
        echo ""
        echo "  full     - Setup complet (défaut)"
        echo "  system   - Dépendances système uniquement"
        echo "  node     - Node.js et npm uniquement"
        echo "  docker   - Docker et Docker Compose"
        echo "  project  - Configuration projet uniquement"
        echo "  database - Configuration base de données"
        echo "  tools    - Outils de développement"
        echo "  test     - Tests et vérifications"
        exit 1
        ;;
esac
