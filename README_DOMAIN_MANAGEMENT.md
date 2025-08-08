# 🌐 Système de Gestion des Domaines - ADMINISTRATION.GA

## Vue d'ensemble

Système complet de gestion des domaines pour connecter automatiquement les applications ADMINISTRATION.GA, DEMARCHE.GA et TRAVAIL.GA aux domaines achetés sur Netim.com.

## 🚀 Démarrage Rapide

```bash
# 1. Cloner et configurer
git clone <repository>
cd ADMINISTRATION.GA

# 2. Démarrage automatisé
./scripts/start-domain-management.sh

# 3. Accéder à l'interface
http://localhost:3000/admin-web → Onglet "Domaines"
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Netim.com     │───▶│ DNS Records  │───▶│  VPS Server     │───▶│ Next.js Apps    │
│   Domain Mgmt   │    │ A, CNAME, MX │    │ Nginx + SSL     │    │ Port 3000       │
└─────────────────┘    └──────────────┘    └─────────────────┘    └─────────────────┘
```

### Applications Supportées

- **🛡️ ADMINISTRATION.GA** → `administration.ga`
- **📄 DEMARCHE.GA** → `demarche.ga`
- **💼 TRAVAIL.GA** → `travail.ga`

## ⚙️ Configuration

### Variables d'Environnement

```env
# API Netim.com
NETIM_API_KEY="your-netim-api-key"
NETIM_API_SECRET="your-netim-api-secret"
NETIM_API_URL="https://api.netim.com/v1"

# Serveur
SERVER_IP="192.168.1.100"
SSH_USERNAME="root"
SSH_KEY_PATH="/path/to/ssh/key"

# SSL
SSL_EMAIL="admin@administration.ga"
```

### Base de Données

```bash
# Migrations automatiques
npx prisma generate
npx prisma db push
```

## 🖥️ Interface Utilisateur

### Page d'Administration
- **URL** : `http://localhost:3000/admin-web`
- **Onglet** : "Domaines"
- **Fonctionnalités** :
  - ✅ Configuration automatique des domaines
  - ✅ Gestion DNS en temps réel
  - ✅ Provisioning SSL automatique
  - ✅ Monitoring des serveurs
  - ✅ Logs de déploiement

### Captures d'écran
```
┌─────────────────────────────────────────────────────────────┐
│ 🌐 Gestion des Domaines - ADMINISTRATION.GA                │
├─────────────────────────────────────────────────────────────┤
│ [Aperçu] [Configuration] [DNS & SSL] [Déploiement]         │
│                                                             │
│ 📊 Statistiques                                            │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ Domaines    │ │ Certificats │ │ DNS Config  │            │
│ │ Actifs: 3   │ │ SSL: 3      │ │ OK: 3       │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                             │
│ 📋 Domaines Configurés                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🟢 administration.ga                     [Détails] [🌐] │ │
│ │ 🟢 demarche.ga                          [Détails] [🌐] │ │
│ │ 🟢 travail.ga                           [Détails] [🌐] │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Utilisation

### 1. Interface Graphique

```typescript
// Navigation dans l'admin
1. Ouvrir http://localhost:3000/admin-web
2. Cliquer sur l'onglet "Domaines"
3. Cliquer sur "Configuration"
4. Remplir le formulaire :
   - Nom de domaine: administration.ga
   - IP Serveur: 192.168.1.100
   - SSL: ✅ Activé
5. Cliquer "Configurer le Domaine"
```

### 2. Script Automatisé

```bash
# Configuration complète d'un domaine
npx ts-node scripts/setup-netim-domain.ts \
  --domain=administration.ga \
  --ip=192.168.1.100 \
  --app=administration \
  --ssl \
  --subdomains=api,admin
```

### 3. API REST

```javascript
// Configuration via API
const response = await fetch('/api/domain-management', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'setup_domain',
    domainConfig: {
      domain: 'administration.ga',
      applicationId: 'administration',
      deploymentConfig: {
        ipAddress: '192.168.1.100',
        nginxConfig: {
          serverName: 'administration.ga',
          sslEnabled: true
        }
      }
    }
  })
});
```

### 4. Hook React

```typescript
// Dans un composant React
import { useDomainManagement } from '@/hooks/use-domain-management';

function DomainManager() {
  const { 
    domains, 
    setupDomain, 
    verifyDNS, 
    provisionSSL 
  } = useDomainManagement();

  const handleSetup = async () => {
    const result = await setupDomain({
      domain: 'administration.ga',
      applicationId: 'administration',
      serverIP: '192.168.1.100'
    });
    
    if (result.success) {
      console.log('Domaine configuré:', result.domainId);
    }
  };

  return (
    <div>
      <button onClick={handleSetup}>
        Configurer Domaine
      </button>
    </div>
  );
}
```

## 🔧 API Endpoints

### Configuration Domaine
```http
POST /api/domain-management
Content-Type: application/json

