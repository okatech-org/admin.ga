# 🎛️ Guide de l'Interface d'Administration Web

## 📋 Vue d'ensemble

L'Interface d'Administration Web vous permet de modifier et personnaliser complètement les applications **ADMINISTRATION.GA** et **DEMARCHE.GA** depuis une interface web intuitive.

## 🚀 Accès à l'Interface

### URL d'accès
```
http://localhost:3000/admin-web
```

### Prérequis
- Compte super administrateur
- Droits d'administration sur les applications
- Navigateur web moderne

## 🎨 Sections Disponibles

### 1. 📷 Logos & Assets

**Gestion des éléments visuels**

#### Fonctionnalités :
- **Upload de logos** pour ADMINISTRATION.GA et DEMARCHE.GA
- **Gestion des favicons** 
- **Configuration des couleurs** du thème (primaire, secondaire, accent)
- **Aperçu en temps réel** des modifications

#### Types de fichiers supportés :
- **Logos** : PNG, SVG, JPG (recommandé : PNG avec transparence)
- **Favicon** : ICO, PNG 16x16, 32x32
- **Tailles recommandées** : 512x512px pour les logos principaux

#### Couleurs par défaut :
- **ADMINISTRATION.GA** : Couleurs du drapeau gabonais
  - Vert : `#009E49`
  - Jaune : `#FFD700` 
  - Bleu : `#3A75C4`

- **DEMARCHE.GA** : Thème citoyen
  - Bleu : `#1E40AF`
  - Vert : `#10B981`
  - Orange : `#F59E0B`

### 2. 🎨 Apparence

**Configuration des textes et descriptions**

#### Paramètres modifiables :
- **Nom de l'application**
- **Sous-titre** (ex: "République Gabonaise")
- **Description** détaillée
- **Métadonnées** pour le SEO

#### Aperçu immédiat :
Les modifications sont visibles instantanément dans la section d'aperçu.

### 3. 📋 Menus

**Gestion de la navigation**

