# Compa‑IA
<img width="250" height="auto" alt="image" src="https://github.com/user-attachments/assets/93546457-2f92-4775-ba94-4dd2dae7ed2b" />

Aplicación local creada con **React + Vite** y **Node.js**, usando **SQLite** como base de datos para la memoria.  
Motor de inferencia: **Ollama (llama3.2:3b)**  
STT/TTS: **Web Speech API** del navegador.

---

## Instrucciones para probarlo

### 1. Instalar Ollama  
Descarga e instala Ollama en tu PC (versión actual: **0.30.11**)  
Página oficial: https://ollama.com

### 2. Iniciar Ollama  
Antes de arrancar el backend, ejecuta:
```text
ollama serve
```
### 3. Descargar el modelo (solo la primera vez)
```text
ollama pull llama3.2:3b
```

### 4. Arrancar el backend
```text
cd backend
npm run dev
```

### 5. Arrancar el frontend
```text
cd frontend
npm run dev
```
(http://localhost:5173)

---

## <span style="color:red">Notas</span>

- El comportamiento base de la IA está definido en un **prompt del sistema**. Puedes modificarlo en:  
  `/backend/prompts/system.js`

- Si quieres usar otro modelo de Ollama, cámbialo en la propiedad **model** de:  
  `/backend/server.js` (línea 20)

