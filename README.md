# Website Stefan Schürmann — v3

Baut auf v2 ("Agency Edition") auf und ergänzt drei Dinge, die explizit gewünscht wurden:

## Was ist neu gegenüber v2

- **Crash-Showcase** ("Der Ernstfall"-Bereich, direkt nach der Laufschrift): das von dir
  gelieferte Video zeigt zwei echte Fahrzeuge, die kollidieren, gefolgt von den
  beschrifteten Schadensmarkierungen (Motorhaube, Scheinwerfer, …) – genau das, was ein
  Gutachten am Ende leistet. Läuft in einer abgerundeten Karte, startet automatisch von
  vorn, sobald der Bereich beim Scrollen in den Blickbereich kommt, pausiert außerhalb
  davon (spart Akku/Datenvolumen) und lässt sich durch Zurückscrollen beliebig oft neu
  abspielen. Liegt als WebM (klein, Chrome/Firefox/Edge/Safari) mit MP4-Fallback vor, dazu
  ein Standbild als Poster, bis das Video geladen ist. Bei aktivierter
  "Bewegung reduzieren"-Einstellung wird nicht automatisch abgespielt, stattdessen gibt es
  normale Video-Bedienelemente zum manuellen Starten.
- **Hell-/Dunkelmodus-Schalter** oben rechts im Header (Sonne/Mond-Toggle). Startet mit der
  Systemeinstellung des Besuchers, die Wahl wird gespeichert (localStorage) und beim
  nächsten Besuch beibehalten. Beide Varianten sind komplett neu durchgestylt, nicht nur
  abgedunkelt/aufgehellt.
- **Leverkusen ergänzt** im Einsatzgebiet – überall: Städte-Liste, Radar-Diagramm,
  FAQ-Text, strukturierte Daten (Schema.org) und `llms.txt`.

## Bugfix: Städte-Radar zeigte fast keine Namen an

Im Bereich "Einsatzgebiet" (die kreisförmige Grafik mit den Städtenamen) hatte der
Container keine feste Breite – dadurch kollabierten alle Städte-Punkte auf einen Fleck
und fast alle Namen waren unsichtbar bzw. übereinander gequetscht. Das ist jetzt behoben:
alle Städte werden gleichmäßig um den Kreis verteilt und vollständig angezeigt.

**Hinweis:** Derselbe Fehler steckt vermutlich auch noch in den Ordnern "Webseite" (v1)
und "Webseite v2" – dort wurde er nicht mit behoben, weil nur v3 aktiv angepasst wurde.
Sag Bescheid, falls das dort auch korrigiert werden soll.

## Update: Logo, Foto, mehr Städte, KVA-Service

- **Neues Logo eingebaut**: als gerahmtes "Siegel" direkt über der Crash-Showcase (passend
  zum Thema) sowie als Social-Media-Vorschaubild (og:image), das beim Teilen des Links z. B.
  in WhatsApp angezeigt wird.
- **Echtes Foto von Stefan** ersetzt das Platzhalter-Symbolbild im Abschnitt "Über mich".
- **5 weitere Städte ergänzt**: Mettmann, Wülfrath, Heiligenhaus, Sprockhövel, Hattingen
  (macht 14 Städte inkl. Wuppertal) plus ein Hinweis "Weitere Städte auf Anfrage". Überall
  aktualisiert: Städte-Liste, Radar-Diagramm, FAQ, Zähler, strukturierte Daten (Schema.org)
  und `llms.txt`.
- **Städte-Radar jetzt nach Entfernung sortiert**: zwei Ringe, innen die näheren Orte
  (Velbert, Schwelm, Remscheid, Haan, Sprockhövel, Wülfrath), außen die weiter entfernten
  (Solingen, Hilden, Mettmann, Heiligenhaus, Radevormwald, Hattingen, Leverkusen).
- **Neue Leistung**: Kostenvoranschlag (KVA) für Versicherungen bei kleineren Schäden, als
  eigene Kachel unter "Leistungen".
- **Domain hinterlegt**: `unfallschadengutachten-wuppertal.de` in allen Meta-Daten,
  strukturierten Daten, `sitemap.xml`, `robots.txt` und `llms.txt`.
- **Textstil bereinigt**: die auffälligen Gedankenstriche ("–") in Überschriften und
  Fließtext wurden durchgängig durch Punkte, Kommas oder Doppelpunkte ersetzt; echte,
  grammatikalisch nötige Bindestriche (Kfz-Sachverständiger, E-Mail, …) blieben erhalten.

## Vor dem Livegang

Identisch zu v1/v2 – siehe [../Webseite/README.md](../Webseite/README.md):
Adresse und Rechtsform im Impressum ergänzen, echte Domain einsetzen, Hosting-Anbieter in
der Datenschutzerklärung nennen.

## Welche Version an Stefan schicken?

- **v1**: schnell, minimalistisch, zero-dependency
- **v2**: High-End-Look mit Scroll-Animationen
- **v3**: wie v2, plus Crash-Showcase-Video mit Schadensmarkierungen,
  Hell-/Dunkelmodus-Schalter, Leverkusen ergänzt

Inhaltlich sind alle drei identisch – nur die Präsentation unterscheidet sich.
