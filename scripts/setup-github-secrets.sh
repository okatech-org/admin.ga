#!/bin/bash

# ================================================
# Script d'Aide - Configuration Secrets GitHub
# Génère les valeurs pour les secrets GitHub Actions
# ================================================

set -euo pipefail

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
# Génération des secrets
# ===============================================
generate_secrets() {
    header "🔑 Génération des Secrets GitHub Actions"

    echo "Ce script génère les valeurs pour vos secrets GitHub."
    echo "Vous devrez les copier manuellement dans GitHub > Settings > Secrets."
    echo ""

    # 1. NEXTAUTH_SECRET
    log "Génération de NEXTAUTH_SECRET..."
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo ""
    echo "✅ NEXTAUTH_SECRET:"
    echo "   Nom: NEXTAUTH_SECRET"
    echo "   Valeur: $NEXTAUTH_SECRET"
    echo ""

    # 2. DATABASE_URL
    echo "✅ DATABASE_URL:"
    echo "   Nom: DATABASE_URL"
    echo "   Valeur Local: postgresql://postgres:password@localhost:5432/administration_ga"
    echo "   Valeur Prod: postgresql://username:password@host:5432/administration_ga"
    echo ""

    # 3. NEXTAUTH_URL
    echo "✅ NEXTAUTH_URL:"
    echo "   Nom: NEXTAUTH_URL"
    echo "   Valeur Dev: http://localhost:3000"
    echo "   Valeur Prod: https://administration.ga"
    echo ""

    # 4. Clé SSH pour déploiement (optionnel)
    warning "Pour le déploiement automatique (optionnel):"
    echo "   Générer une clé SSH: ssh-keygen -t ed25519 -C 'deploy@administration.ga'"
    echo "   PRODUCTION_SSH_KEY: [contenu de la clé privée]"
    echo ""

    # 5. Résumé
    header "📋 Résumé - Secrets à Configurer dans GitHub"
    echo "Allez sur: https://github.com/[votre-username]/ADMINISTRATION.GA/settings/secrets/actions"
    echo ""
    echo "Secrets OBLIGATOIRES (éliminent les warnings) :"
    echo "1. DATABASE_URL = postgresql://postgres:password@localhost:5432/administration_ga"
    echo "2. NEXTAUTH_SECRET = $NEXTAUTH_SECRET"
    echo "3. NEXTAUTH_URL = https://administration.ga"
    echo ""
    echo "Secrets OPTIONNELS (pour déploiement plus tard) :"
    echo "4. PRODUCTION_HOST = administration.ga"
    echo "5. PRODUCTION_USER = deploy"
    echo "6. PRODUCTION_SSH_KEY = [clé SSH privée]"
    echo "7. SLACK_WEBHOOK_URL = [webhook Slack pour notifications]"
    echo ""
}

# ===============================================
# Vérification des outils
# ===============================================
check_tools() {
    log "Vérification des outils disponibles..."

    if command -v openssl &> /dev/null; then
        success "OpenSSL disponible"
    else
        error "OpenSSL non trouvé - installez-le pour générer des secrets forts"
        exit 1
    fi

    if command -v ssh-keygen &> /dev/null; then
        success "SSH-keygen disponible"
    else
        warning "SSH-keygen non trouvé - déploiement automatique non disponible"
    fi
}

# ===============================================
# Guide d'utilisation
# ===============================================
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  generate, -g     Générer les valeurs des secrets"
    echo "  guide, -guide    Afficher le guide de configuration"
    echo "  help, -h         Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 generate      # Générer tous les secrets"
    echo "  $0 guide         # Guide de configuration GitHub"
}

# ===============================================
# Guide de configuration GitHub
# ===============================================
show_github_guide() {
    header "📖 Guide Configuration GitHub Secrets"

    echo "1. 🌐 Aller sur GitHub :"
    echo "   https://github.com/[votre-username]/ADMINISTRATION.GA"
    echo ""

    echo "2. ⚙️ Accéder aux Secrets :"
    echo "   Settings → Secrets and variables → Actions"
    echo ""

    echo "3. ➕ Ajouter un Secret :"
    echo "   - Cliquer 'New repository secret'"
    echo "   - Entrer le NOM du secret"
    echo "   - Entrer la VALEUR du secret"
    echo "   - Cliquer 'Add secret'"
    echo ""

    echo "4. 🔁 Répéter pour chaque secret :"
    echo "   Configurez au minimum ces 3 secrets :"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET"
    echo "   - NEXTAUTH_URL"
    echo ""

    echo "5. ✅ Vérification :"
    echo "   - Les warnings GitHub disparaîtront"
    echo "   - Le build CI/CD passera au vert"
    echo "   - L'application fonctionnera correctement"
    echo ""

    success "Une fois configuré, votre CI/CD fonctionnera parfaitement ! 🚀"
}

# ===============================================
# Test de connectivité GitHub (optionnel)
# ===============================================
test_github_connection() {
    log "Test de connectivité GitHub..."

    if command -v gh &> /dev/null; then
        if gh auth status &> /dev/null; then
            success "GitHub CLI configuré et authentifié"
            warning "Vous pourriez configurer les secrets via CLI:"
            echo "   gh secret set DATABASE_URL --body 'postgresql://...'"
            echo "   gh secret set NEXTAUTH_SECRET --body '$NEXTAUTH_SECRET'"
        else
            warning "GitHub CLI installé mais non authentifié"
            echo "   Authentifiez-vous avec: gh auth login"
        fi
    else
        log "GitHub CLI non installé - configuration manuelle requise"
    fi
}

# ===============================================
# Fonction principale
# ===============================================
main() {
    case "${1:-help}" in
        "generate"|"-g")
            check_tools
            generate_secrets
            test_github_connection
            ;;
        "guide"|"-guide")
            show_github_guide
            ;;
        "help"|"-h"|*)
            show_usage
            ;;
    esac
}

# Exécuter la fonction principale
main "$@"
