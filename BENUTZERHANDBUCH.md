# Kassabot - Benutzerhandbuch

## Übersicht

Kassabot ist eine moderne Web-Anwendung für Selbständige (insbesondere Friseure), um Einnahmen und Ausgaben schnell und einfach per Sprache oder Text zu erfassen. Die App funktioniert vollständig im Browser und speichert alle Daten lokal auf Ihrem Gerät.

## Hauptfunktionen

### 💰 Dashboard
Das Dashboard zeigt Ihnen auf einen Blick:
- **Gesamte Einnahmen** (grün)
- **Gesamte Ausgaben** (rot) 
- **Aktueller Gewinn** (blau)

### 📝 Neue Buchung erfassen

#### Texteingabe
1. Geben Sie Ihre Buchung in das Textfeld ein
2. Beispiele für gültige Eingaben:
   - "40 Euro Haarschnitt"
   - "25€ Damenschnitt"
   - "12 Euro Shampoo gekauft"
   - "8,50 Euro Kaffee gekauft"
3. Drücken Sie Enter oder klicken Sie auf "Buchung hinzufügen"

#### Spracheingabe
1. Klicken Sie auf das Mikrofon-Symbol (blau)
2. Sprechen Sie Ihre Buchung deutlich aus
3. Das System wandelt Ihre Sprache automatisch in Text um
4. Überprüfen Sie den Text und klicken Sie auf "Buchung hinzufügen"

**Hinweis:** Spracheingabe funktioniert nur in modernen Browsern (Chrome, Edge, Safari)

### 🔍 Automatische Erkennung

Die App erkennt automatisch:
- **Betrag**: Zahlen mit Euro, €, oder ohne Währung
- **Typ**: Einnahme oder Ausgabe basierend auf Schlüsselwörtern
  - Ausgaben: "gekauft", "bezahlt", "kosten", "material", "einkauf"
  - Einnahmen: "haarschnitt", "schnitt", "färben", "waschen" oder Standard bei positiven Beträgen
- **Beschreibung**: Der Rest des Textes nach Entfernung von Betrag und Währung

### 📋 Buchungsübersicht

#### Anzeige
- Alle Buchungen werden chronologisch sortiert angezeigt
- Grüner Punkt = Einnahme (+Betrag)
- Roter Punkt = Ausgabe (-Betrag)
- Datum und Uhrzeit werden automatisch erfasst

#### Bearbeiten
1. Klicken Sie auf das Stift-Symbol neben einer Buchung
2. Ändern Sie den Text im Eingabefeld
3. Klicken Sie "Speichern" oder "Abbrechen"

#### Löschen
1. Klicken Sie auf das Papierkorb-Symbol
2. Bestätigen Sie die Löschung

### 💾 Datenspeicherung

- Alle Daten werden **lokal** in Ihrem Browser gespeichert
- Keine Cloud-Verbindung erforderlich
- Daten bleiben auch nach Browser-Neustart erhalten
- **Wichtig**: Bei Browser-Daten löschen gehen die Buchungen verloren

## Tipps für optimale Nutzung

### Eingabeformate
Die App versteht verschiedene Formate:
- "40 Euro Haarschnitt"
- "25€ Damenschnitt" 
- "12,50 Shampoo gekauft"
- "30 Herrenschnitt mit Waschen"

### Spracheingabe
- Sprechen Sie deutlich und nicht zu schnell
- Verwenden Sie einfache Sätze
- Bei Problemen: Text manuell eingeben

### Browser-Kompatibilität
- **Empfohlen**: Chrome, Edge, Safari (neueste Versionen)
- **Spracheingabe**: Nur in unterstützten Browsern verfügbar
- **Mobile Geräte**: Vollständig responsive, funktioniert auf Smartphones und Tablets

## Häufige Fragen

**Q: Kann ich meine Daten exportieren?**
A: Aktuell nicht implementiert, geplant für zukünftige Versionen.

**Q: Funktioniert die App offline?**
A: Ja, nach dem ersten Laden funktioniert die App vollständig offline.

**Q: Sind meine Daten sicher?**
A: Ja, alle Daten bleiben lokal auf Ihrem Gerät und werden nicht übertragen.

**Q: Kann ich Kategorien hinzufügen?**
A: Aktuell erfolgt die Kategorisierung automatisch, manuelle Kategorien sind für zukünftige Versionen geplant.

## Support

Bei Problemen oder Fragen wenden Sie sich an den Entwickler oder erstellen Sie ein Issue im Projekt-Repository.

