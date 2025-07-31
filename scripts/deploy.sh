#!/bin/bash

# ================================================
# Script de déploiement Administration.GA
# Déploiement automatisé avec vérifications et rollback
# ================================================

set -euo pipefail

# ===============================================
# Configuration
# ===============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
APP_NAME="administration-ga"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"
BACKUP_DIR="/var/backups/$APP_NAME"
LOG_FILE="/var/log/$APP_NAME/deploy.log"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ===============================================
# Fonctions utilitaires
# ===============================================
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[⚠]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[✗]${NC} $1" | tee -a "$LOG_FILE"
}

check_requirements() {
    log "Vérification des prérequis..."

    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        error "Docker n'est pas installé"
        exit 1
    fi

    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose n'est pas installé"
        exit 1
    fi

    # Vérifier les permissions
    if [[ $EUID -eq 0 ]]; then
        warning "Déploiement en tant que root détecté"
    fi

    # Vérifier l'espace disque
    AVAILABLE_SPACE=$(df / | tail -1 | awk '{print $4}')
    if [[ $AVAILABLE_SPACE -lt 2097152 ]]; then  # 2GB en KB
        error "Espace disque insuffisant (minimum 2GB requis)"
        exit 1
    fi

    success "Prérequis vérifiés"
}

# ===============================================
# Backup automatique
# ===============================================
create_backup() {
    log "Création du backup avant déploiement..."

    BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/backup_$BACKUP_TIMESTAMP"

    mkdir -p "$BACKUP_PATH"

    # Backup de la base de données
    if docker ps | grep -q "administration-ga-postgres"; then
        log "Backup de la base de données..."
        docker exec administration-ga-postgres pg_dump -U postgres administration_ga > "$BACKUP_PATH/database.sql"
        success "Base de données sauvegardée"
    else
        warning "Container PostgreSQL non trouvé, backup ignoré"
    fi

    # Backup des uploads
    if [[ -d "/var/lib/docker/volumes/administration-app-uploads" ]]; then
        log "Backup des fichiers uploadés..."
        cp -r /var/lib/docker/volumes/administration-app-uploads "$BACKUP_PATH/uploads"
        success "Fichiers uploadés sauvegardés"
    fi

    # Backup de la configuration
    if [[ -f "$PROJECT_ROOT/.env" ]]; then
        cp "$PROJECT_ROOT/.env" "$BACKUP_PATH/.env.backup"
        success "Configuration sauvegardée"
    fi

    echo "$BACKUP_PATH" > "$PROJECT_ROOT/.last_backup"
    success "Backup créé: $BACKUP_PATH"
}

# ===============================================
# Déploiement principal
# ===============================================
deploy() {
    log "Début du déploiement..."

    cd "$PROJECT_ROOT"

    # Vérifier le fichier docker-compose
    if [[ ! -f "$DOCKER_COMPOSE_FILE" ]]; then
        error "Fichier docker-compose.yml non trouvé"
        exit 1
    fi

    # Arrêter les services existants
    log "Arrêt des services existants..."
    docker-compose down --remove-orphans || true

    # Nettoyer les images inutilisées
    log "Nettoyage des images Docker..."
    docker system prune -f --volumes || true

    # Pull des nouvelles images
    log "Téléchargement des nouvelles images..."
    docker-compose pull

    # Générer le client Prisma
    log "Génération du client Prisma..."
    docker-compose run --rm app npx prisma generate || true

    # Exécuter les migrations
    log "Exécution des migrations de base de données..."
    docker-compose run --rm app npx prisma migrate deploy || true

    # Démarrer les services
    log "Démarrage des services..."
    docker-compose up -d

    success "Services démarrés"
}

# ===============================================
# Vérifications post-déploiement
# ===============================================
health_check() {
    log "Vérification de la santé de l'application..."

    local max_attempts=30
    local attempt=1

    while [[ $attempt -le $max_attempts ]]; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            success "Application démarrée avec succès"
            return 0
        fi

        log "Tentative $attempt/$max_attempts - En attente..."
        sleep 10
        ((attempt++))
    done

    error "L'application ne répond pas après $max_attempts tentatives"
    return 1
}

