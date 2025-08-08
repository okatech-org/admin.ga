#!/usr/bin/env bash
set -euo pipefail

# Usage:
#  ./scripts/auto-deploy-admin-ga.sh \
#    --domain administration.ga \
#    --ip <VPS_IP> \
#    --ssh-user <USER> \
#    --email <EMAIL_CERTBOT> \
#    [--repo <GIT_URL> | --rsync-from <LOCAL_PATH>] \
#    [--pm2-name administration-ga]
#
# Example (rsync depuis le projet courant):
#  ./scripts/auto-deploy-admin-ga.sh --domain administration.ga --ip 203.0.113.10 --ssh-user ubuntu \
#    --email admin@administration.ga --rsync-from .
#
# Example (git clone sur le serveur):
#  ./scripts/auto-deploy-admin-ga.sh --domain administration.ga --ip 203.0.113.10 --ssh-user ubuntu \
#    --email admin@administration.ga --repo https://github.com/org/repo.git

DOMAIN=""
VPS_IP=""
SSH_USER=""
EMAIL=""
REPO_URL=""
LOCAL_PATH=""
PM2_NAME="administration-ga"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain) DOMAIN="$2"; shift 2;;
    --ip) VPS_IP="$2"; shift 2;;
    --ssh-user) SSH_USER="$2"; shift 2;;
    --email) EMAIL="$2"; shift 2;;
    --repo) REPO_URL="$2"; shift 2;;
    --rsync-from) LOCAL_PATH="$2"; shift 2;;
    --pm2-name) PM2_NAME="$2"; shift 2;;
    -h|--help)
      sed -n '1,80p' "$0"; exit 0;;
    *) echo "Arg inconnu: $1"; exit 1;;
  esac
done

if [[ -z "$DOMAIN" || -z "$VPS_IP" || -z "$SSH_USER" || -z "$EMAIL" ]]; then
  echo "Params manquants. Utilisez --help."; exit 1
fi

if [[ -z "$REPO_URL" && -z "$LOCAL_PATH" ]]; then
  echo "Spécifiez --repo <GIT_URL> ou --rsync-from <LOCAL_PATH>"; exit 1
fi

REMOTE_DIR="/var/www/${DOMAIN}"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"

say() { echo -e "\033[1;34m[INFO]\033[0m $*"; }
ok()  { echo -e "\033[1;32m[ OK ]\033[0m $*"; }
warn(){ echo -e "\033[1;33m[WARN]\033[0m $*"; }
err() { echo -e "\033[1;31m[ERR ]\033[0m $*"; }

say "Test SSH vers ${SSH_USER}@${VPS_IP}..."
ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new "${SSH_USER}@${VPS_IP}" true || {
  err "Connexion SSH échouée"; exit 1; }
ok "SSH OK"

say "Installation paquets système (Node 20, Nginx, Certbot, PM2)..."
ssh "${SSH_USER}@${VPS_IP}" bash -se <<'EOS'
set -euo pipefail
sudo apt update
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
sudo apt install -y nginx certbot python3-certbot-nginx git
sudo npm i -g pm2
sudo ufw allow 'Nginx Full' || true
EOS
ok "Packages installés"

say "Préparation dossier ${REMOTE_DIR}"
ssh "${SSH_USER}@${VPS_IP}" "sudo mkdir -p ${REMOTE_DIR} && sudo chown ${SSH_USER}:${SSH_USER} ${REMOTE_DIR}"
ok "Dossier prêt"

if [[ -n "$REPO_URL" ]]; then
  say "Déploiement via git clone"
  ssh "${SSH_USER}@${VPS_IP}" bash -se <<EOS
set -euo pipefail
if [ ! -d "${REMOTE_DIR}/.git" ]; then
  git clone ${REPO_URL} ${REMOTE_DIR}
fi
cd ${REMOTE_DIR}
git fetch --all || true
git pull || true
npm ci
npm run build
pm2 delete ${PM2_NAME} 2>/dev/null || true
pm2 start "npm run start" --name ${PM2_NAME}
pm2 save
EOS
else
  say "Déploiement via rsync depuis ${LOCAL_PATH}"
  rsync -az --delete --exclude ".git" --exclude "node_modules" "${LOCAL_PATH%/}/" "${SSH_USER}@${VPS_IP}:${REMOTE_DIR}/"
  ssh "${SSH_USER}@${VPS_IP}" bash -se <<EOS
set -euo pipefail
cd ${REMOTE_DIR}
npm ci
npm run build
pm2 delete ${PM2_NAME} 2>/dev/null || true
pm2 start "npm run start" --name ${PM2_NAME}
pm2 save
EOS
fi
ok "Application démarrée via PM2"

say "Configuration Nginx ${DOMAIN}"
ssh "${SSH_USER}@${VPS_IP}" sudo tee "${NGINX_CONF}" >/dev/null <<EOF
server {
  server_name ${DOMAIN} www.${DOMAIN};
  listen 80;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF
ssh "${SSH_USER}@${VPS_IP}" bash -se <<'EOS'
set -euo pipefail
sudo ln -s /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/ 2>/dev/null || true
sudo nginx -t
sudo systemctl reload nginx
EOS
ok "Nginx actif"

say "Émission certificat SSL Let's Encrypt"
ssh "${SSH_USER}@${VPS_IP}" sudo certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --redirect --agree-tos -m "${EMAIL}" --non-interactive || warn "Certbot a retourné un avertissement"

say "Vérifications HTTP/HTTPS"
ssh "${SSH_USER}@${VPS_IP}" "curl -I -s http://${DOMAIN} | head -n1 || true; curl -I -s https://${DOMAIN} | head -n1 || true" | sed 's/^/  /'

ok "Déploiement terminé. Si le domaine n'affiche pas encore l'app, attendez la propagation DNS ou vérifiez que les A @ et www pointent vers ${VPS_IP}."
