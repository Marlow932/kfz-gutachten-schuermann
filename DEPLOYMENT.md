# Betrieb auf dem eigenen Server (Docker)

Die Website läuft als eigener Container `schadenwerk-web` (nginx, Port 8080 im Container)
auf dem Server 45.146.255.254. Davor sitzt der vorhandene Coolify-Traefik (`coolify-proxy`).
Er erkennt den Container über die Labels in `docker-compose.yml`, holt das
Let's-Encrypt-Zertifikat und leitet `http://` und `www.` auf `https://schadenwerk-wuppertal.de`
um. Es wird kein Host-Port belegt (8081 ist auf dem Server schon vergeben).

## 1. Erstes Starten

Voraussetzung: Die DNS-Einträge (Abschnitt 3) zeigen schon auf den Server, sonst schlägt
die Zertifikatsabfrage fehl.

```sh
cd /opt
git clone https://github.com/Marlow932/kfz-gutachten-schuermann.git schadenwerk
cd schadenwerk
docker compose up -d --build
docker ps --filter name=schadenwerk-web   # Status "healthy"
curl -I https://schadenwerk-wuppertal.de
```

Beim ersten Build werden die Schriften (Clash Display, Satoshi) einmalig von Fontshare
geladen und ins Image gelegt. Besucher laden danach nichts mehr von Fremdservern.
Wer die Schriften lieber fest im Repo haben will: `sh tools/fetch-fonts.sh` ausführen und
`assets/fonts/` sowie `css/fonts.css` committen. Dann braucht der Build kein Internet.

Hinweis Speicherplatz: Der Server war am 27.11.2026 zu 95 % voll (2,7 GB frei). Das Image
ist klein (unter 60 MB), trotzdem vorher aufräumen, z. B. `docker builder prune`.

## 2. Reverse-Proxy (Coolify-Traefik)

Alles steht in den Labels der `docker-compose.yml`:

- Router `schadenwerk-http` (Entrypoint `http`) leitet auf HTTPS um
- Router `schadenwerk-https` (Entrypoint `https`, Resolver `letsencrypt`)
- Middleware `schadenwerk-www-redirect` leitet www auf die Hauptdomain um, dazu HSTS
- Netzwerk `coolify` (extern, gehört zum Coolify-Proxy)

Ohne Coolify/Traefik: Labels und `networks` entfernen, stattdessen
`ports: ["127.0.0.1:8082:8080"]` setzen und den eigenen Proxy auf diesen Port zeigen lassen.

## 3. DNS

- `A`-Record `schadenwerk-wuppertal.de` -> `45.146.255.254`
- `A`-Record `www.schadenwerk-wuppertal.de` -> `45.146.255.254`

## 4. Updates einspielen

```sh
git pull
docker compose up -d --build
```

## 5. Alte Domain / GitHub Pages

Wird die alte GitHub-Pages-Adresse nicht mehr gebraucht, GitHub Pages im Repo unter
Settings -> Pages abschalten, damit es keine doppelten Inhalte gibt.

## Was der Container mitbringt

- nginx unprivilegiert, Dateisystem schreibgeschützt, keine Linux-Capabilities
- Sicherheits-Header inkl. Content-Security-Policy (nur eigene Quellen + Web3Forms)
- gzip, Browser-Cache für Bilder/CSS/JS (7 Tage), HTML immer frisch
- Zugriffslogs nur mit gekürzter IP-Adresse (DSGVO), Log-Rotation 3 x 10 MB, RAM-Limit 64 MB
- Healthcheck unter `/healthz`, eigene 404-Seite
