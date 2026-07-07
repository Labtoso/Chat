// Chat Application JavaScript
class LabtosoChat {
    constructor() {
        this.users = this.loadUsers();
        this.chats = this.loadChats();
        this.currentUser = null;
        this.currentChat = null;
        this.init();
    }

    init() {
        this.initializeUsers();
        this.setupEventListeners();
        this.checkSession();
    }

    initializeUsers() {
        // Demo user if no users exist
        if (this.users.length === 0) {
            this.users.push({
                id: '1',
                username: 'admin',
                password: '1234',
                avatar: 'A',
                createdAt: new Date().toISOString()
            });
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
            this.showScreen('registerScreen');
        });

        document.getElementById('loginToggle').addEventListener('click', (e) => {
            e.preventDefault();
            this.showScreen('loginScreen');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Chat buttons
        document.getElementById('newChatBtn').addEventListener('click', () => this.openNewChatModal());
        document.getElementById('newChatBtnWelcome').addEventListener('click', () => this.openNewChatModal());
        document.getElementById('createChatBtn').addEventListener('click', () => this.createNewChat());

        // Message form
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
        const sessionUser = sessionStorage.getItem('currentUser');
        if (sessionUser) {
            this.currentUser = JSON.parse(sessionUser);
            this.showScreen('chatScreen');
            this.initializeChat();
        } else {
            this.showScreen('loginScreen');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = this.users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.showScreen('chatScreen');
            this.initializeChat();
            this.clearLoginForm();
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
        this.showScreen('loginScreen');
        this.clearRegisterForm();
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
        document.getElementById('messageInput').focus();
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
            this.showScreen('loginScreen');
            this.clearLoginForm();
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    clearLoginForm() {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    clearRegisterForm() {
        document.getElementById('regUsername').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regPasswordConfirm').value = '';
    }

    loadUsers() {
        const stored = localStorage.getItem('chatUsers');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('chatUsers', JSON.stringify(this.users));
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
