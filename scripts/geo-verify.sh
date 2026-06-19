#!/usr/bin/env bash
# geo-verify.sh — verificación GEO de midcar.es (post-deploy y QA mensual / WS5).
# Comprueba que las señales que leen las IAs están presentes y correctas.
#
# Uso:
#   scripts/geo-verify.sh [BASE_URL] [VEHICLE_SLUG]
#   scripts/geo-verify.sh https://midcar.es STK-3108093817321
#   scripts/geo-verify.sh http://localhost:3212 STK-3108093817321   # contra build local
#
# Sin argumentos usa https://midcar.es y descubre un slug del sitemap.

# Nota: sin `pipefail` a propósito — `echo "$grande" | grep -q` provoca SIGPIPE
# (grep -q corta el pipe) y con pipefail daría falsos negativos en sitemaps grandes.
set -u

BASE="${1:-https://midcar.es}"
UA="GPTBot"
pass=0; fail=0
ok()   { echo "  ✓ $1"; pass=$((pass+1)); }
ko()   { echo "  ✗ $1"; fail=$((fail+1)); }

echo "== GEO verify :: $BASE =="

# Descubrir slug de vehículo si no se pasa
SLUG="${2:-}"
if [ -z "$SLUG" ]; then
  SLUG=$(curl -s "$BASE/sitemap.xml" | grep -o '/vehiculos/[^<]*' | head -1 | sed 's#/vehiculos/##')
fi

echo "[1] robots.txt — crawlers de IA + host apex"
ROBOTS=$(curl -s "$BASE/robots.txt")
for bot in GPTBot OAI-SearchBot PerplexityBot ClaudeBot; do
  echo "$ROBOTS" | grep -qi "$bot" && ok "permite $bot" || ko "NO permite $bot"
done
echo "$ROBOTS" | grep -qi "Host:.*//midcar.es" && ok "Host = apex" || ko "Host no es apex (revisar NEXT_PUBLIC_SITE_URL)"

echo "[2] llms.txt"
[ "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/llms.txt")" = "200" ] && ok "llms.txt 200" || ko "llms.txt no responde 200"

echo "[3] ficha /vehiculos/$SLUG — JSON-LD Car+Offer"
if [ -n "$SLUG" ]; then
  HTML=$(curl -s -A "$UA" "$BASE/vehiculos/$SLUG")
  echo "$HTML" | grep -q '"@type":"Car"'   && ok "schema Car"   || ko "falta schema Car"
  echo "$HTML" | grep -q '"@type":"Offer"' && ok "schema Offer" || ko "falta schema Offer"
  echo "$HTML" | grep -q '"@type":"BreadcrumbList"' && ok "BreadcrumbList" || ko "falta BreadcrumbList"
  echo "$HTML" | grep -qi 'rel="canonical"[^>]*//midcar.es' && ok "canónica apex" || ko "canónica no apex"
else
  ko "no se encontró slug de vehículo"
fi

echo "[4] sitemap.xml"
# Fetch con reintentos: el sitemap es grande y un único curl puede fallar puntualmente (falso negativo).
SM=$(curl -s --retry 4 --retry-delay 1 --retry-all-errors --max-time 30 "$BASE/sitemap.xml")
echo "$SM" | grep -q '<urlset' && ok "sitemap XML válido" || ko "sitemap no válido"
echo "$SM" | grep -q '/vehiculos/' && ok "incluye fichas de vehículo" || ko "sin fichas en sitemap"
BLOGN=$(echo "$SM" | grep -o '/blog/[^<]*' | grep -vc '/categoria/')
[ "${BLOGN:-0}" -ge 1 ] && ok "incluye guías de blog ($BLOGN)" || ko "sin guías de blog en sitemap"

echo "[5] host: www → apex (301)"
CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://www.midcar.es/")
[ "$CODE" = "301" ] || [ "$CODE" = "308" ] && ok "www redirige ($CODE)" || ko "www no redirige (code $CODE)"

echo "== Resultado: $pass OK / $fail FALLOS =="
[ "$fail" -eq 0 ]
