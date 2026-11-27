# Betrieb auf dem eigenen Server (Docker)

Die Website läuft als eigener Container (`schadenwerk-website`) mit nginx und ist
nur lokal auf dem Server erreichbar. HTTPS und die Domain übernimmt der Reverse-Proxy,
der auf dem Server ohnehin läuft.

## 1. Erstes Starten

```sh
git clone https://github.com/Marlow932/kfz-gutachten-schuermann.git
cd kfz-gutachten-schuermann
docker compose up -d --build
curl http://127.0.0.1:8081/healthz   # -> ok
```

Beim ersten Build werden die Schriften (Clash Display, Satoshi) einmalig von Fontshare
geladen und ins Image gelegt. Besucher laden danach nichts mehr von Fremdservern.
Wer die Schriften lieber fest im Repo haben will: `sh tools/fetch-fonts.sh` ausführen und
`assets/fonts/` sowie `css/fonts.css` committen. Dann braucht der Build kein Internet.

Anderer Port gewünscht? In einer `.env` neben der `docker-compose.yml`:

```
WEBSITE_PORT=8090
```

## 2. Reverse-Proxy

Den Proxy auf `http://127.0.0.1:8081` zeigen lassen und:

- `schadenwerk-wuppertal.de` als Hauptdomain mit HTTPS (Let's Encrypt)
- `www.schadenwerk-wuppertal.de` per 301 auf `https://schadenwerk-wuppertal.de` umleiten
- HTTP per 301 auf HTTPS umleiten
- optional HSTS: `Strict-Transport-Security: max-age=31536000`

Beispiel Caddy:

```
schadenwerk-wuppertal.de {
  reverse_proxy 127.0.0.1:8081
}
www.schadenwerk-wuppertal.de {
  redir https://schadenwerk-wuppertal.de{uri} permanent
}
```

Läuft der Proxy selbst als Container (z. B. Traefik oder Nginx Proxy Manager), den
`ports:`-Eintrag in `docker-compose.yml` durch das gemeinsame Docker-Netzwerk des Proxys
ersetzen und dort `schadenwerk-website:8080` als Ziel eintragen.

## 3. DNS

- `A`-Record `schadenwerk-wuppertal.de` -> IPv4 des Servers
- `A`- (oder `CNAME`-)Record `www` -> gleiche Adresse
- ggf. `AAAA`-Records für IPv6

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
- Zugriffslogs nur mit gekürzter IP-Adresse (DSGVO), Log-Rotation 3 x 10 MB
- Healthcheck unter `/healthz`, eigene 404-Seite
