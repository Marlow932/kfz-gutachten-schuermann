# Website Stefan Schürmann — Final

Statische Website für Stefan Schürmann, unabhängiger Kfz-Sachverständiger in Wuppertal
und Umgebung. Live unter: https://marlow932.github.io/kfz-gutachten-schuermann/

## Features

- Hell-/Dunkelmodus-Schalter oben rechts im Header (Sonne/Mond-Toggle). Startet mit der
  Systemeinstellung des Besuchers, die Wahl wird gespeichert (localStorage) und beim
  nächsten Besuch beibehalten.
- **Crash-Showcase** ("Der Ernstfall"-Bereich): echtes Video von zwei kollidierenden
  Fahrzeugen, gefolgt von beschrifteten Schadensmarkierungen. Startet automatisch, sobald
  der Bereich beim Scrollen in den Blickbereich kommt, pausiert außerhalb davon und lässt
  sich durch Zurückscrollen beliebig oft neu abspielen. WebM mit MP4-Fallback und
  Standbild als Poster. Bei aktivierter "Bewegung reduzieren"-Einstellung kein Autoplay,
  stattdessen normale Video-Bedienelemente.
- Neues Logo als gerahmtes "Siegel" über der Crash-Showcase, im Header/Footer als
  Marke und als Social-Media-Vorschaubild (og:image). Favicon ist ein Ausschnitt
  desselben Logos (Kollisions-Detail, ohne Text, damit es auch bei 16x16 px lesbar bleibt).
- Echtes Foto von Stefan im Abschnitt "Über mich".
- Einsatzgebiet: 14 Städte inkl. Wuppertal (Solingen, Remscheid, Velbert, Haan, Hilden,
  Schwelm, Radevormwald, Leverkusen, Mettmann, Wülfrath, Heiligenhaus, Sprockhövel,
  Hattingen), plus Hinweis "Weitere Städte auf Anfrage". Das Radar-Diagramm sortiert die
  Städte nach Entfernung in zwei Ringen (näher/weiter).
- Leistungen inkl. Kostenvoranschlag (KVA) für Versicherungen bei kleineren Schäden.
- SEO/GEO: strukturierte Daten (Schema.org LocalBusiness + FAQPage), `sitemap.xml`,
  `robots.txt`, `llms.txt`, Domain `unfallschadengutachten-wuppertal.de` überall
  hinterlegt.

## Kontaktformular-Backend

Das Formular sendet per [Web3Forms](https://web3forms.com) direkt an Stefans
E-Mail-Postfach, ganz ohne eigenen Server. Schlägt die Zustellung fehl (z. B. weil der
Access Key noch nicht eingetragen ist), öffnet sich als Rückfallebene automatisch das
E-Mail-Programm des Besuchers mit vorausgefüllter Nachricht.

**Vor dem Livegang noch nötig:**

1. Auf https://web3forms.com die E-Mail-Adresse eintragen, die die Anfragen empfangen
   soll (`gutachten.wuppertal@yahoo.de`) — kein Passwort/Account nötig, nur kurze
   Bestätigung per E-Mail.
2. Den zugeschickten Access Key in `index.html` eintragen, im Formularfeld:
   ```html
   <input type="hidden" name="access_key" value="HIER_ACCESS_KEY_EINFÜGEN">
   ```
   (aktuell steht dort ein Platzhalter).

## Vor dem Livegang

- **Impressum & Datenschutz**: Adresse, Rechtsform, USt-Angabe und Hosting-Anbieter sind
  noch als Platzhalter markiert (`.legal-placeholder`) — folgen kurz vor dem Livegang.
- **Web3Forms Access Key** eintragen (siehe oben).
- Echte Domain `unfallschadengutachten-wuppertal.de` registrieren/verbinden, falls noch
  nicht geschehen.
- Platzhalter-Kundenbewertungen durch echte Google-Rezensionen ersetzen, sobald vorhanden.
