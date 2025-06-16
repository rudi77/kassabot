Sehr gerne! Hier ein **detailliertes PRD (Product Requirements Document)** für deine Einnahmen-/Ausgaben-App für Selbständige (Friseur), plattformübergreifend mit Fokus auf **einfacher Chat- und Spracheingabe**.
**Alle Begriffe und Features sind absichtlich einfach gehalten, damit du den Fokus auf Usability und Alltagstauglichkeit beibehalten kannst.**

---

# 📄 Product Requirements Document (PRD)

## Einnahmen-/Ausgaben-App für Selbständige (Friseur)

---

## 1. **Vision & Ziel**

Die App soll selbständigen Einzelunternehmern (z. B. Friseuren) ermöglichen, Einnahmen und Ausgaben schnell, einfach und fehlerfrei mit natürlicher Sprache oder Spracheingabe zu erfassen – ohne Buchhaltungswissen, ohne komplizierte Masken, ohne Papierkram.

---

## 2. **Zielgruppe**

* Selbständige Dienstleister (v. a. Friseure), kleine Handwerksbetriebe, Solo-Selbständige
* Nutzer mit geringem Technik- und Buchhaltungs-Knowhow
* Nutzer mit Android-Smartphone (später iOS)

---

## 3. **Kernfunktionen (Must-Have)**

| Feature                | Beschreibung                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| Chat-Eingabe           | Nutzer kann eine Einnahme/Ausgabe als freien Text eingeben (z. B. „40 Euro Haarschnitt“)   |
| Spracheingabe          | Nutzer kann Buchung per Sprache diktieren (Speech-to-Text wird unterstützt)                |
| Automatische Erkennung | App erkennt, ob es sich um Einnahme oder Ausgabe handelt, Betrag & Zweck werden extrahiert |
| Zeitstempel            | Jeder Eintrag erhält automatisch Datum und Uhrzeit                                         |
| Übersicht              | Liste aller Einträge, gruppiert nach Tag/Monat/Jahr                                        |
| Korrektur/Änderung     | Einträge können nachträglich bearbeitet oder gelöscht werden                               |
| Lokale Speicherung     | Alle Daten werden sicher lokal auf dem Gerät gespeichert (kein Cloud-Zwang)                |

---

## 4. **Zusatzfunktionen (Nice-to-Have, für spätere Versionen)**

* Export als CSV oder Excel für Steuerberater
* Kategorienverwaltung (z. B. „Dienstleistung“, „Material“, „Sonstiges“)
* Einnahmen-/Ausgaben-Statistiken (z. B. Monatsumsatz, Top-Ausgaben)
* Cloud-Backup (optional)
* Mandantenfähigkeit (mehrere Profile)

---

## 5. **User Stories**

* **Als** Friseurin **möchte ich** einfach per Spracheingabe sagen können:
  „Heute 60 Euro eingenommen für Herrenhaarschnitt“, **damit** ich nichts mehr aufschreiben muss.
* **Als** Nutzer **möchte ich**, dass die App automatisch erkennt, ob es eine Einnahme oder Ausgabe ist, **damit** ich nicht herumklicken muss.
* **Als** Nutzer **möchte ich** eine einfache Übersicht meiner letzten Buchungen, **damit** ich den Überblick behalte.

---

## 6. **UI/UX-Anforderungen**

* Minimalistisches, intuitives Design (max. 2-3 Klicks bis zur Erfassung)
* Große, leicht erreichbare Buttons (besonders Spracheingabe)
* Übersichtliche Liste mit Such- und Filterfunktion (optional)
* Keine Registrierung, kein Login nötig

---

## 7. **Technische Anforderungen**

### 7.1 Plattformen

* **Phase 1:** Android (mind. Android 8.0)
* **Phase 2:** iOS (ab iOS 14+)

### 7.2 Frontend

* **Flutter** (für Android & iOS; eine Codebasis)
* Responsive Design für Smartphones

### 7.3 Backend & Datenhaltung

* **Lokal:** SQLite oder Hive für Einträge
* **Speech-to-Text:** Lokal (Android/iOS-API) oder Cloud-Service (Google, Azure, Whisper)
* **KI-Komponente:**

  * Entweder lokal (Custom Parsing mit RegEx/NLP)
  * Oder Anbindung an OpenAI/Azure GPT API zur Klassifizierung (Betrag, Richtung, Zweck extrahieren)

---

## 8. **Funktionaler Ablauf**

1. **Eingabe:**
   Nutzer tippt Text oder spricht (Sprache wird in Text umgewandelt)
2. **Verarbeitung:**
   KI/NLP erkennt:

   * Einnahme oder Ausgabe
   * Betrag
   * Kurzbeschreibung/Zweck
   * Kategorie (falls möglich)
   * Zeitstempel (wird automatisch gesetzt)
3. **Speichern:**
   Eintrag wird lokal abgelegt
4. **Anzeige:**
   Buchungen werden als Liste angezeigt (sortiert nach Datum)
