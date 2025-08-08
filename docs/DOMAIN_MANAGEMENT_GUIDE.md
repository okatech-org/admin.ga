# Guide de Gestion des Domaines - ADMINISTRATION.GA

## Vue d'ensemble

Ce guide explique comment configurer et gérer les domaines pour les applications ADMINISTRATION.GA, DEMARCHE.GA et TRAVAIL.GA avec des domaines achetés sur Netim.com.

## Architecture

### Applications et Domaines

- **ADMINISTRATION.GA** : `administration.ga`
- **DEMARCHE.GA** : `demarche.ga`  
- **TRAVAIL.GA** : `travail.ga`

### Infrastructure

```
Netim.com DNS → Serveur VPS → Nginx → Applications Next.js
     ↓              ↓           ↓           ↓
  DNS Records   SSL/HTTPS   Reverse Proxy  Port 3000
```

## Configuration Initiale

### 1. Variables d'Environnement

Copiez `.env.example` vers `.env` et configurez :

```bash
# Configuration Netim API
NETIM_API_KEY="votre-clé-api-netim"
NETIM_API_SECRET="votre-secret-api-netim"
NETIM_API_URL="https://api.netim.com/v1"

# Configuration Serveur
SERVER_IP="192.168.1.100"
SSH_USERNAME="root"
SSH_KEY_PATH="/chemin/vers/votre/clé/ssh"
```

### 2. Base de Données

Exécutez les migrations Prisma :

```bash
npx prisma generate
npx prisma db push
```

### 3. Configuration DNS chez Netim

Dans votre interface Netim.com, configurez les serveurs DNS pour pointer vers votre serveur :

```
NS1: ns1.votre-serveur.com
NS2: ns2.votre-serveur.com
```

## Utilisation

### Interface Web

1. Accédez à `http://localhost:3000/admin-web`
2. Naviguez vers l'onglet "Domaines"
3. Configurez vos domaines via l'interface graphique

### Script Automatisé

```bash
# Configuration d'ADMINISTRATION.GA
npx ts-node scripts/setup-netim-domain.ts \
  --domain=administration.ga \
  --ip=192.168.1.100 \
  --app=administration \
  --ssl

# Configuration de DEMARCHE.GA
npx ts-node scripts/setup-netim-domain.ts \
  --domain=demarche.ga \
  --ip=192.168.1.100 \
  --app=demarche \
  --ssl

# Configuration de TRAVAIL.GA
npx ts-node scripts/setup-netim-domain.ts \
  --domain=travail.ga \
  --ip=192.168.1.100 \
  --app=travail \
  --ssl
```

### API Endpoints

#### Configuration DNS
```bash
POST /api/domain-management/dns
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

#### Provisioning SSL
```bash
POST /api/domain-management/ssl
{
  "domain": "administration.ga",
  "deploymentConfig": {
    "serverId": "server_1",
    "ipAddress": "192.168.1.100",
    "sshConfig": {
      "username": "root",
      "keyPath": "/path/to/key"
    }
  }
}
```

#### Déploiement
```bash
POST /api/domain-management/deploy
{
  "action": "deploy",
  "domainId": "domain_123",
  "deploymentConfig": {
    "dockerConfig": {
      "containerName": "administration-ga",
      "image": "node:18-alpine",
      "port": 3000
    }
  }
}
```

## Workflow de Déploiement

### 1. Préparation

```bash
# Vérifier la connectivité serveur
ssh root@192.168.1.100

# Installer les dépendances
apt update && apt install -y nginx docker.io certbot
```

### 2. Configuration Domaine

```typescript
// Utilisation du hook personnalisé
const { setupDomain, verifyDNS, provisionSSL } = useDomainManagement();

// Configuration
await setupDomain({
  domain: 'administration.ga',
  applicationId: 'administration',
  serverIP: '192.168.1.100',
  sslEnabled: true
});
```

### 3. Vérification

```bash
# Vérifier DNS
dig administration.ga A

# Vérifier SSL
curl -I https://administration.ga

# Vérifier Nginx
nginx -t && systemctl status nginx
```

## Monitoring et Maintenance

### Health Checks

```typescript
// Vérification automatique de santé
const { getServerHealth } = useDomainManagement();

const health = await getServerHealth('server_1');
console.log(`CPU: ${health.cpuUsage}%, Memory: ${health.memoryUsage}%`);
```

### Logs de Déploiement

```bash
# Via API
GET /api/domain-management/deploy?domainId=domain_123&type=deployment

# Logs système
tail -f /var/log/nginx/access.log
journalctl -u nginx -f
```

### Renouvellement SSL

```bash
# Manuel
certbot renew --nginx

# Automatique (cron)
0 12 * * * /usr/bin/certbot renew --quiet
```

## Dépannage

### Problèmes DNS

```bash
# Vérifier propagation
nslookup administration.ga 8.8.8.8
dig @8.8.8.8 administration.ga

# Netim API debug
curl -H "Authorization: Bearer $NETIM_API_KEY" \
     https://api.netim.com/v1/domain/administration.ga/dns
```

### Problèmes SSL

```bash
# Vérifier certificat
openssl s_client -connect administration.ga:443 -servername administration.ga

# Renouveler manuellement
certbot certonly --nginx -d administration.ga
```

### Problèmes Nginx

```bash
# Tester configuration
nginx -t

# Redémarrer
systemctl restart nginx

# Vérifier logs
tail -f /var/log/nginx/error.log
```

## Sécurité

### Firewall

```bash
# UFW Configuration
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### SSH

```bash
# Sécuriser SSH
echo "PasswordAuthentication no" >> /etc/ssh/sshd_config
echo "PermitRootLogin prohibit-password" >> /etc/ssh/sshd_config
systemctl restart sshd
```

### Rate Limiting

```nginx
# Nginx rate limiting
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api burst=20 nodelay;
        }
    }
}
```

## Backup et Restauration

### Configuration

```bash
# Backup automatique des configurations
0 2 * * * /usr/local/bin/backup-configs.sh
```

### Script de Backup

```bash
#!/bin/bash
# backup-configs.sh

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Nginx configs
cp -r /etc/nginx/sites-available $BACKUP_DIR/
cp -r /etc/letsencrypt $BACKUP_DIR/

# Database
pg_dump administration_ga > $BACKUP_DIR/database.sql

# Compress
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR
```

## Performance

### Optimisations Nginx

```nginx
# nginx.conf optimisations
worker_processes auto;
worker_connections 1024;

gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;

# Cache statique
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Monitoring

```typescript
// Monitoring intégré
const { stats } = useDomainManagement({ 
  autoRefresh: true, 
  refreshInterval: 30000 
});

console.log(`Domaines actifs: ${stats.active}/${stats.total}`);
```

## Support

Pour toute question ou problème :

1. Vérifiez les logs dans l'interface admin
2. Consultez la documentation Netim.com
3. Utilisez les outils de diagnostic intégrés
4. Contactez le support technique si nécessaire

## Changelog

- **v1.0.0** : Configuration initiale des domaines
- **v1.1.0** : Ajout SSL automatique
- **v1.2.0** : Interface de monitoring
- **v1.3.0** : Scripts d'automatisation
