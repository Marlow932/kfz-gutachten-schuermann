# Website Stefan Schürmann: statische Seite, ausgeliefert von nginx (unprivilegiert, Port 8080)

# --- Stufe 1: Schriften einmalig herunterladen, falls sie nicht schon im Repo liegen ---
FROM alpine:3.20 AS fonts
WORKDIR /site
COPY tools/fetch-fonts.sh tools/fetch-fonts.sh
COPY assets/ assets/
COPY css/ css/
RUN if [ ! -f css/fonts.css ]; then apk add --no-cache curl sed && sh tools/fetch-fonts.sh; fi

# --- Stufe 2: Auslieferung ---
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.inc /etc/nginx/conf.d/security-headers.inc
COPY --chown=nginx:nginx *.html *.xml *.txt manifest.webmanifest /usr/share/nginx/html/
COPY --chown=nginx:nginx js/ /usr/share/nginx/html/js/
COPY --from=fonts --chown=nginx:nginx /site/css/ /usr/share/nginx/html/css/
COPY --from=fonts --chown=nginx:nginx /site/assets/ /usr/share/nginx/html/assets/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
