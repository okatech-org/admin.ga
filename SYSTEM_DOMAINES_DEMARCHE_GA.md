# Système de Configuration des Domaines DEMARCHE.GA

## Vue d'ensemble

Le système de configuration des domaines permet de gérer dynamiquement plusieurs domaines et sous-domaines pour la plateforme DEMARCHE.GA. Chaque domaine peut avoir sa propre configuration, personnalisation visuelle et fonctionnalités spécifiques.

## Fonctionnalités principales

### 1. Gestion des domaines multiples
- **Domaine principal** : `demarche.ga` (portail national)
- **Sous-domaines d'organisations** : `organisme.demarche.ga`
- **Domaines personnalisés** : `services.autre-domaine.ga`

### 2. Configuration dynamique
- Couleurs et thème personnalisés
- Titre et description spécifiques
- Logo et favicon personnalisés
- Fonctionnalités activées/désactivées par domaine

### 3. Gestion des organisations
- Attribution automatique de sous-domaines
- Configuration isolée par organisation
- Redirection intelligente selon l'utilisateur

### 4. Sécurité et validation
- Validation des formats de domaines
- Vérification DNS automatique
- Gestion des certificats SSL
- Mode maintenance par domaine

## Architecture

### Structure des fichiers

```
lib/
├── domain-config.ts          # Configuration et gestionnaire des domaines
├── hooks/useDomainConfig.ts   # Hook React pour la configuration

app/api/
├── domains/                   # API de gestion des domaines
│   ├── route.ts              # CRUD des domaines
│   ├── [domain]/route.ts     # Gestion individuelle
│   └── validate/route.ts     # Validation de domaines
├── domain-config/route.ts    # Configuration du domaine actuel

components/
├── DomainConfigProvider.tsx  # Provider de contexte

app/admin-web/config/demarche.ga/
├── page.tsx                  # Interface d'administration
└── test-domain/page.tsx      # Page de test et validation

middleware.ts                 # Gestion des domaines dans le middleware
```

### Base de données

Le système utilise les modèles Prisma existants :
- `Organization` : Organisations liées aux domaines
- `User` : Utilisateurs avec leurs rôles et organisations

## Configuration des domaines

### Structure d'une configuration

```typescript
interface DomainConfig {
  id: string;
  domain: string;                    // exemple.ga
  subdomain?: string;                // organisme
  organizationId?: string;           // Lié à une organisation
  isActive: boolean;
  isMainDomain: boolean;
  
  ssl: {
    enabled: boolean;
    certificate?: string;
    validUntil?: Date;
  };
  
  customization: {
    primaryColor: string;            // #2563eb
    logo?: string;
    favicon?: string;
    title: string;                   // Nom du portail
    description: string;
  };
  
  features: {
    multipleLanguages: boolean;
    enabledLanguages: string[];      // ['fr', 'en']
    maintenanceMode: boolean;
    enableRegistration: boolean;
    enableGuestAccess: boolean;
    enableAPIAccess: boolean;
  };
}
```

## Utilisation

### 1. Interface d'administration

Accès via : `/admin-web/config/demarche.ga`

**Fonctionnalités disponibles :**
- Créer/modifier/supprimer des domaines
- Configurer la personnalisation
- Activer/désactiver des fonctionnalités
- Mode maintenance par domaine
- Validation de domaines

### 2. API REST

#### Lister les domaines
```http
GET /api/domains
Authorization: Bearer {token}
```

#### Créer un domaine
```http
POST /api/domains
Content-Type: application/json
Authorization: Bearer {token}

{
  "domain": "exemple.ga",
  "subdomain": "organisme",
  "customization": {
    "primaryColor": "#2563eb",
    "title": "Portail Organisme",
    "description": "Services en ligne de l'organisme"
  },
  "features": {
    "enableRegistration": true,
    "enableAPIAccess": true
  }
}
```

#### Valider un domaine
```http
POST /api/domains/validate
Content-Type: application/json

{
  "domain": "exemple.ga",
  "subdomain": "test",
  "checkDNS": true
}
```

