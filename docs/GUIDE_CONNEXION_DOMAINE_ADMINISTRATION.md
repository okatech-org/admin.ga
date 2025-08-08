# Guide de Connexion du Domaine ADMINISTRATION.GA

## 🎯 Vue d'ensemble

Ce guide vous accompagne dans la configuration et la connexion de votre domaine `administration.ga` acheté sur Netim.com à votre plateforme ADMINISTRATION.GA.

## 📋 Prérequis

### 1. Domaine Netim.com
- ✅ Domaine `administration.ga` acheté sur Netim.com
- ✅ Accès à l'interface de gestion Netim
- ✅ Clés API Netim (optionnel pour l'automatisation)

### 2. Serveur de déploiement
- ✅ Serveur VPS/dédié avec IP fixe
- ✅ Accès SSH root ou sudo
- ✅ Docker installé (recommandé)
- ✅ Nginx installé
- ✅ Certbot pour SSL (installé automatiquement)

### 3. Variables d'environnement
```bash
# .env
NETIM_API_KEY="votre-clé-api-netim"
NETIM_API_SECRET="votre-secret-api-netim"
NETIM_API_URL="https://api.netim.com/v1"

# Configuration serveur
SERVER_IP="192.168.1.100"  # Remplacez par votre IP
SSH_USERNAME="root"
SSH_KEY_PATH="/chemin/vers/votre/clé/ssh"
```

## 🚀 Démarrage Rapide

### Étape 1: Accéder à l'interface de configuration
1. Démarrez votre application Next.js:
   ```bash
   npm run dev
   ```

2. Naviguez vers la page de configuration:
   ```
   http://localhost:3000/admin-web/config/administration.ga
   ```

3. Cliquez sur l'onglet **"Domaines"**

### Étape 2: Configuration du domaine
1. **Nom de domaine**: `administration.ga` (pré-rempli)
2. **Adresse IP du serveur**: Entrez l'IP de votre serveur de production
3. **SSL/HTTPS**: Activé par défaut (recommandé)
4. **Configuration automatique**: Activé pour une configuration complète

### Étape 3: Lancer la configuration
1. Cliquez sur **"Démarrer la Configuration"**
2. Le processus suivra automatiquement ces étapes:
   - ⚙️ Configuration initiale
   - 🌐 Configuration DNS
   - 🔒 Installation du certificat SSL
   - 🚀 Déploiement de l'application
   - ✅ Finalisation

### Étape 4: Configuration DNS chez Netim
Pendant que la configuration se déroule, configurez vos DNS chez Netim.com:

1. **Connectez-vous à votre interface Netim.com**
2. **Allez dans la gestion de votre domaine `administration.ga`**
3. **Section DNS**: Configurez les enregistrements suivants:

```
Type: A
Nom: @
Valeur: [IP_DE_VOTRE_SERVEUR]
TTL: 3600

Type: CNAME
Nom: www
Valeur: administration.ga
TTL: 3600
```

## 🔧 Configuration Manuelle (Optionnel)

Si vous préférez une configuration manuelle ou en cas de problème:

### Via l'interface web
1. Remplissez les champs de configuration
2. Décochez "Configuration automatique complète"
3. Suivez chaque étape individuellement:
   - Configurez DNS → Cliquez "Vérifier"
   - Installez SSL → Cliquez "Installer"
   - Déployez → Vérifiez le statut

### Via les scripts
```bash
# Configuration complète automatique
npx ts-node scripts/setup-netim-domain.ts \
  --domain=administration.ga \
  --ip=192.168.1.100 \
  --app=administration \
  --ssl

# Test des APIs
node scripts/test-administration-domain.js
```

## 📊 Surveillance et Maintenance

### Interface de surveillance
L'onglet "Domaines" fournit:
- ✅ **Statut en temps réel** du domaine
- 📈 **Métriques de santé** du serveur
- 📋 **Logs de déploiement** détaillés
- 🔄 **Actions rapides** (redémarrage, rollback)

### Vérifications automatiques
Le système vérifie automatiquement:
- 🌐 Résolution DNS
- 🔒 Validité du certificat SSL
- 💓 Santé du serveur
- 📡 Connectivité de l'application

## 🚨 Dépannage

### Problème: DNS ne se résout pas
**Solution:**
1. Vérifiez la configuration Netim.com
2. Attendez la propagation DNS (jusqu'à 48h)
3. Testez avec: `nslookup administration.ga`
4. Utilisez le bouton "Vérifier" dans l'interface

### Problème: Certificat SSL échoue
**Solution:**
1. Assurez-vous que le DNS pointe vers votre serveur
2. Vérifiez que les ports 80 et 443 sont ouverts
3. Relancez l'installation SSL via l'interface
4. Vérifiez les logs du serveur

### Problème: Application inaccessible
**Solution:**
1. Vérifiez que le serveur est démarré
2. Contrôlez la configuration Nginx
3. Vérifiez les logs Docker/application
4. Utilisez l'action "Redémarrer" dans l'interface

## 📞 Support et Logs

### Logs détaillés
Accédez aux logs via:
- 🖥️ Interface web: Onglet "Domaines" → Section "Déploiement"
- 🔧 API: `GET /api/domain-management/deploy?domainId=X&type=deployment`
- 📁 Serveur: `/var/log/nginx/`, `docker logs`

### Commandes utiles
```bash
# Vérifier le statut Nginx
sudo systemctl status nginx

# Recharger la configuration Nginx
sudo nginx -t && sudo systemctl reload nginx

# Vérifier les certificats SSL
sudo certbot certificates

# Logs de l'application
docker logs administration-ga-app
```

## ✅ Validation de la Configuration

Une fois la configuration terminée, validez:

1. **🌐 Accès web**: `https://administration.ga`
2. **🔒 SSL**: Vérifiez le cadenas vert dans le navigateur
3. **📱 Responsivité**: Testez sur différents appareils
4. **⚡ Performance**: Vérifiez les temps de chargement

### Test automatique
```bash
# Lance tous les tests
node scripts/test-administration-domain.js

# Vérifie la connectivité
curl -I https://administration.ga
```

## 🎉 Félicitations

Votre domaine `administration.ga` est maintenant connecté et configuré ! 

### Prochaines étapes
- 👥 **Configurez les utilisateurs** dans l'onglet "Utilisateurs"
- 🔐 **Renforcez la sécurité** dans l'onglet "Sécurité"  
- 📊 **Surveillez les performances** dans l'onglet "Analytics"
- 🔄 **Configurez les sauvegardes** dans l'onglet "Sauvegardes"

---

## 📚 Ressources Supplémentaires

- 📖 [Documentation complète Netim.com](https://www.netim.com)
- 🔧 [Guide d'administration avancée](./docs/DOMAIN_MANAGEMENT_GUIDE.md)
- 🚀 [Scripts d'automatisation](./scripts/)
- 💬 Support: Consultez les logs et l'interface de diagnostic intégrée

### Bonne utilisation de votre plateforme ADMINISTRATION.GA 🇬🇦
