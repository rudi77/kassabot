# Kassabot - Technische Dokumentation

## Projektübersicht

Kassabot ist eine React-basierte Web-Anwendung für die Erfassung von Einnahmen und Ausgaben mit Fokus auf Spracheingabe und automatischer Texterkennung.

## Technologie-Stack

### Frontend
- **Framework**: React 18 mit Vite
- **Sprache**: JavaScript (JSX)
- **Styling**: Tailwind CSS
- **UI-Komponenten**: shadcn/ui
- **Icons**: Lucide React
- **Build-Tool**: Vite

### APIs & Browser-Features
- **Web Speech API**: Für Sprache-zu-Text Konvertierung
- **localStorage**: Für lokale Datenpersistierung

## Projektstruktur

```
kassabot/
├── public/                 # Statische Assets
├── src/
│   ├── components/
│   │   └── ui/            # shadcn/ui Komponenten
│   ├── App.jsx            # Hauptkomponente
│   ├── App.css            # Styling
│   ├── main.jsx           # Entry Point
│   └── index.css          # Globale Styles
├── dist/                  # Production Build
├── package.json           # Dependencies
├── vite.config.js         # Vite Konfiguration
└── README.md              # Projekt-Readme
```

## Kernfunktionalitäten

### 1. Spracheingabe (Speech-to-Text)

```javascript
// Web Speech API Integration
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognitionInstance = new SpeechRecognition()

recognitionInstance.continuous = false
recognitionInstance.interimResults = false
recognitionInstance.lang = 'de-DE'
```

**Features:**
- Automatische Erkennung der Browser-Unterstützung
- Deutsche Spracherkennung
- Visuelles Feedback während der Aufnahme
- Fehlerbehandlung für nicht unterstützte Browser

### 2. Textanalyse & Parsing

```javascript
const parseEntry = (text) => {
  // Betragserkennung mit RegEx
  const amountMatch = text.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:euro|€|eur)?/i)
  
  // Typ-Erkennung basierend auf Schlüsselwörtern
  const expenseKeywords = ['gekauft', 'ausgabe', 'bezahlt', 'kosten', 'ausgegeben', 'material', 'einkauf']
  const incomeKeywords = ['einnahme', 'verdient', 'erhalten', 'haarschnitt', 'schnitt', 'färben', 'waschen']
  
  // Beschreibungsextraktion
  let description = text.replace(/\d+(?:[.,]\d{1,2})?\s*(?:euro|€|eur)?/gi, '').trim()
  
  return { type, amount, description }
}
```

**Erkennungslogik:**
- **Betrag**: RegEx für Zahlen mit optionaler Währung
- **Typ**: Keyword-basierte Klassifizierung
- **Beschreibung**: Text nach Entfernung von Betrag und Währung

### 3. Lokale Datenhaltung

```javascript
// localStorage Utilities
const STORAGE_KEY = 'kassabot_entries'

const loadEntries = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading entries:', error)
    return []
  }
}

const saveEntries = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch (error) {
    console.error('Error saving entries:', error)
  }
}
```

**Datenmodell:**
```javascript
{
  id: timestamp,           // Eindeutige ID
  date: 'DD.MM.YYYY',     // Datum (deutsch)
  time: 'HH:MM',          // Uhrzeit
  type: 'income|expense',  // Typ
  amount: number,          // Betrag (float)
  description: string      // Beschreibung
}
```

### 4. CRUD-Operationen

**Create**: Neue Buchung hinzufügen
```javascript
const handleSubmit = () => {
  const parsed = parseEntry(inputText)
  const newEntry = {
    id: Date.now(),
    date: now.toLocaleDateString('de-DE'),
    time: now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
    ...parsed
  }
  setEntries(prev => [newEntry, ...prev])
}
```

**Read**: Buchungen anzeigen und filtern
```javascript
const totalIncome = entries
  .filter(entry => entry.type === 'income')
  .reduce((sum, entry) => sum + entry.amount, 0)
```

**Update**: Buchung bearbeiten
```javascript
const handleSaveEdit = () => {
  setEntries(prev => prev.map(entry => 
    entry.id === editingId ? { ...entry, ...parsed } : entry
  ))
}
```

**Delete**: Buchung löschen
```javascript
const handleDelete = (id) => {
  setEntries(prev => prev.filter(entry => entry.id !== id))
}
```

