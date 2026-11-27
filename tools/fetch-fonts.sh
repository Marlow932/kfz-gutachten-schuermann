#!/bin/sh
# Lädt die Schriften "Clash Display" und "Satoshi" einmalig von Fontshare herunter,
# legt sie unter assets/fonts/ ab und erzeugt css/fonts.css mit lokalen Pfaden.
# Danach lädt die Website keine Schriften mehr von Fremdservern (DSGVO).
#
# Nutzung (im Repo-Hauptordner):  sh tools/fetch-fonts.sh
# Die Schriften stehen unter der ITF Free Font License (Selbst-Hosting erlaubt).
set -eu

CSS_URL='https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,600,700,900&display=swap'
OUT_DIR="assets/fonts"
OUT_CSS="css/fonts.css"

mkdir -p "$OUT_DIR"
tmp="$(mktemp)"
curl -fsSL "$CSS_URL" | tr '\n' ' ' | sed 's/}/}\n/g' > "$tmp"

echo "/* Automatisch erzeugt von tools/fetch-fonts.sh. Schriften: Fontshare (ITF Free Font License). */" > "$OUT_CSS"

# Jeder @font-face-Block steht jetzt in einer Zeile
grep '@font-face' "$tmp" | while IFS= read -r block; do
  family="$(echo "$block" | sed -n "s/.*font-family: *['\"]\{0,1\}\([^;'\"]*\)['\"]\{0,1\};.*/\1/p")"
  weight="$(echo "$block" | sed -n 's/.*font-weight: *\([0-9]*\);.*/\1/p')"
  style="$(echo "$block" | sed -n 's/.*font-style: *\([a-z]*\);.*/\1/p')"
  url="$(echo "$block" | grep -o "//[^)'\"]*\.woff2" | head -1)"
  [ -n "$url" ] || continue
  slug="$(echo "$family" | tr 'A-Z ' 'a-z-')"
  file="$slug-$weight-${style:-normal}.woff2"
  curl -fsSL "https:$url" -o "$OUT_DIR/$file"
  cat >> "$OUT_CSS" <<CSS
@font-face {
  font-family: '$family';
  src: url('../assets/fonts/$file') format('woff2');
  font-weight: $weight;
  font-style: ${style:-normal};
  font-display: swap;
}
CSS
done
rm -f "$tmp"

count="$(ls "$OUT_DIR"/*.woff2 2>/dev/null | wc -l)"
if [ "$count" -eq 0 ]; then
  echo "FEHLER: Keine Schriften heruntergeladen." >&2
  exit 1
fi
echo "Fertig: $count Schriftdateien in $OUT_DIR, CSS in $OUT_CSS"
