# Kassabot - Lokale Installation

## Schnellstart

1. **ZIP-Datei entpacken**
   ```bash
   unzip kassabot-app.zip
   cd kassabot
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   # oder
   pnpm install
   # oder
   yarn install
   ```

3. **App starten**
   ```bash
   npm run dev
   ```

4. **Browser öffnen**
   - Öffnen Sie http://localhost:5173
   - Die App lädt automatisch

## Systemanforderungen

- **Node.js**: Version 16 oder höher
- **npm/pnpm/yarn**: Aktueller Package Manager
- **Browser**: Chrome, Firefox, Safari oder Edge (neueste Versionen)

## Erste Schritte

1. **Neue Buchung per Text:**
   - Eingabe: "40 Euro Haarschnitt"
   - Enter drücken oder "Buchung hinzufügen" klicken

2. **Spracheingabe testen:**
   - Mikrofon-Button klicken (blau)
   - Deutlich sprechen: "25 Euro Damenschnitt"
   - Eingabe bestätigen

3. **Buchung bearbeiten:**
   - Stift-Symbol neben Eintrag klicken
   - Text ändern und speichern

## Verfügbare Kommandos

```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Production Build erstellen
npm run preview      # Build lokal testen
npm run lint         # Code-Qualität prüfen
```

## Troubleshooting

**Problem: npm install schlägt fehl**
- Node.js Version prüfen: `node --version`
- Cache leeren: `npm cache clean --force`

**Problem: Spracheingabe funktioniert nicht**
- HTTPS verwenden (für lokale Entwicklung nicht nötig)
- Mikrofon-Berechtigung erteilen
- Unterstützten Browser verwenden

**Problem: Port 5173 bereits belegt**
- Anderen Port verwenden: `npm run dev -- --port 3000`

## Weitere Dokumentation

- `BENUTZERHANDBUCH.md` - Ausführliche Bedienungsanleitung
- `TECHNISCHE_DOKUMENTATION.md` - Entwickler-Dokumentation
- `README.md` - Projekt-Übersicht

## Support

Bei Problemen oder Fragen:
- Dokumentation konsultieren
- Browser-Konsole auf Fehler prüfen
- Issue im Repository erstellen

---

**Viel Spaß beim Ausprobieren! 🚀**

