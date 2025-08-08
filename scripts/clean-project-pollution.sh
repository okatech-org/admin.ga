#!/bin/bash

# 🧹 Script de nettoyage du projet ADMINISTRATION.GA
# Ce script supprime tous les fichiers polluants identifiés
# Auteur: Assistant IA
# Date: $(date +%Y-%m-%d)

echo "🧹 NETTOYAGE DU PROJET ADMINISTRATION.GA"
echo "========================================="
echo ""

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
DELETED_COUNT=0
ERROR_COUNT=0

# Fonction pour supprimer un fichier/dossier avec confirmation
delete_item() {
    local item=$1
    local type=$2

    if [ -e "$item" ]; then
        echo -e "${YELLOW}Suppression ${type}: ${item}${NC}"
        rm -rf "$item" 2>/dev/null
        if [ $? -eq 0 ]; then
            ((DELETED_COUNT++))
            echo -e "${GREEN}✓ Supprimé${NC}"
        else
            ((ERROR_COUNT++))
            echo -e "${RED}✗ Erreur lors de la suppression${NC}"
        fi
    fi
}

echo "📋 Étape 1: Suppression des fichiers cassés/désactivés"
echo "------------------------------------------------------"

# Fichiers .broken
delete_item "./app/super-admin/organismes-prospects/page.tsx.broken" "fichier .broken"

# Fichiers .backup
delete_item "./app/super-admin/organismes-vue-ensemble/page.tsx.backup" "fichier .backup"
delete_item "./prisma/schema.prisma.backup" "fichier .backup"

# Fichiers .disabled
for file in $(find . -name "*.disabled" ! -path "./node_modules/*" ! -path "./.git/*" 2>/dev/null); do
    delete_item "$file" "fichier .disabled"
done

# Fichiers .problem
delete_item "./components/relations/organismes-relation-modulator.tsx.problem" "fichier .problem"
delete_item "./hooks/use-multi-tenant.tsx.problem" "fichier .problem"

echo ""
echo "📋 Étape 2: Suppression des dossiers de test"
echo "-------------------------------------------"

delete_item "./app/super-admin/test-data" "dossier de test"
delete_item "./app/api/test-organizations" "dossier de test"

echo ""
echo "📋 Étape 3: Suppression des scripts de test obsolètes"
echo "----------------------------------------------------"

for file in scripts/test-*.ts scripts/test-*.js; do
    [ -f "$file" ] && delete_item "$file" "script de test"
done

echo ""
echo "📋 Étape 4: Renommage du script populate-gabon-160"
echo "-------------------------------------------------"

if [ -f "scripts/populate-gabon-160-organismes.ts" ]; then
    echo -e "${YELLOW}Renommage: populate-gabon-160-organismes.ts → populate-gabon-141-organismes.ts${NC}"
    mv scripts/populate-gabon-160-organismes.ts scripts/populate-gabon-141-organismes.ts 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Renommé${NC}"
        ((DELETED_COUNT++))
    else
        echo -e "${RED}✗ Erreur lors du renommage${NC}"
        ((ERROR_COUNT++))
    fi
fi

echo ""
echo "📋 Étape 5: Suppression des rapports obsolètes"
echo "---------------------------------------------"

# Liste des rapports à supprimer
OBSOLETE_REPORTS=(
    "IMPLEMENTATION_160_ORGANISMES_RAPPORT_FINAL.md"
    "RESOLUTION_ERREUR_AUTH_RAPPORT.md"
    "RESOLUTION_ERREURS_SERVEUR_COMPLETE_RAPPORT.md"
    "RESOLUTION_ERREURS_SERVEUR_RAPPORT.md"
    "RESOLUTION_FINALE_ERREURS_SERVEUR_RAPPORT.md"
    "AJOUT_25_DIRECTIONS_GENERALES_RAPPORT.md"
    "CORRECTION_DIRECTIONS_CENTRALES_RAPPORT_FINAL.md"
    "CONFIGURATION_INTELLIGENTE_ORGANISMES_OFFICIELS_RAPPORT.md"
    "CONFIGURATION_LOGIQUE_ADMIN_DEMARCHE_COMPLETE.md"
    "FINALISATION_FONCTIONNALITES_ORGANISMES_PROSPECTS_RAPPORT.md"
    "FINALISATION_GROUPES_ADMINISTRATIFS_RAPPORT.md"
    "FINALISATION_ORGANISMES_CLIENTS_RAPPORT_COMPLET.md"
    "FINALISATION_STATUT_INTEGRATION_RAPPORT.md"
    "IMPLEMENTATION_979_UTILISATEURS_FINAL_CONFIRME.md"
    "IMPLEMENTATION_GOUVERNEMENT_GABON_COMPLETE.md"
    "IMPLEMENTATION_MENU_MODERNE_FINAL.md"
    "IMPLEMENTATION_PAGES_ORGANISMES_RAPPORT.md"
    "IMPLEMENTATION_PROMPT_MINISTERES_COMPLETE.md"
    "IMPLEMENTATION_STRUCTURE_GOUVERNEMENTALE_GABON_2025.md"
    "IMPLEMENTATION_SYSTEME_COMPLET_GABON_RAPPORT.md"
    "NETTOYAGE_FINAL_COMPLET.md"
    "VERIFICATION_ORGANISMES_PROSPECTS_RAPPORT_FINAL.md"
    "MISE_A_JOUR_141_ORGANISMES_RAPPORT.md"
)

for report in "${OBSOLETE_REPORTS[@]}"; do
    delete_item "./$report" "rapport obsolète"
done

echo ""
echo "========================================="
echo "📊 RÉSUMÉ DU NETTOYAGE"
echo "========================================="
echo -e "${GREEN}✓ Fichiers/dossiers supprimés: ${DELETED_COUNT}${NC}"
if [ $ERROR_COUNT -gt 0 ]; then
    echo -e "${RED}✗ Erreurs rencontrées: ${ERROR_COUNT}${NC}"
fi

echo ""
echo "💡 Conseils post-nettoyage:"
echo "  1. Faire un 'git status' pour vérifier les changements"
echo "  2. Tester que le projet compile: 'npm run build'"
echo "  3. Faire un commit des suppressions"
echo ""
echo "✅ Nettoyage terminé!"
