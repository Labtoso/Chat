// Chat Application JavaScript
class LabtosoChat {
    constructor() {
        this.ENCRYPTION_KEY = 'LabtosoChatSecureKey2024'; // Verschlüsselungsschlüssel
        this.TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 Tage
        this.SHARED_USERS_URL = 'https://raw.githubusercontent.com/Labtoso/Chat/main/shared-users.json';
        this.users = [];
        this.chats = this.loadChats();
        this.currentUser = null;
        this.currentChat = null;
        this.init();
    }

    async init() {
        await this.loadSharedUsers();
        this.setupEventListeners();
        this.setupRouting();
        // checkSession wird automatisch via setupRouting aufgerufen
    }

    /**
     * Setup URL Routing - Hash-based für GitHub Pages Support
     */
    setupRouting() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });

        // Handle initial route / check session
        this.checkSession();
    }

    /**
     * Handle Route basierend auf URL Hash
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const routePath = hash.split('?')[0]; // Entferne Query Parameters
        
        const sessionUser = sessionStorage.getItem('currentUser');
        const tokenData = this.loadAuthToken();

        // Wenn angemeldet und auf /chats → zeige Chat
        if ((sessionUser || tokenData) && routePath === '/chats') {
            if (!this.currentUser && sessionUser) {
                this.currentUser = JSON.parse(sessionUser);
            } else if (!this.currentUser && tokenData) {
                const user = this.users.find(u => u.id === tokenData.userId);
                if (user) this.currentUser = user;
            }
            this.showScreen('chatScreen');
            this.initializeChat?.();
            return;
        }

        // Wenn registrieren
        if (routePath === '/reg') {
            this.showScreen('registerScreen');
            return;
        }

        // Sonst → Login
        this.showScreen('loginScreen');
    }

    /**
     * Navigate to route
     */
    navigateTo(path) {
        window.location.hash = path;
    }

    /**
     * Lädt die gemeinsamen Benutzer von GitHub oder nutzt lokale Daten
     */
    async loadSharedUsers() {
        try {
            const response = await fetch(this.SHARED_USERS_URL);
            if (response.ok) {
                const data = await response.json();
                const users = data.users || [];
                // Wenn Benutzer vorhanden, nutze sie
                if (users.length > 0) {
                    this.users = users;
                    return;
                }
            }
        } catch (error) {
            console.warn('Konnte gemeinsame Benutzerdatenbank nicht laden');
        }
        
        // Fallback auf lokale Daten wenn GitHub leer oder fehlgeschlagen
        this.users = this.loadLocalUsers();
    }

    /**
     * Lädt lokale Benutzerdaten als Fallback
     */
    loadLocalUsers() {
        const stored = localStorage.getItem('chatUsers');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Speichert Benutzer lokal
     */
    saveLocalUsers() {
        localStorage.setItem('chatUsers', JSON.stringify(this.users));
    }

    /**
     * Verschlüsselt einen String
     */
    encrypt(text) {
        return CryptoJS.AES.encrypt(text, this.ENCRYPTION_KEY).toString();
    }

    /**
     * Entschlüsselt einen String
     */
    decrypt(encrypted) {
        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            return null;
        }
    }

    /**
     * Erstellt ein verschlüsseltes Auth-Token
     */
    createAuthToken(user) {
        const tokenData = {
            userId: user.id,
            username: user.username,
            timestamp: Date.now(),
            expiry: Date.now() + this.TOKEN_EXPIRY
        };
        return this.encrypt(JSON.stringify(tokenData));
    }

    /**
     * Validiert ein Auth-Token
     */
    validateAuthToken(token) {
        const decrypted = this.decrypt(token);
        if (!decrypted) return null;
        
        try {
            const tokenData = JSON.parse(decrypted);
            // Check if token is expired
            if (tokenData.expiry < Date.now()) {
                return null;
            }
            return tokenData;
        } catch (error) {
            return null;
        }
    }

    /**
     * Speichert den Auth-Token persistent
     */
    saveAuthToken(user) {
        const token = this.createAuthToken(user);
        localStorage.setItem('labtoso_auth_token', token);
        localStorage.setItem('labtoso_auth_timestamp', Date.now().toString());
    }

    /**
     * Lädt den Auth-Token
     */
    loadAuthToken() {
        const token = localStorage.getItem('labtoso_auth_token');
        if (!token) return null;
        
        const tokenData = this.validateAuthToken(token);
        if (!tokenData) {
            // Token ist abgelaufen oder invalid
            this.clearAuthToken();
            return null;
        }
        
        return tokenData;
    }

    /**
     * Löscht den Auth-Token
     */
    clearAuthToken() {
        localStorage.removeItem('labtoso_auth_token');
        localStorage.removeItem('labtoso_auth_timestamp');
    }

    initializeUsers() {
        // Demo users if no users exist
        if (this.users.length === 0) {
            this.users.push(
                {
                    id: '1',
                    username: 'admin',
                    password: '1234',
                    avatar: 'A',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    username: 'Labtoso',
                    password: 'labtoso123',
                    avatar: 'L',
                    createdAt: new Date().toISOString()
                }
            );
            this.saveUsers();
        }
    }

    setupEventListeners() {
        // Login Form
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Register toggle
        document.getElementById('registerToggle').addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('/reg');
        });

        document.getElementById('loginToggle').addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('/login');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Export/Import
        document.getElementById('exportBtn').addEventListener('click', () => this.downloadBackup());
        document.getElementById('importBtn').addEventListener('click', () => this.openImportDialog());

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openUsersManagementModal());

        // Chat buttons
        document.getElementById('newChatBtn').addEventListener('click', () => this.openNewChatModal());
        document.getElementById('newChatBtnWelcome').addEventListener('click', () => this.openNewChatModal());
        document.getElementById('createChatBtn').addEventListener('click', () => this.createNewChat());

        // Message form (wichtig!)
        document.getElementById('messageForm').addEventListener('submit', (e) => this.sendMessage(e));

        // Search
        document.getElementById('searchChats').addEventListener('input', (e) => this.searchChats(e.target.value));

        // Modal close buttons
        document.querySelectorAll('[data-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = btn.dataset.modal;
                this.closeModal(modalId);
            });
        });

        // Modal overlay click
        document.getElementById('modalOverlay').addEventListener('click', () => {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            document.getElementById('modalOverlay').classList.remove('active');
        });
    }

    checkSession() {
        // Prüfe zuerst sessionStorage für aktuelle Session
        let sessionUser = sessionStorage.getItem('currentUser');
        
        if (sessionUser) {
            this.currentUser = JSON.parse(sessionUser);
            // Nur navigieren wenn nicht schon auf /chats
            const currentHash = window.location.hash.slice(1) || '/';
            if (currentHash !== '/chats') {
                this.navigateTo('/chats');
            }
            return;
        }

        // Prüfe dann verschlüsseltes Token in localStorage ("Angemeldet bleiben")
        const tokenData = this.loadAuthToken();
        if (tokenData) {
            // Token ist gültig, finde den Benutzer
            const user = this.users.find(u => u.id === tokenData.userId);
            if (user) {
                this.currentUser = user;
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                const currentHash = window.location.hash.slice(1) || '/';
                if (currentHash !== '/chats') {
                    this.navigateTo('/chats');
                }
                return;
            }
        }

        // Keine aktive Session oder Token vorhanden
        const currentHash = window.location.hash.slice(1) || '/';
        if (currentHash === '/') {
            this.navigateTo('/login');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        const user = this.users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            
            // Speichere verschlüsseltes Token wenn "Angemeldet bleiben" aktiviert
            if (rememberMe) {
                this.saveAuthToken(user);
            }
            
            // Speichere auch in sessionStorage für aktuelle Session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            this.clearLoginForm();
            this.navigateTo('/chats');
        } else {
            alert('❌ Ungültige Anmeldedaten!');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;

        // Validation
        if (!username) {
            alert('❌ Benutzername darf nicht leer sein!');
            return;
        }

        if (username.length < 3) {
            alert('❌ Benutzername muss mindestens 3 Zeichen lang sein!');
            return;
        }

        if (password !== passwordConfirm) {
            alert('❌ Passwörter stimmen nicht überein!');
            return;
        }

        if (password.length < 6) {
            alert('❌ Passwort muss mindestens 6 Zeichen lang sein!');
            return;
        }

        // Check if username already exists
        if (this.users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            alert('❌ Dieser Benutzername existiert bereits! Wähle einen anderen.');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            password,
            avatar: username.charAt(0).toUpperCase(),
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        alert('✅ Registrierung erfolgreich! Bitte melde dich an.');
        this.clearRegisterForm();
        this.navigateTo('/login');
    }

    initializeChat() {
        // Update user info
        document.getElementById('userNameDisplay').textContent = this.currentUser.username;
        document.getElementById('userAvatar').textContent = this.currentUser.avatar;

        // Load and display chats
        this.loadChats();
        this.displayChats();
    }

    openNewChatModal() {
        document.getElementById('newChatModal').classList.add('active');
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.getElementById('modalOverlay').classList.remove('active');
    }

    createNewChat() {
        const chatPartner = document.getElementById('chatPartner').value.trim();
        const chatName = document.getElementById('chatName').value.trim();

        if (!chatPartner) {
            alert('❌ Bitte gib einen Chat Partner an!');
            return;
        }

        // Check if user exists
        const partner = this.users.find(u => u.username === chatPartner);
        if (!partner) {
            alert('❌ Benutzer nicht gefunden!');
            return;
        }

        if (partner.id === this.currentUser.id) {
            alert('❌ Du kannst keinen Chat mit dir selbst starten!');
            return;
        }

        // Check if chat already exists
        const existingChat = this.chats.find(c => {
            const participants = c.participants.map(p => p.id).sort();
            const newParticipants = [this.currentUser.id, partner.id].sort();
            return JSON.stringify(participants) === JSON.stringify(newParticipants);
        });

        if (existingChat) {
            this.selectChat(existingChat.id);
            this.closeModal('newChatModal');
            return;
        }

        // Create new chat
        const newChat = {
            id: Date.now().toString(),
            name: chatName || `${this.currentUser.username} & ${chatPartner}`,
            participants: [this.currentUser, partner],
            messages: [],
            createdAt: new Date().toISOString()
        };

        this.chats.push(newChat);
        this.saveChats();
        this.displayChats();
        this.selectChat(newChat.id);
        this.closeModal('newChatModal');

        // Clear form
        document.getElementById('chatPartner').value = '';
        document.getElementById('chatName').value = '';
    }

    selectChat(chatId) {
        this.currentChat = this.chats.find(c => c.id === chatId);
        
        // Update UI
        document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-chat-id="${chatId}"]`)?.classList.add('active');

        // Show chat view
        document.getElementById('welcomeArea').classList.add('hidden');
        document.getElementById('chatView').classList.remove('hidden');

        // Update chat header
        const otherParticipant = this.currentChat.participants.find(p => p.id !== this.currentUser.id);
        document.getElementById('chatTitle').textContent = otherParticipant ? otherParticipant.username : this.currentChat.name;

        // Load messages
        this.displayMessages();

        // Focus message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
    }

    displayChats() {
        const chatsList = document.getElementById('chatsList');
        chatsList.innerHTML = '';

        if (this.chats.length === 0) {
            chatsList.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">Keine Chats vorhanden</div>';
            return;
        }

        this.chats.forEach(chat => {
            const otherParticipant = chat.participants.find(p => p.id !== this.currentUser.id);
            const lastMessage = chat.messages[chat.messages.length - 1];
            
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.dataset.chatId = chat.id;
            if (this.currentChat?.id === chat.id) {
                chatItem.classList.add('active');
            }

            chatItem.innerHTML = `
                <div class="chat-avatar">${otherParticipant?.avatar || '💬'}</div>
                <div class="chat-item-content">
                    <div class="chat-item-title">${otherParticipant?.username || chat.name}</div>
                    <div class="chat-item-preview">${lastMessage ? lastMessage.text.substring(0, 50) : 'Keine Nachrichten'}</div>
                </div>
                <div class="chat-item-time">${lastMessage ? this.formatTime(lastMessage.timestamp) : ''}</div>
            `;

            chatItem.addEventListener('click', () => this.selectChat(chat.id));
            chatsList.appendChild(chatItem);
        });
    }

    displayMessages() {
        const messagesArea = document.getElementById('messagesArea');
        messagesArea.innerHTML = '';

        if (!this.currentChat || this.currentChat.messages.length === 0) {
            messagesArea.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">Keine Nachrichten yet</div>';
            return;
        }

        this.currentChat.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.senderId === this.currentUser.id ? 'own' : ''}`;

            const sender = this.currentChat.participants.find(p => p.id === msg.senderId);
            const timeStr = this.formatMessageTime(msg.timestamp);

            messageDiv.innerHTML = `
                <div class="message-avatar">${sender?.avatar || '?'}</div>
                <div class="message-content">
                    <div class="message-author">${sender?.username || 'Unknown'}</div>
                    <div class="message-bubble">${this.escapeHtml(msg.text)}</div>
                    <div class="message-time">${timeStr}</div>
                </div>
            `;

            messagesArea.appendChild(messageDiv);
        });

        // Scroll to bottom
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    sendMessage(e) {
        e.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();

        if (!text || !this.currentChat) return;

        const message = {
            id: Date.now().toString(),
            senderId: this.currentUser.id,
            text,
            timestamp: new Date().toISOString()
        };

        this.currentChat.messages.push(message);
        this.saveChats();

        messageInput.value = '';
        this.displayMessages();

        // Simulate other user reading (optional - remove if not needed)
        // You could add a typing indicator here
    }

    searchChats(query) {
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            const title = item.querySelector('.chat-item-title').textContent.toLowerCase();
            if (title.includes(query.toLowerCase())) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    logout() {
        if (confirm('Wirklich abmelden?')) {
            this.currentUser = null;
            this.currentChat = null;
            sessionStorage.removeItem('currentUser');
            this.clearAuthToken(); // Lösche auch das verschlüsselte Token
            this.clearLoginForm();
            this.navigateTo('/login');
        }
    }

    /**
     * Exportiert alle Benutzer & Chats als JSON (für Backup/Sync)
     */
    exportData() {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            users: this.users,
            chats: this.chats
        };
        return JSON.stringify(data, null, 2);
    }

    /**
     * Importiert Benutzer & Chats aus JSON
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (!data.users || !Array.isArray(data.users)) {
                alert('❌ Ungültiges Dateiformat!');
                return false;
            }

            // Merge users (nicht überschreiben, hinzufügen wenn nicht existent)
            data.users.forEach(importedUser => {
                const exists = this.users.find(u => u.id === importedUser.id || u.username === importedUser.username);
                if (!exists) {
                    this.users.push(importedUser);
                }
            });

            // Merge chats
            if (data.chats && Array.isArray(data.chats)) {
                data.chats.forEach(importedChat => {
                    const exists = this.chats.find(c => c.id === importedChat.id);
                    if (!exists) {
                        this.chats.push(importedChat);
                    }
                });
            }

            this.saveUsers();
            this.saveChats();
            alert('✅ Daten erfolgreich importiert!');
            return true;
        } catch (error) {
            alert('❌ Fehler beim Importieren: ' + error.message);
            return false;
        }
    }

    /**
     * Download exportierte Daten als Datei
     */
    downloadBackup() {
        const data = this.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `labtoso-chat-backup-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('✅ Backup heruntergeladen!');
    }

    /**
     * Öffnet File-Dialog zum Importieren
     */
    openImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                this.importData(event.target.result);
                this.displayChats(); // Refresh UI
            };
            reader.readAsText(file);
        };
        input.click();
    }

    /**
     * Öffnet das Benutzer-Verwaltungs-Modal
     */
    openUsersManagementModal() {
        this.displayUsersManagement();
        document.getElementById('usersManagementModal').classList.add('active');
        document.getElementById('modalOverlay').classList.add('active');
    }

    /**
     * Zeigt alle Benutzer im Management Modal
     */
    displayUsersManagement() {
        const listDiv = document.getElementById('usersManagementList');
        listDiv.innerHTML = '';

        if (this.users.length === 0) {
            listDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Keine Benutzer</p>';
            return;
        }

        this.users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.style.cssText = `
                padding: 12px;
                background: rgba(26, 31, 58, 0.5);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            `;

            const userInfo = document.createElement('div');
            userInfo.style.cssText = 'flex: 1;';
            userInfo.innerHTML = `
                <div style="font-weight: 600; color: var(--text-primary);">${user.username}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">ID: ${user.id}</div>
            `;

            const actions = document.createElement('div');
            actions.style.cssText = 'display: flex; gap: 8px;';
            
            // Block Button
            const blockBtn = document.createElement('button');
            blockBtn.className = 'btn-icon';
            blockBtn.title = user.blocked ? 'Blockierung aufheben' : 'Blockieren';
            blockBtn.innerHTML = `<i class="fas ${user.blocked ? 'fa-unlock' : 'fa-ban'}"></i>`;
            blockBtn.style.color = user.blocked ? 'var(--accent-color)' : 'var(--secondary-color)';
            blockBtn.onclick = () => this.toggleBlockUser(user.id);

            // Mute Button
            const muteBtn = document.createElement('button');
            muteBtn.className = 'btn-icon';
            muteBtn.title = user.muted ? 'Stummschaltung aufheben' : 'Stummschalten';
            muteBtn.innerHTML = `<i class="fas ${user.muted ? 'fa-volume-up' : 'fa-volume-mute'}"></i>`;
            muteBtn.style.color = user.muted ? 'var(--accent-color)' : 'var(--secondary-color)';
            muteBtn.onclick = () => this.toggleMuteUser(user.id);

            // Delete Button (nur für andere Benutzer, nicht für sich selbst)
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon';
            deleteBtn.title = 'Benutzer löschen';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.style.color = 'var(--secondary-color)';
            if (user.id === this.currentUser.id) {
                deleteBtn.disabled = true;
                deleteBtn.style.opacity = '0.5';
                deleteBtn.title = 'Du kannst dich nicht selbst löschen';
            } else {
                deleteBtn.onclick = () => this.deleteUser(user.id);
            }

            actions.appendChild(blockBtn);
            actions.appendChild(muteBtn);
            actions.appendChild(deleteBtn);

            userItem.appendChild(userInfo);
            userItem.appendChild(actions);
            listDiv.appendChild(userItem);
        });
    }

    /**
     * Blockiert/Entblockiert einen Benutzer
     */
    toggleBlockUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.blocked = !user.blocked;
            this.saveUsers();
            this.displayUsersManagement();
            this.syncUsersToGitHub();
            alert(user.blocked ? '🚫 Benutzer blockiert' : '✅ Blockierung aufgehoben');
        }
    }

    /**
     * Stummschaltet/Enstummschaltet einen Benutzer
     */
    toggleMuteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.muted = !user.muted;
            this.saveUsers();
            this.displayUsersManagement();
            this.syncUsersToGitHub();
            alert(user.muted ? '🔇 Benutzer stummgeschaltet' : '🔊 Stummschaltung aufgehoben');
        }
    }

    /**
     * Löscht einen Benutzer
     */
    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`⚠️ Benutzer "${user.username}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!`)) {
            this.users = this.users.filter(u => u.id !== userId);
            this.saveUsers();
            this.displayUsersManagement();
            this.syncUsersToGitHub();
            alert('✅ Benutzer gelöscht');
        }
    }

    /**
     * Synchronisiert Benutzer zu GitHub (nur lokal für jetzt)
     */
    syncUsersToGitHub() {
        // Speichere lokal - kann später mit GitHub Actions automatisiert werden
        const data = {
            users: this.users,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            // Versuche zu kopieren - Benutzer kann es auf GitHub pushen
            const jsonStr = JSON.stringify(data, null, 2);
            
            // In Console ausgeben für manuelles Copy-Paste
            console.log('📋 Benutzer-Daten zum Synchronisieren:');
            console.log(jsonStr);
            
            alert('✅ Benutzer-Daten aktualisiert! Um zu synchronisieren, exportiere die Daten und pushe sie zu GitHub.');
        } catch (error) {
            console.error('Fehler beim Synchronisieren:', error);
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    clearLoginForm() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('rememberMe').checked = false;
    }

    clearRegisterForm() {
        document.getElementById('regUsername').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regPasswordConfirm').value = '';
    }

    /**
     * Speichert neue Benutzer lokal
     */
    saveUsers() {
        this.saveLocalUsers();
    }

    /**
     * Lädt Benutzer
     */
    loadUsers() {
        return this.users;
    }

    loadChats() {
        const stored = localStorage.getItem('chatData');
        if (!stored) return [];
        
        const chats = JSON.parse(stored);
        // Filter chats for current user
        if (this.currentUser) {
            return chats.filter(chat => 
                chat.participants.some(p => p.id === this.currentUser.id)
            );
        }
        return chats;
    }

    saveChats() {
        const allChats = localStorage.getItem('chatData');
        const chatsArray = allChats ? JSON.parse(allChats) : [];
        
        this.chats.forEach(chat => {
            const index = chatsArray.findIndex(c => c.id === chat.id);
            if (index > -1) {
                chatsArray[index] = chat;
            } else {
                chatsArray.push(chat);
            }
        });

        localStorage.setItem('chatData', JSON.stringify(chatsArray));
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) return 'gerade eben';
        // Less than 1 hour
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
        // Less than 1 day
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h';
        // Same year
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric' });
        }
        // Different year
        return date.toLocaleDateString('de-DE', { year: '2-digit', month: 'numeric', day: 'numeric' });
    }

    formatMessageTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chat = new LabtosoChat();
});
