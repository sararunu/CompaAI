///*ahora el historial se guarda en bbdd-----> compa-db.js */

// import fs from 'fs';
// import path from 'path';

// const FILE = path.join(process.cwd(), 'chat-history.json');

// export function loadHistory() {
//   try {
//     const data = fs.readFileSync(FILE, 'utf-8');
//     return JSON.parse(data);
//   } catch {
//     return []; // archivo no existe o corrupto
//   }
// }

// export function saveHistory(history) {
//   // Guardar solo últimos 50 mensajes para no crecer infinito
//   const trimmed = history.slice(-50);
//   fs.writeFileSync(FILE, JSON.stringify(trimmed, null, 2));
// }

// export function clearHistory() {
//   fs.writeFileSync(FILE, '[]');
// }