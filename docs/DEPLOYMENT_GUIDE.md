# 🚀 Guide de Déploiement - Administration.GA

## Vue d'ensemble

Ce guide détaille la configuration optimale du circuit de développement et de déploiement pour Administration.GA, avec GitHub, serveur de production et monitoring complet.

## 📋 Table des matières

1. [Prérequis](#-prérequis)
2. [Configuration GitHub](#-configuration-github)
3. [Configuration des secrets](#-configuration-des-secrets)
4. [Déploiement initial](#-déploiement-initial)
5. [Monitoring et observabilité](#-monitoring-et-observabilité)
6. [Workflow de développement](#-workflow-de-développement)
7. [Architecture déployée](#️-architecture-déployée)
8. [Commandes utiles](#-commandes-utiles)
9. [Troubleshooting](#-troubleshooting)
10. [Ressources supplémentaires](#-ressources-supplémentaires)

## ✅ Prérequis

### Serveur de production
- **OS**: Ubuntu 20.04+ ou CentOS 8+
- **RAM**: Minimum 4GB (8GB recommandés)
- **Stockage**: Minimum 50GB SSD
- **CPU**: 2 vCPUs minimum
- **Réseau**: IPv4 publique, ports 80/443 ouverts

### Domaines et DNS
- `administration.ga` - Application principale
- `api.administration.ga` - API (optionnel)
- `monitoring.administration.ga` - Grafana
- `traefik.administration.ga` - Tableau de bord Traefik

### Services externes
- **Base de données**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Email**: Resend ou SendGrid
- **IA**: Google Gemini API
- **Stockage**: AWS S3 ou compatible

## 🔧 Configuration GitHub

### 1. Repository settings

```bash
# Cloner le repository
git clone https://github.com/votre-org/administration-ga.git
cd administration-ga

# Créer les branches de développement
git checkout -b develop
git push -u origin develop

# Protection des branches
# Dans GitHub : Settings > Branches
# - Protéger 'main' : Require PR, Require status checks
# - Protéger 'develop' : Require status checks
```

### 2. Environments GitHub

Créez ces environnements dans GitHub :

#### **Staging**
- URL: `https://staging.administration.ga`
- Reviewers: Équipe de développement
- Deployment protection rules: Activées

#### **Production**
- URL: `https://administration.ga`
- Reviewers: Lead developers uniquement
- Deployment protection rules: Activées
- Wait timer: 5 minutes

## 🔐 Configuration des secrets

### Secrets GitHub (Repository level)

```bash
# Variables d'application
DATABASE_URL=postgresql://user:password@localhost:5432/administration_ga
NEXTAUTH_SECRET=your-32-character-secret-key
NEXTAUTH_URL=https://administration.ga
GEMINI_API_KEY=your-gemini-api-key

# Déploiement
PRODUCTION_HOST=your.production.server
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
STAGING_HOST=your.staging.server
STAGING_USER=deploy
STAGING_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----

# Monitoring
GRAFANA_PASSWORD=secure-grafana-password
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
SNYK_TOKEN=your-snyk-security-token

# Base de données
POSTGRES_PASSWORD=secure-database-password
REDIS_PASSWORD=secure-redis-password
```

### Variables d'environnement (Repository level)

```bash
NODE_VERSION=18
DOCKER_REGISTRY=ghcr.io
APP_NAME=administration-ga
```

## 🚀 Déploiement initial

### 1. Préparation du serveur

```bash
# Connexion au serveur
ssh deploy@your.production.server

# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Installation Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker deploy

# Installation Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Création des répertoires
sudo mkdir -p /var/www/administration-ga
sudo chown deploy:deploy /var/www/administration-ga
```

### 2. Configuration initiale

```bash
# Dans /var/www/administration-ga
git clone https://github.com/votre-org/administration-ga.git .

# Copier et configurer .env
cp .env.example .env
nano .env  # Configurer toutes les variables

# Premier déploiement
./scripts/deploy.sh
```

### 3. Configuration SSL

```bash
# Le certificat Let's Encrypt se configure automatiquement via Traefik
# Vérifier dans docker-compose.yml que l'email est correct

# Vérification
curl -I https://administration.ga
# Doit retourner un certificat valide
```

## 📊 Monitoring et observabilité

### 1. Grafana

Accessible sur `https://monitoring.administration.ga`

**Dashboards inclus :**
- Métriques application (Next.js, API)
- Base de données PostgreSQL
- Performance Redis
- Métriques système Docker
- Logs applicatifs

### 2. Prometheus

Collecte automatique des métriques :
- Node Exporter (métriques système)
- cAdvisor (métriques containers)
- Postgres Exporter
- Application custom metrics

### 3. Logs centralisés

**Loki + Promtail :**
- Logs application
- Logs système
- Logs Docker containers
- Logs Nginx/Traefik

## 🔄 Workflow de développement

### 1. Développement local

```bash
# Setup initial
./scripts/setup-dev.sh

# Démarrage développement
npm run dev

# Tests et vérifications
npm run lint
npm run test
npm run build
```

### 2. Déploiement automatique

**Branch `develop` → Staging :**
```bash
git push origin develop
# Déclenche automatiquement le déploiement staging
```

**Branch `main` → Production :**
```bash
git checkout main
git merge develop
git push origin main
# Déclenche le déploiement production (avec approbation)
```

### 3. Rollback

```bash
# Via script
./scripts/deploy.sh rollback

# Via GitHub Actions
# Actions → Deploy Production → Re-run avec commit précédent
```

## 🏗️ Architecture déployée

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │     Traefik     │    │   Next.js App   │
│                 │────│   (Reverse      │────│                 │
│  administration │    │    Proxy)       │    │  (Docker)       │
│      .ga        │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │     Redis       │
                       │                 │    │                 │
                       │  (Database)     │    │   (Cache)       │
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   Monitoring    │
                       │                 │
                       │ Grafana + Loki  │
                       │  + Prometheus   │
                       └─────────────────┘
```

## 🔧 Commandes utiles

### Gestion des containers

```bash
# Status des services
docker-compose ps

# Logs en temps réel
docker-compose logs -f app

# Redémarrage d'un service
docker-compose restart app

# Mise à jour complète
docker-compose pull && docker-compose up -d

# Nettoyage système
docker system prune -f
```

### Base de données

```bash
# Backup manuel
docker exec administration-ga-postgres pg_dump -U postgres administration_ga > backup.sql

# Restauration
docker exec -i administration-ga-postgres psql -U postgres administration_ga < backup.sql

# Migrations
docker-compose exec app npx prisma migrate deploy

# Prisma Studio
docker-compose exec app npx prisma studio
```

### Monitoring

```bash
# Vérification santé
curl https://administration.ga/api/health

# Métriques Prometheus
curl http://localhost:9090/metrics

# Status Traefik
curl http://localhost:8080/api/rawdata
```

## 🚨 Troubleshooting

### Problèmes fréquents

#### 1. Application ne démarre pas

```bash
# Vérifier les logs
docker-compose logs app

# Vérifier les variables d'environnement
docker-compose exec app env | grep DATABASE_URL

# Redémarrer complètement
docker-compose down && docker-compose up -d
```

#### 2. Base de données inaccessible

```bash
# Vérifier PostgreSQL
docker-compose logs postgres

# Test de connexion
docker-compose exec app npx prisma db push

# Vérifier les ports
netstat -tlnp | grep 5432
```

#### 3. Problèmes SSL

```bash
# Vérifier configuration Traefik
docker-compose logs traefik

# Forcer renouvellement certificat
docker-compose restart traefik

# Vérifier DNS
dig administration.ga
```

#### 4. Performance dégradée

```bash
# Vérifier utilisation ressources
docker stats

# Vérifier logs d'erreurs
docker-compose logs --tail=100 app | grep ERROR

# Analyser métriques Grafana
# → https://monitoring.administration.ga
```

### Contacts d'urgence

- **Équipe DevOps**: devops@administration.ga
- **Support technique**: support@administration.ga
- **Slack**: #ops-administration-ga

## 📚 Ressources supplémentaires

- [Documentation API](./API_DOCUMENTATION.md)
- [Guide d'architecture](./ARCHITECTURE.md)
- [Procédures de sécurité](./SECURITY.md)
- [Guide utilisateur](./USER_GUIDE.md)

---

✅ **Circuit de développement optimisé et prêt pour la production !**

Pour toute question ou problème, consultez les logs ou contactez l'équipe technique. 