## UI/UX Design

### Design-Prinzipien
- **Minimalistisch**: Fokus auf Kernfunktionen
- **Responsive**: Mobile-first Ansatz
- **Zugänglich**: Große Buttons, klare Kontraste
- **Modern**: Gradient-Hintergründe, Schatten, abgerundete Ecken

### Komponenten-Architektur
- **Hauptkomponente**: App.jsx (Single-File-Component)
- **UI-Bibliothek**: shadcn/ui für konsistente Komponenten
- **Styling**: Tailwind CSS für Utility-First Styling

### Responsive Breakpoints
```css
/* Mobile First */
.container { @apply px-4 py-8 max-w-4xl mx-auto; }

/* Tablet/Desktop */
.grid { @apply grid-cols-1 md:grid-cols-3 gap-6; }
```

## Performance-Optimierungen

### Build-Optimierung
- **Vite**: Schnelle Entwicklung und optimierte Builds
- **Tree Shaking**: Automatische Entfernung ungenutzten Codes
- **Code Splitting**: Lazy Loading für bessere Performance

### Browser-Kompatibilität
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 11+
- **Fallbacks**: Graceful Degradation für Spracheingabe
- **Polyfills**: Automatisch durch Vite hinzugefügt

## Deployment

### Development
```bash
npm run dev -- --host  # Entwicklungsserver mit externem Zugriff
```

### Production Build
```bash
npm run build          # Erstellt optimierten Build in dist/
```

### Hosting
- **Statische Hosting**: Vercel, Netlify, GitHub Pages
- **Anforderungen**: Nur statisches Hosting erforderlich
- **HTTPS**: Empfohlen für Web Speech API

## Sicherheit & Datenschutz

### Datenschutz
- **Lokale Speicherung**: Keine Datenübertragung an Server
- **Keine Cookies**: Verwendet nur localStorage
- **Keine Tracking**: Keine Analytics oder externe Services

### Sicherheit
- **XSS-Schutz**: React's eingebauter Schutz
- **Input-Validierung**: Parsing und Sanitization von Benutzereingaben
- **Error Handling**: Graceful Fehlerbehandlung

## Zukünftige Erweiterungen

### Geplante Features
1. **Export-Funktionen**: CSV/Excel Export für Steuerberater
2. **Kategorien**: Manuelle Kategorienverwaltung
3. **Statistiken**: Erweiterte Auswertungen und Charts
4. **Cloud-Backup**: Optionale Synchronisation
5. **PWA**: Progressive Web App Features
6. **Offline-Modus**: Service Worker für vollständige Offline-Funktionalität

### Technische Verbesserungen
1. **TypeScript**: Migration für bessere Typsicherheit
2. **Testing**: Unit und Integration Tests
3. **Internationalisierung**: Mehrsprachige Unterstützung
4. **Accessibility**: WCAG 2.1 Compliance

## Entwicklung & Wartung

### Code-Qualität
- **ESLint**: Automatische Code-Analyse
- **Prettier**: Code-Formatierung
- **Git Hooks**: Pre-commit Validierung

### Monitoring
- **Error Tracking**: Implementierung von Sentry o.ä.
- **Performance**: Web Vitals Monitoring
- **User Feedback**: Feedback-System für Verbesserungen

## API-Referenz

### localStorage Schema
```javascript
// Key: 'kassabot_entries'
// Value: JSON Array von Entry-Objekten
[
  {
    "id": 1718520000000,
    "date": "16.06.2025",
    "time": "14:30",
    "type": "income",
    "amount": 45.00,
    "description": "Herrenhaarschnitt mit Waschen"
  }
]
```

### Browser APIs
- **Web Speech API**: `window.SpeechRecognition`
- **localStorage**: `window.localStorage`
- **Date API**: Für Zeitstempel und Formatierung

## Troubleshooting

### Häufige Probleme

**Spracheingabe funktioniert nicht:**
- Browser-Unterstützung prüfen
- Mikrofon-Berechtigung erteilen
- HTTPS-Verbindung verwenden

**Daten gehen verloren:**
- Browser-Daten nicht löschen
- localStorage-Limits beachten
- Backup-Strategie implementieren

**Performance-Probleme:**
- Große Datenmengen in localStorage
- Browser-Cache leeren
- Neueste Browser-Version verwenden

