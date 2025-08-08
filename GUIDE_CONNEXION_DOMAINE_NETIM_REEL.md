# ✅ Guide Connexion Domaine administration.ga - Configuration Netim Réelle

## 🎯 **Statut Actuel**

Basé sur les tests de connexion effectués avec votre vraie configuration Netim :

| Test | Statut | Détails |
|------|--------|---------|
| DNS | ✅ | `administration.ga` → `185.26.106.234` |
| Ping | ✅ | Serveur accessible |
| Port 80 | ❌ | Nginx non configuré |
| Port 3000 | ❌ | Application Next.js non démarrée |
| Domaine HTTP | ✅ | Serveur web basique actif |
| HTTPS | ⚠️ | SSL à configurer |

## 🏛️ **Configuration Netim Détectée**

### **DNS**
```
administration.ga → 185.26.106.234
www.administration.ga → 185.26.106.234
```

### **Serveurs DNS**
```
ns1.netim.net
ns2.netim.net  
ns3.netim.net
```

### **Mail (MX)**
```
mx1.netim.net (priorité 10)
mx2.netim.net (priorité 10)
```

### **SPF**
```
"v=spf1 ip4:185.26.104.0/22 ~all"
```

---

## 🚀 **Mise en Production - Étapes**

### **1. Démarrage de l'Application**

```bash
# Dans le répertoire du projet
npm install
npm run build
npm start
```

L'application sera accessible sur `http://185.26.106.234:3000`

### **2. Configuration Nginx (Optionnel)**

Créer le fichier de configuration Nginx :

```bash
# Générer la configuration automatiquement
./scripts/connect-administration-domain.sh
# Puis choisir option 3 "Générer configuration Nginx"
```

Ou créer manuellement `/etc/nginx/sites-available/administration.ga` :

```nginx
server {
    listen 80;
    server_name administration.ga www.administration.ga;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer la configuration :
```bash
sudo ln -s /etc/nginx/sites-available/administration.ga /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **3. Configuration SSL (Let's Encrypt)**

```bash
# Installation certbot
sudo apt install certbot python3-certbot-nginx

# Génération certificat
sudo certbot --nginx -d administration.ga -d www.administration.ga

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🛠️ **Scripts Disponibles**

### **Test Connexion Rapide**
```bash
./scripts/test-netim-connection.sh
```

### **Configuration Complète**
```bash
./scripts/connect-administration-domain.sh
```

### **Déploiement Complet**
```bash
./scripts/deploy-administration-ga.sh
```

---

## 🔧 **Configuration Avancée**

### **Variables d'Environnement**

Copier et personnaliser le fichier de configuration :
```bash
cp config-production-netim.env .env.production
```

Modifier les variables importantes :
```bash
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/administration_ga

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key

# Email
RESEND_API_KEY=your-resend-key
EMAIL_FROM=noreply@administration.ga
```

### **Configuration Base de Données**

```bash
# PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb administration_ga
sudo -u postgres createuser admin_ga

# Migration Prisma
npx prisma migrate deploy
npx prisma generate
```

---

## 🌐 **Sous-domaines Recommandés**

Basé sur votre architecture, vous pouvez ajouter ces enregistrements chez Netim :

### **Modules Principaux**
```
api.administration.ga → 185.26.106.234
admin.administration.ga → 185.26.106.234
demarche.administration.ga → 185.26.106.234
travail.administration.ga → 185.26.106.234
```

### **Services Techniques**
```
cdn.administration.ga → 185.26.106.234
uploads.administration.ga → 185.26.106.234
monitoring.administration.ga → 185.26.106.234
```

### **Configuration dans Netim**

1. Connectez-vous à [netim.com](https://netim.com)
2. Mes domaines → administration.ga
3. DNS → Ajouter enregistrement
4. Type: A, Nom: [sous-domaine], Valeur: 185.26.106.234, TTL: 3600

---

## 📊 **Monitoring et Tests**

### **Tests Automatiques**
```bash
# Test complet
./scripts/test-netim-connection.sh

# Test DNS spécifique
nslookup administration.ga
dig administration.ga

# Test application
curl -I http://administration.ga
curl -I https://administration.ga
```

### **Monitoring Continue**
```bash
# Vérification DNS
watch -n 30 'nslookup administration.ga'

# Vérification application
watch -n 30 'curl -s -o /dev/null -w "%{http_code}" http://administration.ga'
```

---

## 🔒 **Sécurité**

### **Firewall**
```bash
# UFW (Ubuntu)
sudo ufw enable
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3000  # Next.js (temporaire)
```

### **SSL/TLS**
- Certificats Let's Encrypt configurés
- Redirection HTTP → HTTPS automatique
- Headers de sécurité (HSTS, CSP, etc.)

---

## 🆘 **Dépannage**

### **Problèmes Courants**

1. **Application non accessible**
   ```bash
   # Vérifier si l'app fonctionne
   npm start
   curl http://localhost:3000
   ```

2. **DNS non résolu**
   ```bash
   # Vider cache DNS
   sudo systemctl flush-dns
   # Tester avec DNS Google
   nslookup administration.ga 8.8.8.8
   ```

3. **Nginx ne démarre pas**
   ```bash
   # Vérifier configuration
   sudo nginx -t
   # Voir les logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **SSL ne fonctionne pas**
   ```bash
   # Renouveler certificat
   sudo certbot renew
   # Vérifier certificat
   openssl s_client -connect administration.ga:443
   ```

---

## 🎉 **Résultat Final**

Une fois tous les éléments configurés, votre plateforme sera accessible :

- **Site principal** : https://administration.ga
- **API** : https://api.administration.ga
- **Administration** : https://admin.administration.ga
- **Modules** : 
  - https://demarche.administration.ga
  - https://travail.administration.ga
  - https://citoyen.administration.ga

## Félicitations ! Votre plateforme ADMINISTRATION.GA est maintenant opérationnelle 🇬🇦
