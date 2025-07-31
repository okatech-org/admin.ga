# 🗄️ Guide d'Utilisation - Gestion Base de Données

## Vue d'ensemble

L'interface **Base de Données** vous permet de gérer facilement votre base de données Administration.GA sans connaissances techniques. Tout se fait en quelques clics !

## 📍 Accès à l'Interface

1. Connectez-vous avec un compte **Super Admin**
2. Dans le menu de gauche, cliquez sur **"Base de Données"**
3. L'interface s'ouvre avec 5 onglets principaux

## 🎯 Actions Rapides (En Un Clic)

### 💾 Sauvegarder vos Données

#### Bouton vert "Sauvegarder"
- Crée automatiquement un backup complet
- Sauvegarde dans `/backups/database/`
- Affiche le nom du fichier créé
- ✅ **Recommandé avant toute manipulation**

### 📤 Exporter vos Données

#### Bouton "Exporter SQL"
- Exporte en format SQL (compatible avec d'autres outils)
- Peut aussi exporter en CSV ou JSON
- Inclut la structure et les données
- Fichier téléchargeable automatiquement

### 🔄 Mettre à Jour la Structure

#### Bouton "Migrations"
- Applique les dernières mises à jour
- Met à jour automatiquement la base
- Sauvegarde automatique avant l'opération
- ✅ **Sécurisé avec rollback automatique**

### 📊 Voir l'État en Temps Réel

#### Bouton "Monitoring"
- Performance de la base de données
- Connexions actives
- Alertes et notifications
- État des sauvegardes

## 📋 Onglets Principaux

### 1. 🏠 **Tableau de Bord**
**Ce que vous voyez :**
- Nombre total de tables
- Nombre d'enregistrements 
- Taille de la base de données
- Connexions actives
- Dernier backup effectué

**Actions possibles :**
- Bouton "Actualiser" pour rafraîchir les données
- Vue d'ensemble de l'état du système

### 2. 📊 **Tables**
**Ce que vous voyez :**
- Liste de toutes vos tables
- Nombre de lignes par table
- Taille de chaque table
- Dernière mise à jour

**Actions possibles :**
- **Cliquer sur une table** pour voir ses données
- Informations détaillées sur chaque table

### 3. 👁️ **Données**
**Ce que vous voyez :**
- Contenu réel de la table sélectionnée
- Données sous forme de tableau lisible
- Informations formatées automatiquement

**Comment l'utiliser :**
1. Allez dans l'onglet "Tables"
2. Cliquez sur la table qui vous intéresse
3. Revenez à l'onglet "Données"
4. Explorez le contenu !

### 4. ⚡ **Requêtes**
**Pour les utilisateurs avancés :**
- Interface pour exécuter des requêtes SQL
- Exemples de requêtes prêtes à utiliser
- Résultats affichés en tableau

**Exemples de requêtes simples :**
```sql
-- Voir les utilisateurs
SELECT * FROM users LIMIT 10;

-- Compter les organisations
SELECT COUNT(*) as total FROM organizations;

-- Statistiques des demandes
SELECT status, COUNT(*) FROM service_requests GROUP BY status;
```

### 5. 📈 **Monitoring**
**Surveillance en temps réel :**
- Performance CPU/Mémoire
- Connexions actives
- Alertes système
- Actions de maintenance

## 🛠️ Actions de Maintenance

### 🧹 Nettoyer le Cache
- Améliore les performances
- Supprime les données temporaires
- À faire régulièrement

### 🔍 Analyser les Index
- Optimise les recherches
- Améliore la vitesse des requêtes
- Analyse automatique des performances

### 🛡️ Vérifier l'Intégrité
- Contrôle la cohérence des données
- Détecte les erreurs potentielles
- Rapport automatique généré

## 🎯 Cas d'Usage Courants

### 📋 **Voir combien d'utilisateurs vous avez**
1. Onglet "Tables" → Cliquer sur "users"
2. Onglet "Données" → Voir la liste complète
3. Le nombre total s'affiche en haut

### 🏢 **Vérifier vos organisations**
1. Onglet "Tables" → Cliquer sur "organizations" 
2. Onglet "Données" → Explorer les organismes
3. Voir les types, codes, statuts

### 📊 **Analyser l'activité IA**
1. Onglet "Tables" → Cliquer sur "ai_search_logs"
2. Voir les recherches effectuées
3. Analyser les performances de l'IA

### 💾 **Sauvegarder avant une mise à jour**
1. Bouton vert "Sauvegarder" (Actions Rapides)
2. Attendre la confirmation
3. Procéder à vos modifications

### 📤 **Exporter pour analyse externe**
1. Bouton "Exporter SQL" 
2. Choisir le format (SQL/CSV/JSON)
3. Télécharger le fichier généré

## ⚠️ Bonnes Pratiques

### ✅ **À FAIRE**
- **Toujours sauvegarder** avant toute manipulation
- Utiliser l'onglet "Monitoring" pour surveiller les performances
- Vérifier régulièrement l'espace disque disponible
- Nettoyer le cache périodiquement

### ❌ **À ÉVITER**
- Modifier directement les données sans backup
- Exécuter des requêtes complexes sans comprendre leur impact
- Ignorer les alertes du monitoring
- Supprimer des tables sans certitude

## 🆘 En Cas de Problème

### 🔧 **Problème de Connexion**
1. Actualiser la page (bouton "Actualiser")
2. Vérifier l'onglet "Monitoring" pour les alertes
3. Contacter l'administrateur technique

### 📊 **Données Manquantes**
1. Onglet "Tables" → Vérifier si la table existe
2. Onglet "Requêtes" → Exécuter une requête simple
3. Vérifier les permissions d'accès

### 💾 **Backup Échoué**
1. Vérifier l'espace disque disponible
2. Consulter l'onglet "Monitoring" pour les erreurs
3. Réessayer avec un backup partiel

## 📞 Support

En cas de problème persistant :
- **Email technique :** devops@administration.ga
- **Documentation complète :** `/docs/DEPLOYMENT_GUIDE.md`
- **Logs détaillés :** Onglet "Monitoring" → Section Alertes

---

## 🎉 Félicitations

Vous maîtrisez maintenant l'interface de gestion de base de données Administration.GA ! 

Cette interface vous donne un **contrôle total** sur vos données tout en restant **simple et sécurisée**. 🇬🇦

---

*Dernière mise à jour : Novembre 2024* 
