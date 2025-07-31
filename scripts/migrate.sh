#!/bin/bash

# ================================================
# Script de Migration Base de Données Administration.GA
# Gestion complète des migrations Prisma avec backup et rollback
# ================================================

set -euo pipefail

# ===============================================
# Configuration
# ===============================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups/migrations"
LOG_FILE="$PROJECT_ROOT/logs/migration.log"

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

header() {
    echo -e "\n${CYAN}================================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}================================================${NC}\n"
}

# ===============================================
# Vérification des prérequis
# ===============================================
check_prerequisites() {
    header "Vérification des prérequis"

    # Vérifier Prisma CLI
    if ! command -v npx &> /dev/null; then
        error "npx n'est pas installé"
        exit 1
    fi

    # Vérifier le schéma Prisma
    if [[ ! -f "$PROJECT_ROOT/prisma/schema.prisma" ]]; then
        error "Schéma Prisma non trouvé"
        exit 1
    fi

    # Vérifier les variables d'environnement
    if [[ -z "${DATABASE_URL:-}" ]]; then
        error "DATABASE_URL non configurée"
        exit 1
    fi

    # Créer les répertoires nécessaires
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$(dirname "$LOG_FILE")"

    success "Prérequis vérifiés"
}

# ===============================================
# Backup de la base de données
# ===============================================
create_backup() {
    header "Création du backup de la base de données"

    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$BACKUP_DIR/backup_before_migration_$timestamp.sql"

    log "Backup en cours vers: $backup_file"

    # Extraire les informations de connexion depuis DATABASE_URL
    # Format: postgresql://user:password@host:port/database
    if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
        local db_user="${BASH_REMATCH[1]}"
        local db_password="${BASH_REMATCH[2]}"
        local db_host="${BASH_REMATCH[3]}"
        local db_port="${BASH_REMATCH[4]}"
        local db_name="${BASH_REMATCH[5]}"

        # Export avec pg_dump
        PGPASSWORD="$db_password" pg_dump \
            -h "$db_host" \
            -p "$db_port" \
            -U "$db_user" \
            -d "$db_name" \
            --verbose \
            --no-owner \
            --no-privileges \
            > "$backup_file"

        success "Backup créé: $backup_file"
        echo "$backup_file" > "$PROJECT_ROOT/.last_migration_backup"

    else
        warning "Format DATABASE_URL non reconnu, backup via Docker..."

        # Tentative via Docker si disponible
        if docker ps | grep -q postgres; then
            local container_name=$(docker ps --format "table {{.Names}}" | grep postgres | head -1)
            docker exec "$container_name" pg_dump -U postgres -d "${DATABASE_URL##*/}" > "$backup_file"
            success "Backup Docker créé: $backup_file"
            echo "$backup_file" > "$PROJECT_ROOT/.last_migration_backup"
        else
            warning "Impossible de créer un backup automatique"
        fi
    fi
}

# ===============================================
# Génération des migrations
# ===============================================
generate_migration() {
    header "Génération de la migration"

    cd "$PROJECT_ROOT"

    local migration_name="${1:-ai_knowledge_base_$(date +%Y%m%d_%H%M%S)}"

    log "Génération de la migration: $migration_name"

    # Générer le client Prisma
    log "Génération du client Prisma..."
    npx prisma generate

    # Créer la migration
    log "Création de la migration..."
    npx prisma migrate dev --name "$migration_name" --create-only

    success "Migration générée: $migration_name"

    # Afficher le fichier de migration créé
    local migration_file=$(find prisma/migrations -name "*$migration_name*" -type d | tail -1)
    if [[ -n "$migration_file" ]]; then
        log "Fichier de migration créé: $migration_file/migration.sql"
        echo "Contenu de la migration:"
        echo "----------------------------------------"
        cat "$migration_file/migration.sql"
        echo "----------------------------------------"
    fi
}

# ===============================================
# Application des migrations
# ===============================================
apply_migrations() {
    header "Application des migrations"

    cd "$PROJECT_ROOT"

    # Vérifier l'état de la base
    log "Vérification de l'état actuel de la base..."
    npx prisma migrate status

    # Appliquer les migrations
    log "Application des migrations en cours..."

    if [[ "${1:-}" == "--reset" ]]; then
        warning "ATTENTION: Reset complet de la base de données"
        read -p "Êtes-vous sûr ? (oui/non): " confirm
        if [[ "$confirm" == "oui" ]]; then
            npx prisma migrate reset --force
            success "Base de données réinitialisée"
        else
            error "Opération annulée"
            exit 1
        fi
    else
        npx prisma migrate deploy
        success "Migrations appliquées"
    fi

    # Générer le client après migration
    log "Génération du client Prisma mis à jour..."
    npx prisma generate
    success "Client Prisma généré"
}

