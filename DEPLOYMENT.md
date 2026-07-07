# Deployment Guide - Labtoso Chat

Schritt-für-Schritt Anleitung zum Deployen auf GitHub Pages 🚀

## Voraussetzungen

- Ein GitHub Account
- Git installiert (optional, aber empfohlen)
- Ein Browser

## Methode 1: GitHub UI (Einfach) ⭐

Diese Methode ist am einfachsten - keine Command Line nötig!

### Schritt 1: Repository erstellen
1. Gehe zu [github.com](https://github.com)
2. Melde dich an
3. Klicke auf `+` → `New repository`
4. Repository Name: `chat-app` (oder einen anderen Namen)
5. Wähle "Public"
6. Klicke "Create repository"

### Schritt 2: Dateien hochladen
1. Klicke auf "Add file" → "Upload files"
2. Ziehe diese Dateien rein:
   - index.html
   - styles.css
   - script.js
   - README.md
3. Klicke "Commit changes"

### Schritt 3: GitHub Pages aktivieren
1. Gehe zu Repository Settings
2. Scrolle zu "Pages" (Linke Sidebar)
3. Unter "Build and deployment":
   - Source: Wähle `Deploy from a branch`
   - Branch: Wähle `main` und `/root`
4. Klicke "Save"
5. Warte 1-2 Minuten...
6. Deine App ist online! 🎉

**URL:** `https://dein-username.github.io/chat-app/`

---

## Methode 2: Git CLI (Fortgeschritten) 💻

Wenn du Git installiert hast:

### Schritt 1: Repository erstellen
Wie oben beschrieben, aber wähle "Empty repository"

### Schritt 2: Terminal öffnen
```bash
cd "g:\Meine Ablage\Programmieren\Web\Chat"
```

### Schritt 3: Git initialisieren
```bash
git init
git add .
git commit -m "Initial commit: Labtoso Chat App"
```

### Schritt 4: Remote hinzufügen
```bash
git remote add origin https://github.com/DEIN-USERNAME/chat-app.git
git branch -M main
git push -u origin main
```

### Schritt 5: GitHub Pages aktivieren
Wie in Methode 1, Schritt 3

---

## Methode 3: GitHub Desktop (GUI) 🖱️

Wenn du eine grafische Oberfläche bevorzugst:

1. Lade [GitHub Desktop](https://desktop.github.com/) herunter
2. Melde dich an
3. Klicke "Create a new repository on your hard drive"
4. Name: `chat-app`
5. Local path: Wähle den Chat-Ordner
6. "Publish repository"
7. GitHub Pages aktivieren (Wie oben)

---

## Nach dem Deployment 🎯

### Änderungen pushen
Wenn du Änderungen machen möchtest:

**Mit Git CLI:**
```bash
git add .
git commit -m "Update description"
git push
```

**Mit GitHub Desktop:**
1. Ändere die Dateien
2. GitHub Desktop zeigt die Änderungen
3. Schreibe Commit Message
4. Klicke "Commit to main"
5. Klicke "Push origin"

---

## Troubleshooting 🔧

### "404 Error" - Seite nicht gefunden
- ✅ Warte 1-2 Minuten nach dem Upload
- ✅ Prüfe die URL: `https://USERNAME.github.io/REPO-NAME/`
- ✅ Stelle sicher, dass es ein PUBLIC Repository ist
- ✅ index.html existiert im Root-Verzeichnis

### Pages werden nicht aktualisiert
- ✅ Hard Refresh: `Ctrl + Shift + R`
- ✅ Browser Cache löschen
- ✅ Im Incognito-Fenster testen

### "Permission denied" Error
- ✅ Prüfe deine Git Credentials
- ✅ Verwende SSH statt HTTPS (fortgeschritten)
- ✅ Generiere ein [Personal Access Token](https://github.com/settings/tokens)

---

## Domain anpassen (Optional)

Wenn du eine Custom Domain verwenden möchtest:

1. Repository Settings → Pages
2. "Custom domain"
3. Gib deine Domain ein (z.B. `chat.example.com`)
4. DNS-Records bei deinem Domain-Provider updaten
5. [Ausführliche Anleitung](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## SSL/HTTPS ✅

GitHub Pages ist standardmäßig mit HTTPS gesichert - keine zusätzliche Konfiguration nötig!

---

## Weitere Infos 📚

- [GitHub Pages Dokumentation](https://docs.github.com/en/pages)
- [GitHub Actions für Automation](https://docs.github.com/en/actions)
- [Markdownguide für README](https://www.markdownguide.org/)

---

**Viel Erfolg beim Deployen! 🚀**