# ===============================================
# Rollback en cas d'échec
# ===============================================
rollback() {
    error "Échec du déploiement, rollback en cours..."

    if [[ -f "$PROJECT_ROOT/.last_backup" ]]; then
        LAST_BACKUP=$(cat "$PROJECT_ROOT/.last_backup")

        if [[ -d "$LAST_BACKUP" ]]; then
            log "Restauration depuis $LAST_BACKUP..."

            # Arrêter les services
            docker-compose down

            # Restaurer la base de données
            if [[ -f "$LAST_BACKUP/database.sql" ]]; then
                log "Restauration de la base de données..."
                docker-compose up -d postgres
                sleep 10
                docker exec -i administration-ga-postgres psql -U postgres administration_ga < "$LAST_BACKUP/database.sql"
            fi

            # Restaurer les uploads
            if [[ -d "$LAST_BACKUP/uploads" ]]; then
                log "Restauration des fichiers uploadés..."
                rm -rf /var/lib/docker/volumes/administration-app-uploads
                cp -r "$LAST_BACKUP/uploads" /var/lib/docker/volumes/administration-app-uploads
            fi

            # Redémarrer avec l'ancienne version
            docker-compose up -d

            success "Rollback terminé"
        else
            error "Backup non trouvé, rollback impossible"
        fi
    else
        error "Aucun backup disponible pour le rollback"
    fi
}

# ===============================================
# Nettoyage post-déploiement
# ===============================================
cleanup() {
    log "Nettoyage post-déploiement..."

    # Nettoyer les anciens backups (garder 7 jours)
    find "$BACKUP_DIR" -type d -name "backup_*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true

    # Nettoyer les logs anciens (garder 30 jours)
    find "/var/log/$APP_NAME" -type f -name "*.log" -mtime +30 -delete 2>/dev/null || true

    # Nettoyer les images Docker inutilisées
    docker image prune -f --filter "until=24h" || true

    success "Nettoyage terminé"
}

# ===============================================
# Notifications
# ===============================================
send_notification() {
    local status=$1
    local message=$2

    # Notification Slack si configurée
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 Déploiement Administration.GA - $status: $message\"}" \
            "$SLACK_WEBHOOK_URL" &> /dev/null || true
    fi

    # Notification par email si configurée
    if command -v mail &> /dev/null && [[ -n "${ADMIN_EMAIL:-}" ]]; then
        echo "$message" | mail -s "Déploiement Administration.GA - $status" "$ADMIN_EMAIL" || true
    fi
}

# ===============================================
# Fonction principale
# ===============================================
main() {
    log "================================================"
    log "Démarrage du déploiement Administration.GA"
    log "================================================"

    # Créer les répertoires nécessaires
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$(dirname "$LOG_FILE")"

    # Trap pour rollback en cas d'erreur
    trap 'rollback; send_notification "ÉCHEC" "Le déploiement a échoué et un rollback a été effectué"' ERR

    # Étapes de déploiement
    check_requirements
    create_backup
    deploy

    # Vérifications
    if health_check; then
        cleanup
        send_notification "SUCCÈS" "Déploiement réussi - Application opérationnelle"
        success "================================================"
        success "Déploiement terminé avec succès !"
        success "Application disponible sur: http://localhost:3000"
        success "Monitoring: http://localhost:3001"
        success "================================================"
    else
        rollback
        send_notification "ÉCHEC" "Health check échoué - Rollback effectué"
        exit 1
    fi
}

# ===============================================
# Options de ligne de commande
# ===============================================
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "health")
        health_check
        ;;
    "backup")
        create_backup
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|health|backup|cleanup}"
        echo ""
        echo "  deploy   - Déploie l'application (défaut)"
        echo "  rollback - Effectue un rollback vers la dernière version"
        echo "  health   - Vérifie la santé de l'application"
        echo "  backup   - Crée un backup manuel"
        echo "  cleanup  - Nettoie les fichiers temporaires"
        exit 1
        ;;
esac