{
  "action": "setup_domain",
  "domainConfig": {
    "domain": "administration.ga",
    "applicationId": "administration",
    "deploymentConfig": { ... }
  }
}
```

### Gestion DNS
```http
POST /api/domain-management/dns
Content-Type: application/json

{
  "domain": "administration.ga",
  "records": [
    {
      "type": "A",
      "name": "@",
      "value": "192.168.1.100",
      "ttl": 3600
    }
  ]
}
```

### SSL/HTTPS
```http
POST /api/domain-management/ssl
Content-Type: application/json

{
  "domain": "administration.ga",
  "deploymentConfig": {
    "serverId": "server_1",
    "sshConfig": { ... }
  }
}
```

### Déploiement
```http
POST /api/domain-management/deploy
Content-Type: application/json

{
  "action": "deploy",
  "domainId": "domain_123",
  "deploymentConfig": { ... }
}
```

## 🔄 Workflow de Déploiement

### Automatique
```bash
1. Configuration DNS chez Netim.com ✅
2. Propagation DNS (0-24h) ⏱️
3. Configuration Nginx ✅
4. Provisioning SSL Let's Encrypt ✅
5. Déploiement application ✅
6. Health checks ✅
```

### Manuel
```bash
# 1. Préparer le serveur
ssh root@192.168.1.100
apt update && apt install -y nginx certbot

# 2. Configurer le domaine
npx ts-node scripts/setup-netim-domain.ts --domain=admin.ga --ip=192.168.1.100 --app=administration

# 3. Vérifier
curl -I https://administration.ga
```

## 📊 Monitoring

### Dashboard Temps Réel
- **Status domaines** : Actif/Erreur/En attente
- **Certificats SSL** : Validité et expiration
- **Santé serveurs** : CPU, RAM, Disque
- **Logs déploiement** : Succès/Échecs

### Health Checks
```typescript
// Vérification automatique
const { getServerHealth } = useDomainManagement();

setInterval(async () => {
  const health = await getServerHealth('server_1');
  console.log(`Server Health: ${health.status}`);
}, 30000);
```

### Alertes
- 🔴 **Domaine inaccessible**
- 🟡 **Certificat SSL expirant**
- 🟠 **Serveur surchargé**
- 🟢 **Tout opérationnel**

## 🛡️ Sécurité

### Firewall
```bash
ufw allow 22,80,443/tcp
ufw enable
```

### SSH
```bash
# Clés SSH uniquement
echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
```

### Rate Limiting
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

### SSL Grade A+
- TLS 1.2+ uniquement
- HSTS activé
- Certificats Let's Encrypt

## 🔧 Dépannage

### DNS ne se propage pas
```bash
# Vérifier configuration Netim
dig administration.ga @8.8.8.8

# Forcer update DNS
npx ts-node scripts/setup-netim-domain.ts --domain=admin.ga --force-dns
```

### SSL échoue
```bash
# Vérifier ports ouverts
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Test manuel Certbot
certbot certonly --nginx -d administration.ga
```

### Application inaccessible
```bash
# Vérifier Nginx
nginx -t && systemctl status nginx

# Vérifier application
pm2 status
docker ps
```

## 📚 Documentation

- **Guide complet** : `docs/DOMAIN_MANAGEMENT_GUIDE.md`
- **Types TypeScript** : `lib/types/domain-management.ts`
- **Service principal** : `lib/services/domain-management.service.ts`
- **Hook React** : `hooks/use-domain-management.ts`

## 🤝 Support

### Logs
```bash
# Application
tail -f .next/standalone/server.js.log

# Nginx
tail -f /var/log/nginx/access.log

# SSL
tail -f /var/log/letsencrypt/letsencrypt.log
```

### Debug Mode
```bash
DEBUG=domain-management npm run dev
```

### Contact
- **Issues** : GitHub Issues
- **Email** : admin@administration.ga
- **Documentation** : `/docs/`

## 🎯 Roadmap

- [ ] Support multi-serveurs
- [ ] CDN automatique
- [ ] Backup automatisé
- [ ] Monitoring avancé
- [ ] API Webhook
- [ ] Interface mobile

---

**🌟 Système de gestion des domaines pour ADMINISTRATION.GA - Connectez vos domaines Netim.com en quelques clics !**