#### Fonctionnalités :
- **Réorganisation par glisser-déposer** des éléments de menu
- **Ajout/suppression** d'éléments de menu
- **Visibilité** (masquer/afficher les éléments)
- **Configuration des icônes** (bibliothèque d'icônes intégrée)
- **Gestion séparée** pour ADMIN.GA et DEMARCHE.GA

#### Propriétés des menus :
- **Libellé** : Texte affiché
- **URL** : Lien de destination
- **Icône** : Choisie parmi 12+ options
- **Visibilité** : Actif/Inactif
- **Ordre** : Position dans le menu

#### Icônes disponibles :
- Home, Users, Building2, BarChart3
- Settings, FileText, Bell, Globe
- Shield, Database, Layout, Search

### 4. 📄 Contenu

**Gestion des pages et articles**

#### Types de contenu :
- **Pages** : Contenu statique (À propos, Aide, etc.)
- **Actualités** : Articles d'information
- **Annonces** : Communications importantes

#### Fonctionnalités d'édition :
- **Éditeur de texte** complet
- **Système de tags** pour la catégorisation
- **Publication/brouillon**
- **Génération automatique de slug** (URL)
- **Multi-application** (ADMIN.GA, DEMARCHE.GA ou les deux)

#### Métadonnées :
- **Titre**, **contenu**, **auteur**
- **Date de création/modification**
- **Tags** pour la recherche
- **Slug personnalisable**

### 5. 📢 Actualités

**Gestion des news et communications**

#### Fonctionnalités :
- **Publication d'actualités**
- **Annonces système**
- **Gestion des catégories**
- **Planification de publication**
- **Notifications push** (optionnel)

#### Workflow :
1. **Rédaction** en mode brouillon
2. **Prévisualisation** du contenu
3. **Publication** immédiate ou programmée
4. **Diffusion** sur les applications concernées

### 6. ⚙️ Paramètres

**Configuration système**

#### Paramètres généraux :
- **Mode maintenance** : Désactiver temporairement l'accès
- **Notifications email** : Activer/désactiver les alertes
- **Analytics** : Suivi de l'utilisation
- **Logs système** : Enregistrement des événements

#### Sécurité :
- **Authentification 2FA** : Double authentification
- **Session timeout** : Durée des sessions (30min à 4h)
- **Logs de sécurité** : Traçabilité des connexions

## 🛠️ Utilisation Pratique

### Modifier un Logo

1. **Aller dans l'onglet "Logos & Assets"**
2. **Choisir l'application** (ADMIN.GA ou DEMARCHE.GA)
3. **Cliquer sur "Changer le logo"**
4. **Sélectionner votre fichier** (PNG recommandé)
5. **Voir l'aperçu** en temps réel
6. **Cliquer "Sauvegarder"**

### Ajouter un Menu

1. **Aller dans l'onglet "Menus"**
2. **Descendre à "Ajouter un Menu"**
3. **Remplir les champs** :
   - Libellé : "Mon nouveau menu"
   - URL : "/mon-url"
   - Icône : Choisir dans la liste
   - Application : ADMIN.GA ou DEMARCHE.GA
4. **Cocher "Visible par défaut"**
5. **Cliquer "Ajouter le menu"**

### Créer une Page

1. **Aller dans l'onglet "Contenu"**
2. **Cliquer sur "Ajouter du contenu"**
3. **Remplir le formulaire** :
   - Titre : "Ma nouvelle page"
   - Type : "Page"
   - Application : Choisir la cible
   - Contenu : Rédiger le texte
4. **Ajouter des tags** si nécessaire
5. **Activer "Publier immédiatement"**
6. **Cliquer "Ajouter le contenu"**

### Publier une Actualité

1. **Onglet "Actualités"**
2. **"Ajouter une actualité"**
3. **Saisir titre et contenu**
4. **Choisir la catégorie**
5. **Programmer ou publier immédiatement**

## 🔧 Fonctionnalités Avancées

### Aperçu en Temps Réel
- **Visualisation immédiate** des changements
- **Mode aperçu** pour tester avant publication
- **Responsive design** automatique

### Gestion des Versions
- **Historique des modifications**
- **Dates de création/modification**
- **Suivi des auteurs**

### Multi-Application
- **Gestion centralisée** des deux applications
- **Paramètres spécifiques** par application
- **Synchronisation** optionnelle du contenu

## 🚨 Bonnes Pratiques

### Logos et Images
- **Utilisez des PNG** avec transparence pour les logos
- **Optimisez la taille** des fichiers (< 100KB)
- **Respectez les proportions** (format carré recommandé)
- **Testez sur différents fonds** (clair/sombre)

### Contenu
- **Rédigez des titres clairs** et descriptifs
- **Utilisez des tags pertinents** pour la recherche
- **Prévisualisez** avant publication
- **Gardez une cohérence** dans le style rédactionnel

### Menus
- **Limitez le nombre d'éléments** (5-7 maximum)
- **Utilisez des libellés courts** et compréhensibles
- **Organisez logiquement** la hiérarchie
- **Testez la navigation** sur mobile

### Sécurité
- **Sauvegardez régulièrement** vos modifications
- **Utilisez le mode maintenance** pour les gros changements
- **Vérifiez les permissions** des utilisateurs
- **Surveillez les logs** de sécurité

## 🔄 Workflow Recommandé

### Mise à Jour Majeure
1. **Activer le mode maintenance**
2. **Effectuer les modifications** en mode brouillon
3. **Tester en mode aperçu**
4. **Publier les changements**
5. **Désactiver le mode maintenance**
6. **Vérifier le bon fonctionnement**

### Mise à Jour Mineure
1. **Modifier directement** les éléments
2. **Sauvegarder au fur et à mesure**
3. **Utiliser l'aperçu temps réel**
4. **Publier immédiatement**

## 📞 Support et Dépannage

### Problèmes Courants

**Logo ne s'affiche pas :**
- Vérifier le format du fichier (PNG recommandé)
- Contrôler la taille (< 5MB)
- Vider le cache du navigateur

**Menu ne se met pas à jour :**
- Cliquer sur "Sauvegarder les menus"
- Vérifier que l'élément est "Visible"
- Rafraîchir la page

**Contenu non publié :**
- Vérifier le statut "Publié"
- Contrôler l'application cible
- Vérifier les permissions

### Contact
Pour toute assistance technique, contactez l'équipe de développement via les logs système ou les paramètres de l'interface.

---

**🎉 Félicitations !** Vous disposez maintenant d'un environnement complet pour personnaliser vos applications ADMINISTRATION.GA et DEMARCHE.GA selon vos besoins.