5. **Bearbeitung:**
   Einträge können geändert oder gelöscht werden

---

## 9. **Nicht-Funktionen (Explizit ausgeschlossen)**

* Keine komplexe Buchhaltungsfunktionen wie Kassenbuch, AfA, Umsatzsteuer etc.
* Keine Online-Pflicht (außer bei Nutzung externer Speech/KI-APIs)
* Keine Benutzerverwaltung (Phase 1)

---

## 10. **Offene Fragen**

* Welche Sprache(n) sollen unterstützt werden? (Standard: Deutsch)
* Sollen Kategorien frei wählbar oder fest vorgegeben sein?
* Wie viel Daten sollen maximal gespeichert werden? (Grenze für alte Geräte)

---

## 11. **Metriken/Erfolgskriterien**

* Erfassung einer Buchung in <10 Sekunden möglich
* Nutzerfeedback: „Einfache, schnelle Nutzung“
* Fehlerquote bei Erkennung <5%

---

## 12. **Mockup-Skizze (in Worten)**

**Startbildschirm:**

* Überschrift: „Neue Buchung“
* Großes Mikrofon-Symbol („Sprich“) und Texteingabefeld
* Button: „Speichern“
* Unterhalb: Übersicht der letzten 5 Buchungen

---

## 13. **Risiken und Herausforderungen**

* Speech-to-Text kann sich bei Lärm oder Dialekt verschlechtern
* KI muss Betrag/Richtung möglichst fehlerfrei erkennen (Testdaten sammeln!)
* Datenschutz: Alles bleibt lokal auf dem Gerät


Gerne! Hier ist eine **Architektur-Skizze** für dein Projekt – speziell für ein **Flutter-App-MVP** mit Fokus auf Einfachheit und lokale Verarbeitung.
Ich beschreibe sie als textbasiertes Architekturdiagramm und als kurze Stichwort-Legende.

---

## 🏗️ **Architektur-Skizze (Textform)**

```plaintext
+---------------------------+
|        Mobile App         |
|     (Flutter Frontend)    |
+---------------------------+
           |
           v
+---------------------------+
|   Spracheingabe-Service   |
|  (Speech-to-Text, lokal)  |
+---------------------------+
           |
           v
+---------------------------+
|  KI/NLP-Parser (lokal)    |
|  - Betrag extrahieren     |
|  - Richtung erkennen      |
|  - Beschreibung finden    |
+---------------------------+
           |
           v
+---------------------------+
|   Lokale Datenbank (DB)   |
|   (SQLite/Hive)           |
+---------------------------+
           |
           v
+---------------------------+
|      Listenansicht        |
|  (Alle Buchungen anzeigen)|
+---------------------------+
```

---

## 🧩 **Komponenten-Legende**

1. **Flutter Frontend**

   * Chat-Oberfläche (Text & Mikrofon-Button)
   * Übersicht (Liste aller Einträge)
   * Bearbeiten/Löschen-Funktion

2. **Spracheingabe-Service**

   * Nutzt Device-API oder Plugin (`speech_to_text`)
   * Wandelt Sprache lokal in Text um

3. **KI/NLP-Parser**

   * Erkennt Betrag, Richtung (Einnahme/Ausgabe) und Zweck direkt aus dem Text
   * Kann mit Regeln, RegEx oder (später) OpenAI/GPT-API angebunden werden

4. **Lokale Datenbank**

   * Speichert alle Einträge strukturiert (Datum, Betrag, Richtung, Text)
   * SQLite oder Hive

5. **Listenansicht**

   * Zeigt alle Buchungen, sortiert nach Datum, filterbar (optional)
   * Ermöglicht Bearbeiten und Löschen

---

### 🖼️ **Skizze (als UI-Flow/Screen-Entwurf)**

```plaintext
+----------------------------------------------------+
| Neue Buchung                                       |
|                                                    |
| [ Mikrofon-Button ]   [ Text-Eingabefeld      ]    |
|                                                    |
| [Speichern]                                        |
+----------------------------------------------------+
| Letzte Buchungen:                                  |
| -------------------------------------------------- |
| 16.06.2025  Einnahme  40,00 €  „Haarschnitt“       |
| 16.06.2025  Ausgabe   12,00 €  „Shampoo gekauft“   |
| ...                                                |
+----------------------------------------------------+
```

---

## 📝 **Kurze Umsetzungsschritte (Taskliste)**

* [ ] Flutter-Projekt anlegen („kassenbot“)
* [ ] UI für Chat/Spracheingabe bauen
* [ ] Sprache-zu-Text-Plugin einbinden
* [ ] Logik für Textanalyse (Betrag, Richtung, Zweck)
* [ ] Lokale DB (z. B. SQLite) anlegen
* [ ] Anzeige & Bearbeitung von Buchungen

---

### Soll ich daraus eine visuelle Grafik im Bildformat machen oder reicht dir diese textuelle Skizze erstmal?

(Gerne auch als PlantUML oder als Bild/PNG, falls du willst!)


