# Labtoso Chat - Premium Chat Client

Ein moderner Chat-Client mit Login-System, der auf GitHub Pages läuft! 🚀

## Features ✨

- 🔐 **Sichere Authentifizierung** - Login & Registrierung mit Verschlüsselung
- 💬 **Echtzeit-Messaging** - Sofortiges Versenden und Empfangen
- 🎨 **Modernes UI** - Dunkles Neon-Design mit Gradient
- 📱 **Responsive Design** - Desktop, Tablet & Mobile
- 💾 **Lokale Speicherung** - Alle Daten bleiben auf deinem Gerät
- 🌐 **Multi-Device Sync** - Export/Import zwischen Geräten
- 🚫 **User Management** - Block, Mute, Delete Funktionen
- 🔗 **URL Routing** - `/#/login`, `/#/reg`, `/#/chats`

## Technologie Stack 🛠️

- **HTML5** - Struktur
- **CSS3** - Design mit Gradients & Neon
- **Vanilla JavaScript** - Keine Dependencies
- **localStorage** - Persistente Datenspeicherung
- **CryptoJS** - AES Verschlüsselung
- **GitHub Pages** - Kostenloses Hosting

## Installation

### Lokal:
```bash
# Option 1: Direkt öffnen
open index.html

# Option 2: Mit Server
python -m http.server 8000
```

### GitHub Pages:
1. Repository erstellen
2. Alle Dateien hochladen
3. Settings → Pages → `main` branch
4. Fertig! 🚀

## Verwendung

### URLs
```
/#/login  → Login
/#/reg    → Registrierung
/#/chats  → Chat
```

### Benutzer verwalten (⚙️ Button)
- **🚫 Block** - Blockieren/Entsperren
- **🔇 Mute** - Stummschalten
- **🗑️ Delete** - Löschen (nicht auf sich selbst)

### Sync zwischen Geräten
1. **Export** (⬇️): `.json` Backup
2. **Import** (⬆️): Backup hochladen
3. Fertig! ✨

## Dateien-Struktur

```
Chat/
├── index.html           # HTML
├── styles.css           # Design
├── script.js            # JavaScript
├── 404.html             # SPA Routing
├── .nojekyll            # GitHub Pages
└── shared-users.json    # Benutzerdatenbank
```

## Sicherheit

- Passwörter in `localStorage` (nicht für Production!)
- AES-verschlüsselte Auth-Tokens
- 30 Tage Gültigkeit für "Angemeldet bleiben"

## Fehlerbehebung

### Seite zeigt 404
- Normal! `404.html` redirects automatisch
- Hard Refresh: `Ctrl + Shift + R`

### Daten weg nach Reload
- Private Browsing aktiviert?
- `localStorage` wurde geleert?

### Benutzer nicht synchronisiert
- Nutze Export/Import Feature
- Export auf PC, Import auf Laptop

## Zukünftige Features

- [ ] Firebase Cloud Sync
- [ ] Datei-Upload
- [ ] Voice Nachrichten
- [ ] Gruppenchats
- [ ] E2E Verschlüsselung

## Browser-Kompatibilität

- ✅ Chrome/Edge (neueste)
- ✅ Firefox (neueste)
- ✅ Safari (neueste)
- ✅ Mobile

## Lizenz

MIT - Frei nutzbar!

---

**Made with ❤️ by Labtoso**
