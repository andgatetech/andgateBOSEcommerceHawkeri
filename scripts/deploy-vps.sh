#!/usr/bin/env bash
# Build a committed revision before switching this app's Nginx upstream.
set -Eeuo pipefail
export PATH="/root/.nvm/versions/node/v20.20.2/bin:$PATH"
app=hawkeri
repo=git@github.com:andgatetech/andgateBOSEcommerceHawkeri.git
branch=main
pointer=/var/www/hawkeri-current
nginx_conf=/etc/nginx/sites-available/hawkeri.com
first_port=3110
second_port=3111
public_url=https://hawkeri.com/
sha="${1:-}"
[[ "$sha" =~ ^[0-9a-f]{40}$ ]] || { echo 'Pass a full committed SHA.' >&2; exit 2; }
[[ $(id -u) == 0 ]] || { echo 'Run on the VPS as root.' >&2; exit 2; }
exec 9>/var/lock/andgate-frontend-deploy.lock
flock 9
current=$(readlink -f "$pointer")
[[ -L "$pointer" && -f "$current/.env" && -f "$nginx_conf" ]] || { echo 'Missing live release/configuration.' >&2; exit 2; }
mirror="/var/www/repositories/$app.git"
mkdir -p /var/www/repositories
if [[ ! -d "$mirror" ]]; then git clone --mirror "$repo" "$mirror"; fi
git --git-dir="$mirror" fetch origin "$branch"
[[ $(git --git-dir="$mirror" rev-parse FETCH_HEAD) == "$sha" ]] || { echo 'SHA must be the remote deployment branch tip.' >&2; exit 2; }
if [[ $(git -C "$current" rev-parse HEAD 2>/dev/null || true) == "$sha" ]] && git -C "$current" diff --quiet HEAD; then
  echo "$app already runs $sha"; exit 0
fi
stamp=$(date -u +%Y%m%d%H%M%S)
release="/var/www/releases/$app-${sha:0:12}-$stamp"
backup="/var/backups/$app-$stamp"
mkdir -p "$release" "$backup"
chmod 700 "$backup"
git --git-dir="$mirror" archive "$sha" | tar -x -C "$release"
cp "$current/.env" "$release/.env"
chmod 600 "$release/.env"
git clone --shared --no-checkout "$mirror" "$release/.git-source" >/dev/null 2>&1
mv "$release/.git-source/.git" "$release/.git"
rmdir "$release/.git-source"
git -C "$release" remote set-url origin "$repo"
git -C "$release" symbolic-ref HEAD "refs/heads/$branch"
git -C "$release" update-ref "refs/heads/$branch" "$sha"
git -C "$release" read-tree "$sha"
(cd "$release"; npm ci --no-audit --no-fund; npm run build) >"$backup/build.log" 2>&1
# Keep hashed assets available to browsers with an older document open.
rsync -a --ignore-existing "$current/.next/static/" "$release/.next/static/"
current_port=$(python3 - "$nginx_conf" <<'PY'
import re,sys
ports=set(re.findall(r'proxy_pass http://127\.0\.0\.1:(\d+);',open(sys.argv[1]).read()))
assert len(ports)==1, 'Expected one frontend upstream'
print(next(iter(ports)))
PY
)
port="$first_port"; [[ "$current_port" != "$first_port" ]] || port="$second_port"
if ss -ltnH "sport = :$port" | read -r _; then echo "Port $port is occupied; no live configuration changed." >&2; exit 2; fi
process="$app-${sha:0:12}-$stamp"
(cd "$release"; pm2 start node_modules/next/dist/bin/next --name "$process" -- start --hostname 127.0.0.1 -p "$port") >/dev/null
for attempt in {1..30}; do
  if curl -fsS --max-time 15 "http://127.0.0.1:$port/" > /dev/null; then break; fi
  if [[ "$attempt" == 30 ]]; then pm2 delete "$process" >/dev/null; exit 1; fi
  sleep 1
done
cp "$nginx_conf" "$backup/nginx-before.conf"
rollback() {
  cp "$backup/nginx-before.conf" "$nginx_conf"
  nginx -t && systemctl reload nginx
  ln -sfn "$current" "$pointer"
  pm2 stop "$process" >/dev/null
  echo "Rolled back; the previous release remains online. See $backup." >&2
}
trap rollback ERR
python3 - "$nginx_conf" "$current_port" "$port" <<'PY'
from pathlib import Path
import sys
p=Path(sys.argv[1]);old=f'proxy_pass http://127.0.0.1:{sys.argv[2]};';assert old in p.read_text()
p.write_text(p.read_text().replace(old,f'proxy_pass http://127.0.0.1:{sys.argv[3]};'))
PY
nginx -t
systemctl reload nginx
curl --fail --silent --show-error --retry 5 --retry-delay 1 --max-time 30 "$public_url" >/dev/null
ln -sfn "$release" "$pointer"
printf '{"commit":"%s","application":"%s"}\n' "$sha" "$app" > "$release/.release.json"
pm2 save >/dev/null
trap - ERR
echo "Deployed $app commit $sha to $release on port $port. Previous process retained for rollback."