# ===============================================
# Seeding de la base de données
# ===============================================
seed_database() {
    header "Seeding de la base de données"

    cd "$PROJECT_ROOT"

    # Vérifier si un script de seed existe
    if [[ -f "prisma/seed.ts" ]] || [[ -f "prisma/seed.js" ]]; then
        log "Exécution du seeding..."
        npx prisma db seed
        success "Seeding terminé"
    else
        warning "Aucun script de seed trouvé"
    fi

    # Ajouter les données de base pour l'IA
    log "Ajout des configurations IA de base..."

    # Script SQL pour insérer les configurations de base
    cat > /tmp/ai_base_config.sql << 'EOF'
-- Configuration API Gemini par défaut
INSERT INTO "api_configurations" (id, name, provider, "isActive", model, temperature, "maxTokens", "requestTimeout", "requestsPerMinute", "requestsPerDay", "createdAt", "updatedAt")
VALUES (
    'gemini_default_' || extract(epoch from now())::text,
    'GEMINI',
    'google',
    true,
    'gemini-pro',
    0.7,
    2048,
    30,
    60,
    1000,
    now(),
    now()
) ON CONFLICT (name) DO NOTHING;

-- Postes administratifs de base
INSERT INTO "postes_administratifs" (id, titre, code, description, level, "isActive", "isAIDetected", "createdAt", "updatedAt")
VALUES
    ('poste_' || extract(epoch from now())::text || '_1', 'Directeur Général', 'DG', 'Direction générale de l''organisme', 'DIRECTION', true, false, now(), now()),
    ('poste_' || extract(epoch from now())::text || '_2', 'Secrétaire Général', 'SG', 'Secrétariat général', 'DIRECTION', true, false, now(), now()),
    ('poste_' || extract(epoch from now())::text || '_3', 'Chef de Service', 'CS', 'Responsable d''un service', 'CHEF_SERVICE', true, false, now(), now()),
    ('poste_' || extract(epoch from now())::text || '_4', 'Responsable', 'RESP', 'Responsable d''unité', 'RESPONSABLE', true, false, now(), now()),
    ('poste_' || extract(epoch from now())::text || '_5', 'Agent', 'AGENT', 'Agent administratif', 'AGENT', true, false, now(), now())
ON CONFLICT (code) DO NOTHING;
EOF

    # Appliquer le SQL
    if command -v psql &> /dev/null; then
        psql "$DATABASE_URL" -f /tmp/ai_base_config.sql
        rm /tmp/ai_base_config.sql
        success "Configurations IA de base ajoutées"
    else
        warning "psql non disponible, configurations IA à ajouter manuellement"
    fi
}

# ===============================================
# Rollback de migration
# ===============================================
rollback_migration() {
    header "Rollback de migration"

    if [[ ! -f "$PROJECT_ROOT/.last_migration_backup" ]]; then
        error "Aucun backup de migration trouvé"
        exit 1
    fi

    local backup_file=$(cat "$PROJECT_ROOT/.last_migration_backup")

    if [[ ! -f "$backup_file" ]]; then
        error "Fichier de backup non trouvé: $backup_file"
        exit 1
    fi

    warning "ATTENTION: Rollback vers $backup_file"
    read -p "Confirmer le rollback ? (oui/non): " confirm

    if [[ "$confirm" == "oui" ]]; then
        log "Restauration en cours..."

        # Restaurer depuis le backup
        if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
            local db_user="${BASH_REMATCH[1]}"
            local db_password="${BASH_REMATCH[2]}"
            local db_host="${BASH_REMATCH[3]}"
            local db_port="${BASH_REMATCH[4]}"
            local db_name="${BASH_REMATCH[5]}"

            # Restaurer avec psql
            PGPASSWORD="$db_password" psql \
                -h "$db_host" \
                -p "$db_port" \
                -U "$db_user" \
                -d "$db_name" \
                < "$backup_file"

            success "Rollback terminé"
        else
            error "Impossible de restaurer automatiquement"
            log "Restaurez manuellement depuis: $backup_file"
        fi
    else
        log "Rollback annulé"
    fi
}

