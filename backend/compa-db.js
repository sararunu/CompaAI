import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'chat.db'));

// Inicializar tabla
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// --- Funciones ---
export function loadHistory(limit = 50) {
  const stmt = db.prepare(`
    SELECT role, content FROM messages
    ORDER BY id ASC
    LIMIT ?
  `);
  const rows = stmt.all(limit);
  return rows;
}

export function saveMessage(role, content) {
  const stmt = db.prepare('INSERT INTO messages (role, content) VALUES (?, ?)');
  stmt.run(role, content);
  
  // Mantener solo últimos 50 (borrar más antiguos)
  const deleteStmt = db.prepare(`
    DELETE FROM messages WHERE id NOT IN (
      SELECT id FROM messages ORDER BY created_at DESC LIMIT 50
    )
  `);
  deleteStmt.run();
}

export function clearHistory() {
  db.prepare('DELETE FROM messages').run();
}

export function close() {
  db.close();
}