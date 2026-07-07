# Labtoso Chat - Premium Chat Client

Ein moderner Chat-Client mit Login-System, der auf GitHub Pages läuft! 🚀

## Features ✨

- 🔐 **Sichere Authentifizierung** - Login & Registrierung
- 💬 **Echtzeit-Messaging** - Sofortiges Versenden und Empfangen von Nachrichten
- 🎨 **Modernes UI** - Dunkles Neon-Design mit Gradient
- 📱 **Responsive Design** - Funktioniert auf Desktop, Tablet & Mobile
- 💾 **Lokale Speicherung** - Alle Daten bleiben auf deinem Gerät (localStorage)
- 🔍 **Chat-Suche** - Schnell durch deine Chats navigieren
- 👥 **Multi-User Support** - Mehrere Benutzer können sich registrieren

## Demo-Zugangsdaten

```
Benutzername: admin
Passwort: 1234
```

## Technologie Stack 🛠️

- **HTML5** - Struktur
- **CSS3** - Modernes Design mit Gradients & Neon-Effekten
- **Vanilla JavaScript** - Keine Dependencies!
- **localStorage** - Datenspeicherung

## Installation & Verwendung

### Lokal ausführen:
1. `index.html` im Browser öffnen
2. Oder einen lokalen Server starten:
   ```bash
   python -m http.server 8000
   # oder
   npx http-server
   ```
3. Öffne `http://localhost:8000`

### GitHub Pages Deployment:

#### Option 1: Über GitHub UI
1. Ein neues Repository erstellen (z.B. `chat-app`)
2. Alle Dateien hochladen (index.html, styles.css, script.js)
3. Gehe zu Settings → Pages
4. Source: `main` branch
5. Speichern
6. Die App ist jetzt verfügbar unter: `https://dein-username.github.io/chat-app/`

#### Option 2: Via Git CLI
```bash
# Repository initialisieren
git init
git add .
git commit -m "Initial commit: Labtoso Chat"

# Remote Repository hinzufügen
git remote add origin https://github.com/dein-username/chat-app.git

# Branch umbenennen und pushen
git branch -M main
git push -u origin main
```

Dann GitHub Pages in den Repository-Settings aktivieren.

## Verwendung 🎮

### Registrierung
1. Klick auf "Registrieren"
2. Fülle das Registrierungsformular aus
3. Benutzername & Passwort eingeben
4. Account erstellt! ✅

### Login
1. Benutzername & Passwort eingeben
2. "Anmelden" Button klicken
3. Willkommen im Chat! 👋

### Chat starten
1. Klick auf "+" Button (Neuer Chat)
2. Gib einen Benutzernamen ein (z.B. `admin`)
3. Optional: Chat-Name eingeben
4. "Erstellen" Button klicken
5. Los geht's! 💬

### Nachrichten versenden
1. Wähle einen Chat aus
2. Gib deine Nachricht ins Textfeld ein
3. Drücke Enter oder klick auf den "Senden" Button
4. Nachricht erscheint im Chat! ✨

## Dateien-Struktur 📁

```
Chat/
├── index.html      # HTML-Struktur
├── styles.css      # Styling & Layout
├── script.js       # JavaScript Logik
└── README.md       # Diese Datei
```

## Zukünftige Verbesserungen 🚀

- [ ] Firebase Integration für echte Echtzeit-Sync
- [ ] Datei-Upload Unterstützung
- [ ] Emoji-Picker
- [ ] Voice-Nachrichten
- [ ] Gruppenichats
- [ ] Verschlüsselte Nachrichten
- [ ] Push-Benachrichtigungen
- [ ] Dark/Light Mode Toggle
- [ ] Typing Indicator

## Sicherheit ⚠️

**Wichtig:** Dieses Projekt nutzt localStorage für Datenspeicherung. 
- Passwörter werden im localStorage gespeichert (nicht produktiv!)
- Für echte Produktionsanwendung: Echte Backend-Authentifizierung verwenden
- Überlegung: Firebase, Node.js + Express, etc.

## Design-Inspiration 🎨

Inspiriert von modernen Chat-Aplikationen mit:
- Neon Cyan/Türkis Farbschema
- Dunkler Hintergrund
- Glow-Effekte
- Smooth Animations

## Browser-Kompatibilität 🌐

- ✅ Chrome/Edge (neueste)
- ✅ Firefox (neueste)
- ✅ Safari (neueste)
- ✅ Mobile Browser

## Kontakt & Support 📧

Für Fragen oder Bugmeldungen: [Issues auf GitHub](https://github.com/dein-username/chat-app/issues)

---

**Made with ❤️ by Labtoso**