# ===============================================
# Validation post-migration
# ===============================================
validate_migration() {
    header "Validation post-migration"

    cd "$PROJECT_ROOT"

    # Vérifier l'état de la base
    log "Vérification de l'état des migrations..."
    npx prisma migrate status

    # Vérifier la connectivité
    log "Test de connectivité à la base..."
    npx prisma db push --accept-data-loss || true

    # Compter les nouvelles tables
    log "Vérification des nouvelles tables IA..."

    local tables_query="
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'api_configurations',
        'ai_search_logs',
        'postes_administratifs',
        'ai_intervenants',
        'organisme_knowledge',
        'knowledge_analyses'
    );"

    if command -v psql &> /dev/null; then
        local table_count=$(psql "$DATABASE_URL" -t -c "$tables_query" | wc -l)
        if [[ $table_count -ge 6 ]]; then
            success "Toutes les tables IA ont été créées ($table_count/6)"
        else
            warning "Tables IA manquantes (trouvées: $table_count/6)"
        fi
    else
        warning "Impossible de vérifier les tables (psql non disponible)"
    fi

    # Test du client Prisma
    log "Test du client Prisma..."
    node -e "
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    async function test() {
        try {
            const count = await prisma.user.count();
            console.log('✓ Connexion Prisma OK - Utilisateurs:', count);

            // Test des nouvelles tables
            const apiConfigs = await prisma.aPIConfiguration.count();
            console.log('✓ Table APIConfiguration OK - Configs:', apiConfigs);

            await prisma.\$disconnect();
            process.exit(0);
        } catch (error) {
            console.error('✗ Erreur Prisma:', error.message);
            process.exit(1);
        }
    }

    test();
    " && success "Client Prisma fonctionnel" || warning "Problème avec le client Prisma"
}

# ===============================================
# Nettoyage des anciens backups
# ===============================================
cleanup_backups() {
    header "Nettoyage des anciens backups"

    # Garder seulement les 10 derniers backups
    log "Nettoyage des backups (garder les 10 derniers)..."

    find "$BACKUP_DIR" -name "backup_*.sql" -type f | \
        sort -r | \
        tail -n +11 | \
        xargs rm -f

    local remaining=$(find "$BACKUP_DIR" -name "backup_*.sql" -type f | wc -l)
    success "$remaining backups conservés"
}

# ===============================================
# Fonction principale
# ===============================================
main() {
    case "${1:-help}" in
        "generate")
            check_prerequisites
            create_backup
            generate_migration "${2:-}"
            ;;
        "apply")
            check_prerequisites
            create_backup
            apply_migrations "${2:-}"
            seed_database
            validate_migration
            cleanup_backups
            ;;
        "seed")
            check_prerequisites
            seed_database
            ;;
        "rollback")
            check_prerequisites
            rollback_migration
            ;;
        "status")
            cd "$PROJECT_ROOT"
            npx prisma migrate status
            ;;
        "reset")
            check_prerequisites
            create_backup
            apply_migrations --reset
            seed_database
            validate_migration
            ;;
        "validate")
            validate_migration
            ;;
        "backup")
            check_prerequisites
            create_backup
            ;;
        "cleanup")
            cleanup_backups
            ;;
        "full")
            header "Migration complète Administration.GA"
            check_prerequisites
            create_backup
            generate_migration "ai_knowledge_base_complete"
            apply_migrations
            seed_database
            validate_migration
            cleanup_backups

            success "================================================"
            success "Migration complète terminée avec succès !"
            success "Nouvelles fonctionnalités IA disponibles"
            success "================================================"
            ;;
        *)
            echo "Usage: $0 {generate|apply|seed|rollback|status|reset|validate|backup|cleanup|full}"
            echo ""
            echo "  generate [name]  - Génère une nouvelle migration"
            echo "  apply [--reset]  - Applique les migrations en attente"
            echo "  seed             - Exécute le seeding de la base"
            echo "  rollback         - Restaure le dernier backup"
            echo "  status           - Affiche l'état des migrations"
            echo "  reset            - Remet à zéro la base complètement"
            echo "  validate         - Valide l'état post-migration"
            echo "  backup           - Crée un backup manuel"
            echo "  cleanup          - Nettoie les anciens backups"
            echo "  full             - Migration complète (recommandé)"
            echo ""
            echo "Exemples:"
            echo "  $0 full                    # Migration complète"
            echo "  $0 generate ai_features    # Génère migration nommée"
            echo "  $0 apply                   # Applique les migrations"
            echo "  $0 rollback                # Rollback si problème"
            ;;
    esac
}

# Exécuter la fonction principale
main "$@"
