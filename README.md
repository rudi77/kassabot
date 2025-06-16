# Kassabot - Einnahmen & Ausgaben App

Eine moderne Web-Anwendung für Selbständige zur einfachen Erfassung von Einnahmen und Ausgaben per Sprache oder Text.

## 🚀 Features

- **💬 Spracheingabe**: Buchungen per Sprache erfassen (Web Speech API)
- **🤖 Automatische Erkennung**: Intelligente Klassifizierung von Einnahmen/Ausgaben
- **💾 Lokale Speicherung**: Alle Daten bleiben sicher auf Ihrem Gerät
- **📱 Responsive Design**: Funktioniert auf Desktop, Tablet und Smartphone
- **✏️ CRUD-Operationen**: Buchungen bearbeiten und löschen
- **📊 Live-Dashboard**: Übersicht über Einnahmen, Ausgaben und Gewinn

## 🎯 Zielgruppe

Entwickelt für Selbständige, insbesondere:
- Friseure und Kosmetiker
- Kleine Handwerksbetriebe
- Solo-Selbständige
- Dienstleister ohne komplexe Buchhaltungsanforderungen

## 🛠️ Technologie

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Spracheingabe**: Web Speech API
- **Datenhaltung**: Browser localStorage
- **Icons**: Lucide React

## 📋 Anforderungen

- Moderner Browser (Chrome 60+, Firefox 55+, Safari 11+)
- Für Spracheingabe: Mikrofon und HTTPS-Verbindung
- JavaScript aktiviert

## 🚀 Installation & Start

### Entwicklung
```bash
# Repository klonen
git clone <repository-url>
cd kassabot

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Production Build
```bash
# Build erstellen
npm run build

# Build testen
npm run preview
```

## 📖 Verwendung

### Neue Buchung erfassen

**Per Text:**
1. Geben Sie Ihre Buchung ein: "40 Euro Haarschnitt"
2. Klicken Sie "Buchung hinzufügen" oder drücken Sie Enter

**Per Sprache:**
1. Klicken Sie auf das Mikrofon-Symbol
2. Sprechen Sie deutlich: "25 Euro Damenschnitt"
3. Bestätigen Sie die Eingabe

### Unterstützte Formate
- "40 Euro Haarschnitt"
- "25€ Damenschnitt"
- "12,50 Shampoo gekauft"
- "15 Euro Material gekauft"

### Automatische Erkennung
Die App erkennt automatisch:
- **Einnahmen**: Haarschnitt, Färben, Waschen, etc.
- **Ausgaben**: gekauft, bezahlt, Material, etc.
- **Betrag**: Verschiedene Währungsformate
- **Beschreibung**: Automatische Extraktion

## 📁 Projektstruktur

```
kassabot/
├── public/                 # Statische Assets
├── src/
│   ├── components/ui/      # UI-Komponenten
│   ├── App.jsx            # Hauptkomponente
│   ├── App.css            # Styling
│   └── main.jsx           # Entry Point
├── dist/                  # Production Build
├── BENUTZERHANDBUCH.md    # Benutzerhandbuch
├── TECHNISCHE_DOKUMENTATION.md # Tech-Docs
└── package.json           # Dependencies
```

## 🔒 Datenschutz & Sicherheit

- **Lokale Speicherung**: Alle Daten bleiben auf Ihrem Gerät
- **Keine Cloud**: Keine Datenübertragung an externe Server
- **Keine Tracking**: Keine Analytics oder Cookies
- **Browser-Sicherheit**: Nutzt moderne Browser-Sicherheitsfeatures

## 📚 Dokumentation

- [Benutzerhandbuch](./BENUTZERHANDBUCH.md) - Ausführliche Anleitung für Endnutzer
- [Technische Dokumentation](./TECHNISCHE_DOKUMENTATION.md) - Entwickler-Dokumentation

## 🎨 Screenshots

### Desktop-Ansicht
- Modernes Dashboard mit Gradient-Hintergrund
- Übersichtliche Statistik-Karten
- Intuitive Eingabemaske mit Sprach-Button

### Mobile-Ansicht
- Vollständig responsive
- Touch-optimierte Bedienung
- Große, gut erreichbare Buttons

## 🔮 Roadmap

### Version 2.0 (geplant)
- [ ] CSV/Excel Export
- [ ] Erweiterte Kategorien
- [ ] Statistiken und Charts
- [ ] Cloud-Backup (optional)
- [ ] PWA-Features

### Version 3.0 (geplant)
- [ ] Multi-User Support
- [ ] Erweiterte Berichte
- [ ] API-Integration
- [ ] Mobile Apps (iOS/Android)

## 🤝 Beitragen

Beiträge sind willkommen! Bitte:
1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

Bei Fragen oder Problemen:
- Erstelle ein Issue im Repository
- Kontaktiere den Entwickler
- Konsultiere die Dokumentation

## 🙏 Danksagungen

- **shadcn/ui** für die UI-Komponenten
- **Tailwind CSS** für das Styling-Framework
- **Lucide** für die Icons
- **Vite** für das Build-Tool

---

**Kassabot** - Einfache Buchführung für Selbständige 💰