### 3. Utilisation dans les composants React

```typescript
import { useDomainConfig } from '@/lib/hooks/useDomainConfig';

function MonComposant() {
  const { domainConfig, isLoading } = useDomainConfig();
  
  if (isLoading) return <div>Chargement...</div>;
  
  return (
    <div style={{ color: domainConfig?.primaryColor }}>
      <h1>{domainConfig?.title}</h1>
      <p>{domainConfig?.description}</p>
    </div>
  );
}
```

### 4. Provider de contexte

Enveloppez votre application avec le provider :

```typescript
import { DomainConfigProvider } from '@/components/DomainConfigProvider';

function App({ children }) {
  return (
    <DomainConfigProvider>
      {children}
    </DomainConfigProvider>
  );
}
```

## Middleware et redirection

Le middleware détecte automatiquement le domaine et applique la configuration :

### Fonctionnalités du middleware
- Détection du domaine/sous-domaine
- Application de la configuration
- Mode maintenance
- Redirection selon l'organisation de l'utilisateur
- Headers de configuration pour le client

### Exemple de redirection automatique
- Utilisateur de l'organisation "DGDI" → `dgdi.demarche.ga`
- Citoyen → `demarche.ga`
- Super admin → accès à tous les domaines

## Tests et validation

### Page de test
Accès via : `/admin-web/config/demarche.ga/test-domain`

**Tests disponibles :**
- Validation de format de domaine
- Vérification DNS
- Test de certificats SSL
- Test des APIs
- Diagnostic de permissions

### Tests automatiques
```bash
# Test de validation de domaine
curl -X POST http://localhost:3000/api/domains/validate \
  -H "Content-Type: application/json" \
  -d '{"domain": "exemple.ga", "checkDNS": true}'

# Test de configuration
curl http://localhost:3000/api/domain-config
```

## Configuration du serveur

### Variables d'environnement

```env
# Configuration des domaines
DOMAIN_SSL_CHECK_ENABLED=true
DOMAIN_DNS_VALIDATION=true
DOMAIN_AUTO_REDIRECT=true

# Domaines autorisés
ALLOWED_DOMAINS=demarche.ga,*.demarche.ga
```

### Configuration Nginx (exemple)

```nginx
server {
    listen 80;
    server_name *.demarche.ga;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Sécurité

### Permissions
- **Super Admin** : Accès complet à tous les domaines
- **Admin Org** : Accès au domaine de son organisation
- **Utilisateur** : Accès en lecture aux domaines publics

### Validation
- Format de domaine strict
- Vérification des certificats SSL
- Protection contre les domaines malveillants
- Rate limiting sur les APIs

### Mode maintenance
- Activation par domaine
- Accès préservé pour les super admins
- Page de maintenance personnalisée

## Dépannage

### Problèmes courants

1. **Domaine non reconnu**
   - Vérifier la configuration DNS
   - Contrôler les redirections
   - Vérifier les permissions

2. **Configuration non appliquée**
   - Vider le cache du navigateur
   - Redémarrer l'application
   - Vérifier les variables d'environnement

3. **Erreurs de validation**
   - Utiliser la page de test pour diagnostiquer
   - Vérifier les logs serveur
   - Contrôler les permissions API

### Logs et monitoring

```typescript
// Activer les logs de debug
console.log('Domain config:', domainManager.getDomainConfig(hostname));

// Vérifier le middleware
console.log('Middleware headers:', request.headers.get('X-Domain-Config'));
```

## Évolutions futures

### Fonctionnalités prévues
- Interface de gestion DNS intégrée
- Certificats SSL automatiques (Let's Encrypt)
- Analytics par domaine
- A/B testing par configuration
- API publique pour les organisations

### Améliorations techniques
- Cache Redis pour les configurations
- CDN pour les assets personnalisés
- Monitoring avancé des domaines
- Backup automatique des configurations

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Mainteneur** : Équipe DEMARCHE.GA
