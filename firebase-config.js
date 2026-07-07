/**
 * Firebase Configuration (Optional)
 * 
 * Für echte Echtzeit-Synchronisation & Cloud-Backup
 * 
 * Setup:
 * 1. Gehe zu https://firebase.google.com
 * 2. Erstelle ein neues Projekt
 * 3. Wähle "Web App"
 * 4. Kopiere deine Config hier rein
 * 5. Uncommente den Code unten
 * 6. Nutze die Firebase-Funktionen in script.js
 */

// Beispiel Firebase Config (REPLACE MIT DEINEN WERTEN!)
/*
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "chat-app-xxx.firebaseapp.com",
  projectId: "chat-app-xxx",
  storageBucket: "chat-app-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};

// Firebase initialisieren
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
*/

/**
 * Alternative: Supabase (PostgreSQL + Realtime)
 * 
 * Setup:
 * 1. Gehe zu https://supabase.io
 * 2. Erstelle ein Projekt
 * 3. Erstelle eine "messages" Tabelle
 * 4. Nutze den Supabase Client
 * 
 * Vorteil: Open Source, vollständige Kontrolle
 */

/*
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@latest/+esm";

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);

export { supabase };
*/

/**
 * Noch einfacher: Firebase Realtime Database
 * 
 * Struktur:
 * users/
 *   {userId}/
 *     username: "john"
 *     email: "john@example.com"
 * 
 * chats/
 *   {chatId}/
 *     participants: [userId1, userId2]
 *     messages/
 *       {messageId}/
 *         senderId: "userId"
 *         text: "Hallo!"
 *         timestamp: 1234567890
 */

/**
 * Für die Zukunft: WebSocket Backend
 * 
 * Einfacher Node.js Server mit Socket.io:
 * 
 * - Echtzeit Messaging
 * - Typing Indicators
 * - Online Status
 * - Message History in DB (MongoDB)
 * 
 * Deploy auf:
 * - Heroku (kostenlos)
 * - Railway (empfohlen)
 * - Render
 * - DigitalOcean
 */
